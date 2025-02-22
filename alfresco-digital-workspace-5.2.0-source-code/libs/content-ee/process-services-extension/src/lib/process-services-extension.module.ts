/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { NgModule } from '@angular/core';
import { AppConfigService, AuthGuard, CoreModule, TRANSLATION_PROVIDER } from '@alfresco/adf-core';
import { ProcessModule } from '@alfresco/adf-process-services';
import { EXTENSION_DATA_LOADERS, ExtensionsDataLoaderGuard, PluginEnabledGuard } from '@alfresco/aca-shared';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { canCancelProcess, canShowProcessToolbarItems, canShowStartProcessFromContent, isProcessServicePluginEnabled } from './rules/process-services.rules';
import { FilePreviewExtComponent, TaskFiltersExtComponent } from './components/tasks';
import { ProcessDetailsDialogExtComponent, ProcessFiltersExtComponent } from './components/processes';
import { SidenavExtComponent } from './components/sidenav/sidenav-ext.component';
import { ProcessExtensionService } from './services/process-extension.service';
import { Store } from '@ngrx/store';
import { RouterModule, Routes } from '@angular/router';
import { processServicePluginLoaderFactory } from './services/process-service-plugin-loader.factory';
import { ProcessServicesExtensionStoreModule } from './store/process-services-extension.store.module';
import { StartProcessModule } from './features/start-process/start-process.module';
import { TaskListModule } from './features/task-list/task-list.module';
import { ProcessListModule } from './features/process-list/process-list.module';
import { ProcessDetailsModule } from './features/process-details/process-details.module';
import { TaskDetailsModule } from './features/task-details/task-details.module';
import { AcaRuleContext } from '@alfresco/aca-shared/rules';
import {
    LinkedProcessPanelComponent
} from './components/processes/linked-process-panel/linked-process-panel.component';

export const appRoutes: Routes = [
    {
        path: 'apps/:appId/task-details/:taskId/view',
        component: FilePreviewExtComponent,
        children: [
            {
                path: 'preview/blob',
                component: FilePreviewExtComponent,
                outlet: 'overlay'
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
        CoreModule,
        ProcessModule.forRoot(),
        ProcessServicesExtensionStoreModule,
        StartProcessModule,
        TaskListModule,
        ProcessListModule,
        ProcessDetailsModule,
        TaskDetailsModule,
        TaskFiltersExtComponent,
        FilePreviewExtComponent,
        ProcessFiltersExtComponent,
        LinkedProcessPanelComponent,
        ProcessDetailsDialogExtComponent,
        SidenavExtComponent
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'process-services-extension',
                source: 'assets/adf-process-services-extension'
            }
        },
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never' } },
        {
            provide: EXTENSION_DATA_LOADERS,
            multi: true,
            useFactory: processServicePluginLoaderFactory,
            deps: [ProcessExtensionService, Store, AppConfigService]
        },
        provideExtensionConfig(['process-services-extension.json'])
    ]
})
export class ProcessServicesExtensionModule {
    constructor(extensions: ExtensionService, processExtensionService: ProcessExtensionService) {
        extensions.setComponents({
            'process-services-plugin.components.process-services-side-nav-ext': SidenavExtComponent,
            'process-services-plugin.components.linked-process-panel': LinkedProcessPanelComponent
        });

        extensions.setAuthGuards({
            'process-services-plugin.auth': AuthGuard,
            'extension-data-loader-guard.auth': ExtensionsDataLoaderGuard,
            'plugin-enabled-guard.auth': PluginEnabledGuard
        });

        extensions.setEvaluators({
            'app.process.isProcessServicePluginEnabled': isProcessServicePluginEnabled,
            'app.process.isProcessServiceRunning': isProcessServiceRunning,
            'app.process.canStartProcess': canStartProcess,
            'app.process.isProcessServiceRunningAndPluginEnabled': isProcessServiceRunningAndPluginEnabled,
            'app.process.canShowStartProcessFromContentEnabled': canShowStartProcessFromContentEnabled,
            'app.process.canShowProcessToolbarItems': canShowProcessToolbarItems,
            'app.process.canCancelProcess': canCancelProcess
        });

        function canShowStartProcessFromContentEnabled(context: AcaRuleContext): boolean {
            return [isProcessServicePluginEnabled(context), isProcessServiceRunning(), canShowStartProcessFromContent(context)].every(Boolean);
        }

        function isProcessServiceRunningAndPluginEnabled(context: AcaRuleContext): boolean {
            return [isProcessServicePluginEnabled(context), isProcessServiceRunning()].every(Boolean);
        }

        function canStartProcess(context: AcaRuleContext): boolean {
            return [isProcessServiceRunning(), isProcessServicePluginEnabled(context)].every(Boolean);
        }

        function isProcessServiceRunning(): boolean {
            return processExtensionService.processServicesRunning;
        }
    }
}
