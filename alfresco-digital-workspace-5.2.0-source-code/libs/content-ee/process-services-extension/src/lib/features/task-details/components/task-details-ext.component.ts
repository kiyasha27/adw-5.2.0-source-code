/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { TaskFormComponent } from '@alfresco/adf-process-services';
import { Store } from '@ngrx/store';
import { ProcessServicesExtActions } from '../../../process-services-ext-actions-types';
import { SnackbarInfoAction, SnackbarWarningAction } from '@alfresco/aca-shared/store';
import {
    FormOutcomeEvent,
    ContentLinkModel,
    ToolbarDividerComponent,
    ToolbarComponent,
    IconComponent,
    ToolbarTitleComponent
} from '@alfresco/adf-core';
import { Observable } from 'rxjs';
import { getSelectedTask } from '../../../process-services-ext.selector';
import { TaskDetailsExtActions } from '../../../store/task-details-ext-actions-types';
import { ProcessServiceExtensionState } from '../../../store/reducers/process-services.reducer';
import { TaskRepresentation } from '@alfresco/js-api';
import { PageLayoutComponent, PageLayoutContentComponent, PageLayoutHeaderComponent } from '@alfresco/aca-shared';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'aps-task-details-ext',
    standalone: true,
    imports: [
        CommonModule,
        PageLayoutHeaderComponent,
        PageLayoutComponent,
        PageLayoutContentComponent,
        TranslateModule,
        MatIconModule,
        ToolbarDividerComponent,
        ToolbarComponent,
        ToolbarTitleComponent,
        IconComponent,
        MatButtonModule,
        TaskFormComponent
    ],
    templateUrl: './task-details-ext.component.html',
    styleUrls: ['./task-details-ext.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskDetailsExtComponent implements OnInit, OnDestroy {
    static SAVE_OUTCOME_ID = '$save';

    @ViewChild('adfTaskForm', { static: true })
    adfTaskForm: TaskFormComponent;

    appId = null;
    taskId: string;
    taskDetails$: Observable<TaskRepresentation>;

    constructor(private route: ActivatedRoute, private location: Location, private store: Store<ProcessServiceExtensionState>) {}

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.appId = +params['appId'];
            this.taskId = params['taskId'];
            if (this.taskId) {
                this.loadTaskDetails(this.taskId);
            }
            this.taskDetails$ = this.store.select(getSelectedTask);
        });
    }

    loadTaskDetails(taskId: string) {
        this.store.dispatch(TaskDetailsExtActions.loadTaskDetails({ taskId: taskId }));
    }

    onFormLoaded() {
        if (this.adfTaskForm.isReadOnlyForm() && !this.adfTaskForm.isCompletedTask() && !this.adfTaskForm.isTaskClaimable()) {
            this.showWarningMessage('PROCESS-EXTENSION.ERROR.TASK_ACCESS_WARNING');
        }
    }

    onFormCompleted() {
        this.showInfoMessage('PROCESS-EXTENSION.TASK_FORM.FORM_COMPLETED');
        this.navigateToDefaultTaskFilter();
    }

    onFormOutcomeExecute(outcome: FormOutcomeEvent) {
        if (outcome.outcome.id === TaskDetailsExtComponent.SAVE_OUTCOME_ID) {
            this.showInfoMessage('PROCESS-EXTENSION.TASK_FORM.FORM_SAVED');
        }
    }

    onCompleteTaskForm() {
        this.showInfoMessage('PROCESS-EXTENSION.TASK_FORM.FORM_COMPLETED');
        this.navigateToDefaultTaskFilter();
    }

    onContentClick(content: ContentLinkModel): void {
        this.store.dispatch(
            ProcessServicesExtActions.showAttachedContentPreviewAction({
                content
            })
        );
    }

    onCloseForm() {
        this.location.back();
    }

    onClaim() {
        this.adfTaskForm.loadTask(this.taskId);
        this.store.dispatch(TaskDetailsExtActions.reloadTaskDetails({ taskId: this.taskId }));
        this.showInfoMessage('PROCESS-EXTENSION.TASK_FORM.CLAIM_TASK');
    }

    onUnClaim() {
        this.navigateToDefaultTaskFilter();
        this.showInfoMessage('PROCESS-EXTENSION.TASK_FORM.UNCLAIM_TASK');
    }

    onError() {
        this.showWarningMessage('PROCESS-EXTENSION.TASK_FORM.CLAIM_FAILED');
    }

    navigateToDefaultTaskFilter(): void {
        this.store.dispatch(ProcessServicesExtActions.navigateToDefaultTaskFilter({}));
    }

    showWarningMessage(message: string) {
        this.store.dispatch(new SnackbarWarningAction(message));
    }

    showInfoMessage(message: string) {
        this.store.dispatch(new SnackbarInfoAction(message));
    }

    ngOnDestroy() {
        this.store.dispatch(TaskDetailsExtActions.resetSelectedTask());
    }
}
