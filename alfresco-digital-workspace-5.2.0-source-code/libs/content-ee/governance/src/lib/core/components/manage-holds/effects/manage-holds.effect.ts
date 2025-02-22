/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { EMPTY, interval } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, filter, switchMap, takeLast, takeWhile, withLatestFrom } from 'rxjs/operators';
import {
    BULK_HOLDS_WARNING,
    BulkHoldsWarningAction,
    MANAGE_BULK_HOLDS_TO_FILES,
    MANAGE_BULK_HOLDS_TO_FOLDER,
    MANAGE_HOLDS,
    MANAGE_SINGLE_HOLDS,
    ManageBulkHoldsToFilesAction,
    ManageBulkHoldsToFolderAction,
    ManageHoldsAction,
    ManageSingleHoldsAction
} from '../actions/manage-holds.actions';
import { ManageHoldsService } from '../services/manage-holds.service';
import { ManageHoldsDialogService } from '../services/manage-holds-dialog.service';
import { NotificationService } from '@alfresco/adf-core';
import { HoldBody, HoldBulkStatusEntry, } from '@alfresco/js-api';
import { DocumentListService, SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { Store } from '@ngrx/store';
import { AppExtensionService } from '@alfresco/aca-shared';
import { OperationMode } from '../../../model/bulk-operation.model';
import { FilePlanService } from '../../../services/file-plan.service';
import { ExistingHoldDataToConfirm } from '../model/existing-hold-data-to-confirm.model';
import { Location } from '@angular/common';

@Injectable()
export class ManageHoldsEffect {
    private store = inject(Store);
    private actions$ = inject(Actions);
    private documentListService = inject(DocumentListService);
    private extensions = inject(AppExtensionService);
    private filePlanService = inject(FilePlanService);
    private manageHoldsService = inject(ManageHoldsService);
    private manageHoldsDialogService = inject(ManageHoldsDialogService);
    private notificationService = inject(NotificationService);
    private searchResults = inject(SearchQueryBuilderService);
    private location = inject(Location);

    manageHolds$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType<ManageHoldsAction>(MANAGE_HOLDS),
                concatMap(({ payload }) => {
                    if (payload.isFolder) {
                        this.store.dispatch(new ManageBulkHoldsToFolderAction(payload.id));
                    } else {
                        this.store.dispatch(new ManageSingleHoldsAction(payload));
                    }
                    return EMPTY;
                })
            ),
        { dispatch: false }
    );

    manageSingleHolds$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType<ManageSingleHoldsAction>(MANAGE_SINGLE_HOLDS),
                concatMap(({ payload }) =>
                    this.filePlanService.checkFilePlan().pipe(
                        concatMap((filePlanExists) => {
                            if (!filePlanExists) {
                                this.onNoFilePlan();
                                return EMPTY;
                            }
                            this.manageHoldsDialogService
                                .openDialog(OperationMode.SINGLE, payload.id)
                                .afterClosed()
                                .pipe(
                                    filter(Boolean),
                                    withLatestFrom(this.manageHoldsDialogService.dataToConfirm$, this.manageHoldsDialogService.selectedTabIndex$),
                                    switchMap(([_, dataToConfirm, selectedTabIndex]) => {
                                        if (selectedTabIndex === 0) {
                                            const {
                                                selectedHoldIds,
                                                unselectedHoldIds
                                            } = dataToConfirm as ExistingHoldDataToConfirm;

                                            return this.manageHoldsService.saveExistingHolds({
                                                nodeId: payload.id,
                                                selectedHoldIds,
                                                unselectedHoldIds
                                            });
                                        } else {
                                            return this.manageHoldsService.saveNewHold(dataToConfirm as HoldBody, payload.id);
                                        }
                                    })
                                )
                                .subscribe({
                                    next: () => this.onApplyHoldsSuccess(),
                                    error: (error: Error) => this.onApplyHoldsError(JSON.parse(error.message).error.briefSummary)
                                });
                            return EMPTY;
                        })
                    )
                )
            ),
        { dispatch: false }
    );

    manageBulkHoldsToFolder$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType<ManageBulkHoldsToFolderAction>(MANAGE_BULK_HOLDS_TO_FOLDER),
                concatMap(({ folderId }) =>
                    this.filePlanService.checkFilePlan().pipe(
                        concatMap((filePlanExists) => {
                            if (!filePlanExists) {
                                this.onNoFilePlan();
                                return EMPTY;
                            }
                            this.manageHoldsDialogService
                                .openDialog(OperationMode.BULK, folderId)
                                .afterClosed()
                                .pipe(
                                    filter(Boolean),
                                    withLatestFrom(this.manageHoldsDialogService.dataToConfirm$, this.manageHoldsDialogService.selectedTabIndex$),
                                    switchMap(([_, dataToConfirm, selectedTabIndex]) => {
                                        if (selectedTabIndex === 0) {
                                            const { selectedHoldIds } = dataToConfirm as ExistingHoldDataToConfirm;
                                            this.manageHoldsService.holdIdForBulkStatus = selectedHoldIds[0];

                                            return this.manageHoldsService.bulkAssignHoldToFolder(selectedHoldIds[0], folderId);
                                        } else {
                                            return this.manageHoldsService.bulkSaveNewHoldToFolder(dataToConfirm as HoldBody, folderId);
                                        }
                                    })
                                )
                                .subscribe({
                                    next: (bulkResponse) => {
                                        this.openSnackbarMessage('GOVERNANCE.MANAGE_HOLDS.BULK_APPLY_HOLDS_STARTED', 5000);
                                        this.waitForBulkOperationCompletion(bulkResponse.entry.bulkStatusId);
                                    },
                                    error: (error: Error) => this.onApplyHoldsError(JSON.parse(error.message).error.briefSummary)
                                });
                            return EMPTY;
                        })
                    )
                )
            ),
        { dispatch: false }
    );

    manageBulkHoldsToFiles$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType<ManageBulkHoldsToFilesAction>(MANAGE_BULK_HOLDS_TO_FILES),
                concatMap(() =>
                    this.filePlanService.checkFilePlan().pipe(
                        concatMap((filePlanExists) => {
                            if (!filePlanExists) {
                                this.onNoFilePlan();
                                return EMPTY;
                            }
                            this.manageHoldsService.holdIdForBulkStatus = null;
                            this.manageHoldsDialogService
                                .openDialog(OperationMode.BULK)
                                .afterClosed()
                                .pipe(
                                    filter(Boolean),
                                    withLatestFrom(this.manageHoldsDialogService.dataToConfirm$, this.manageHoldsDialogService.selectedTabIndex$),
                                    switchMap(([_, dataToConfirm, selectedTabIndex]) => {
                                        if (selectedTabIndex === 0) {
                                            const { selectedHoldIds } = dataToConfirm as ExistingHoldDataToConfirm;
                                            this.manageHoldsService.holdIdForBulkStatus = selectedHoldIds[0];

                                            return this.manageHoldsService.bulkAssignHold(selectedHoldIds[0], this.getQuery());
                                        } else {
                                            return this.manageHoldsService.bulkSaveNewHoldToFiles(dataToConfirm as HoldBody, this.getQuery());
                                        }
                                    })
                                )
                                .subscribe({
                                    next: (bulkResponse) => {
                                        this.extensions.bulkActionExecuted();
                                        this.openSnackbarMessage('GOVERNANCE.MANAGE_HOLDS.BULK_APPLY_HOLDS_STARTED', 5000);
                                        this.waitForBulkOperationCompletion(bulkResponse.entry.bulkStatusId);
                                    },
                                    error: (error: Error) => this.onApplyHoldsError(JSON.parse(error.message).error.briefSummary)
                                });
                            return EMPTY;
                        })
                    )
                )
            ),
        { dispatch: false }
    );

    bulkHoldsWarning$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType<BulkHoldsWarningAction>(BULK_HOLDS_WARNING),
                concatMap(() =>
                    this.filePlanService.checkFilePlan().pipe(
                        concatMap((filePlanExists) => {
                            if (!filePlanExists) {
                                this.onNoFilePlan();
                                this.extensions.bulkActionExecuted();
                                return EMPTY;
                            }
                            this.manageHoldsDialogService
                                .openWarningDialog()
                                .afterClosed()
                                .subscribe((value) => {
                                    if (value) {
                                        this.store.dispatch(new ManageBulkHoldsToFilesAction());
                                    } else {
                                        this.extensions.bulkActionExecuted();
                                    }
                                });
                            return EMPTY;
                        })
                    )
                )
            ),
        { dispatch: false }
    );

    private onApplyHoldsSuccess() {
        this.handleReload();
        this.openSnackbarMessage('GOVERNANCE.MANAGE_HOLDS.APPLY_HOLDS_SUCCESS');
    }

    private openSnackbarMessage(message: string, duration: number = 0, showReloadButton: boolean = false, interpolateArgs?: any) {
        this.notificationService.openSnackMessageAction(
            message,
            showReloadButton ? 'COMMON.RELOAD' : 'GOVERNANCE.MANAGE_HOLDS.ACKNOWLEDGE',
            {
                duration: duration,
                data: {
                    actionIcon: showReloadButton ? 'close' : null,
                }
            },
            interpolateArgs
        ).onAction().subscribe(() => {
            if (showReloadButton) {
                this.handleReload();
            }
        });
    }

    private onApplyHoldsError(errorMessage: string) {
        this.notificationService.openSnackMessageAction(errorMessage, 'GOVERNANCE.MANAGE_HOLDS.ACKNOWLEDGE', {
            duration: 0,
            data: {
                actionIcon: null
            },
            panelClass: 'adf-error-snackbar'
        });
    }

    private getQuery(): string {
        const { query } = this.searchResults.buildQuery().query;
        const contentType = ' AND TYPE:content';
        const filterQueries = this.searchResults.filterQueries.length ? ' AND ' + this.mapFilterQueries() : '';

        return query + filterQueries + contentType;
    }

    private mapFilterQueries(): string {
        return (
            '(' +
            this.searchResults.filterQueries.reduce((acc, nextQuery, index) => acc + (index > 0 ? ' AND ' : '') + '(' + nextQuery.query + ')', '') +
            ')'
        );
    }

    private onNoFilePlan() {
        this.onApplyHoldsError('GOVERNANCE.MANAGE_HOLDS.NO_RECORDS_MANAGEMENT_SITE');
    }

    private waitForBulkOperationCompletion(bulkStatusId: string) {
        interval(2000).pipe(
            switchMap(() => this.manageHoldsService.getBulkOperationStatus(bulkStatusId)),
            takeWhile(statusResponse => !this.isBulkStatusFinished(statusResponse), true),
            takeLast(1)
        ).subscribe((doneResponse) => this.handleBulkOperationCompletion(doneResponse, true));
    }

    private handleBulkOperationCompletion(bulkOperationStatus: HoldBulkStatusEntry, showReloadButton = false) {
        const { errorsCount, totalItems, processedItems } = bulkOperationStatus.entry;
        if (errorsCount === 0 && totalItems === 0 && processedItems === 0) {
            this.onApplyHoldsError('GOVERNANCE.MANAGE_HOLDS.BULK_APPLY_HOLDS_CANNOT_BE_APPLIED_TO_FOLDERS');
        } else if (errorsCount > 0) {
            if (errorsCount === totalItems) {
                this.onApplyHoldsError('GOVERNANCE.MANAGE_HOLDS.BULK_APPLY_HOLDS_FAIL');
            } else {
                this.openSnackbarMessage('GOVERNANCE.MANAGE_HOLDS.BULK_APPLY_HOLDS_PARTIAL_SUCCESS', null, showReloadButton, { errorsCount });
            }
        } else {
            this.openSnackbarMessage('GOVERNANCE.MANAGE_HOLDS.BULK_APPLY_HOLDS_SUCCESS', null, showReloadButton, { totalItems });
        }
    }

    private handleReload(){
        if (this.location.path().includes('search')) {
            this.searchResults.update();
        } else {
            this.documentListService.reload();
        }
    }

    private isBulkStatusFinished(response: HoldBulkStatusEntry): boolean {
        return (response.entry.status === 'DONE' || response.entry.status === 'CANCELLED');
    }
}
