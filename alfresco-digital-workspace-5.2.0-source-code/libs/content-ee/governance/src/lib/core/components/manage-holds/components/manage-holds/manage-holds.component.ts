/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DIALOG_COMPONENT_DATA, DialogComponent, DialogSize } from '@alfresco/adf-core';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';
import { CreateHoldComponent } from '../create-hold/create-hold.component';
import { SingleExistingHoldsComponent } from '../single-existing-holds/single-existing-holds.component';
import { ManageHoldsDialogService } from '../../services/manage-holds-dialog.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BulkExistingHoldsComponent } from '../bulk-existing-holds/bulk-existing-holds.component';
import { OperationMode } from '../../../../model/bulk-operation.model';

@Component({
    templateUrl: './manage-holds.component.html',
    styleUrls: ['./manage-holds.component.scss'],
    host: { class: 'aga-manage-holds' },
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        ScrollingModule,
        TranslateModule,
        CreateHoldComponent,
        BulkExistingHoldsComponent,
        SingleExistingHoldsComponent,
        MatTabsModule,
        MatProgressSpinnerModule,
        CommonModule
    ]
})
export class ManageHoldsComponent implements OnInit {
    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    operationMode = inject(DIALOG_COMPONENT_DATA).operationMode;
    nodeId = inject(DIALOG_COMPONENT_DATA).nodeId as string;
    oldIndex = 0;
    canSwitchTab = true;
    isFirstLoading = true;

    readonly areHoldsLoaded$ = new BehaviorSubject<boolean>(false);
    readonly OperationMode = OperationMode;

    constructor(
        private readonly dialog: MatDialog,
        private readonly manageHoldsDialogService: ManageHoldsDialogService
    ) {}

    ngOnInit() {
        this.manageHoldsDialogService.selectedTabIndex$.next(0);
    }

    switchTab(tab: MatTabGroup, index: number) {
        if (this.isFirstLoading) {
            this.isFirstLoading = false;
        }
        if (tab.selectedIndex !== this.oldIndex) {
            if (this.canSwitchTab) {
                this.oldIndex = index;
                tab.selectedIndex = index;
                this.manageHoldsDialogService.selectedTabIndex$.next(index);
            } else {
                tab.selectedIndex = this.oldIndex;
                this.manageHoldsDialogService.selectedTabIndex$.next(index);

                const dialogInstance = this.dialog.open(DialogComponent, {
                    data: {
                        title: 'GOVERNANCE.MANAGE_HOLDS.DIALOG_WARNING_TITLE',
                        description: 'GOVERNANCE.MANAGE_HOLDS.DIALOG_WARNING_MESSAGE',
                        dialogSize: DialogSize.Alert,
                        confirmButtonTitle: 'COMMON.SWITCH',
                        isConfirmButtonDisabled$: of(false)
                    }
                });

                dialogInstance.afterClosed().subscribe((canSwitchTab) => {
                    if (canSwitchTab) {
                        this.canSwitchTab = true;
                        tab.selectedIndex = index;
                        this.oldIndex = index;
                        this.manageHoldsDialogService.selectedTabIndex$.next(index);
                        this.manageHoldsDialogService.isConfirmButtonDisabled$.next(true);
                    } else {
                        tab.selectedIndex = this.oldIndex;
                        this.manageHoldsDialogService.selectedTabIndex$.next(this.oldIndex);
                    }
                });
            }
        }
    }

    onListValueChange(isValueChanged: boolean) {
        this.onFormValueChange(isValueChanged);
        this.onFormValidationChange(!isValueChanged);
    }

    onFormValueChange(isValueChanged: boolean) {
        this.canSwitchTab = !isValueChanged;
    }

    onFormValidationChange(shouldDisable: boolean) {
        this.manageHoldsDialogService.isConfirmButtonDisabled$.next(shouldDisable);
    }

    onHoldsLoaded(numberOfHolds: number) {
        if (this.isFirstLoading) {
            this.areHoldsLoaded$.next(true);
            if (numberOfHolds === 0) {
                this.tabGroup.selectedIndex = 1;
                this.manageHoldsDialogService.selectedTabIndex$.next(1);
            }
        }
    }
}
