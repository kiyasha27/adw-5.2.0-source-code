/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, DestroyRef, inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CardViewUpdateService, InfoDrawerComponent, InfoDrawerTabComponent } from '@alfresco/adf-core';
import { ProcessServiceExtensionState } from '../../../store/reducers/process-services.reducer';
import { Store } from '@ngrx/store';
import { debounceTime, Subject } from 'rxjs';
import { TaskDetailsExtActions } from '../../../store/task-details-ext-actions-types';
import { TaskRepresentation } from '@alfresco/js-api';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { TaskCommentsComponent, TaskHeaderComponent } from '@alfresco/adf-process-services';
import { areInfoDrawerCommentsFocused } from '../../../process-services-ext.selector';
import {
    resetProcessServicesInfoDrawerAction,
    switchProcessServicesInfoDrawerFocusedTabAction
} from '../../../actions/process-services-ext.actions';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContentMetadataHeaderComponent } from '@alfresco/adf-content-services';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'aps-task-info-drawer',
    standalone: true,
    imports: [
        CommonModule,
        InfoDrawerComponent,
        InfoDrawerTabComponent,
        TaskHeaderComponent,
        AsyncPipe,
        ContentMetadataHeaderComponent,
        MatButtonModule,
        MatIconModule,
        NgIf,
        TranslateModule,
        MatProgressBarModule,
        TaskCommentsComponent
    ],
    templateUrl: './task-info-drawer.component.html',
    styleUrls: ['./task-info-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskInfoDrawerComponent implements OnInit, OnDestroy {
    @Input()
    taskDetails: TaskRepresentation;

    @Input()
    isLoading: boolean;

    editMode = false;
    changedProperties: Partial<TaskRepresentation> = {};
    hasMetadataChanged = false;
    resetChangesEvent = new Subject<void>();

    protected focusedTab: number;

    private readonly destroyRef = inject(DestroyRef);

    constructor(private store: Store<ProcessServiceExtensionState>, private cardViewUpdateService: CardViewUpdateService) {
        this.store.select(areInfoDrawerCommentsFocused).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((focused) => {
            this.focusedTab = focused ? 1 : 0;
        });
    }

    ngOnInit(): void {
        this.cardViewUpdateService.itemUpdated$
            .pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef))
            .subscribe(res => {
                this.changedProperties = {...this.changedProperties, ...res.changed};
                this.hasMetadataChanged = true;
            });
    }

    toggleEditing() {
        this.editMode = true;
    }

    onTabChange(event: number) {
        if(this.focusedTab !== event) {
            this.store.dispatch(switchProcessServicesInfoDrawerFocusedTabAction({}));
        }
    }

    saveChanges() {
        this.updateTaskDetails(this.changedProperties);
        this.editMode = false;
        this.hasMetadataChanged = false;
        this.changedProperties = {};
    }

    resetChanges() {
        this.resetChangesEvent.next();
        this.editMode = false;
        this.hasMetadataChanged = false;
        this.changedProperties = {};
    }

    private updateTaskDetails(updatedNotification: Partial<TaskRepresentation>) {
        this.store.dispatch(
            TaskDetailsExtActions.updateTaskDetails({
                taskId: this.taskDetails.id,
                taskDetails: this.taskDetails,
                updatedNotification: updatedNotification
            })
        );
    }

    ngOnDestroy(): void {
        this.store.dispatch(resetProcessServicesInfoDrawerAction());
    }
}
