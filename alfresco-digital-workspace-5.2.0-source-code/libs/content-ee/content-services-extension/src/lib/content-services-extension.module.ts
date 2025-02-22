/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { NgModule } from '@angular/core';
import { AuthGuard, TRANSLATION_PROVIDER, AppConfigService } from '@alfresco/adf-core';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { EffectsModule } from '@ngrx/effects';
import { PluginEnabledGuard } from '@alfresco/aca-shared';
import { MembershipRequestsNotificationsComponent } from './components/notifications/membership-requests-notifications.component';
import { displayLibraryInfoDrawer, isMemberManagement } from './rules/content-services.rules';
import { DataTableDirective } from './directives/data-table.directive';
import { ExtensionEffects } from './store/effects/extension.effects';
import {
    InfoDrawerMemberListComponent,
    LIBRARY_MANAGEMENT_DIRECTIVES,
    LibraryDetailsComponent,
    LibraryListComponent
} from './components/library-member-management';

export const effects = [ExtensionEffects];

@NgModule({
    imports: [
        EffectsModule.forFeature(effects),
        ...LIBRARY_MANAGEMENT_DIRECTIVES,
        DataTableDirective,
        MembershipRequestsNotificationsComponent
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'content-services-extension',
                source: 'assets/adf-content-services-extension',
            },
        },
        provideExtensionConfig(['content-services-extension.json']),
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never' } },
    ],
})
export class ContentServicesExtensionModule {
    constructor(extensions: ExtensionService, private appConfigService: AppConfigService) {
        extensions.setComponents({
            'content-services.components.library-list': LibraryListComponent,
            'content-services.components.library-requests-notification': MembershipRequestsNotificationsComponent,
            'content-services.components.members': InfoDrawerMemberListComponent,
            'content-services.components.member-manager': LibraryDetailsComponent,
        });

        extensions.setAuthGuards({
            'content-services.auth': AuthGuard,
            'plugin-enabled-guard.auth': PluginEnabledGuard
        });

        extensions.setEvaluators({
            'app.content-services.isEnabled': () => this.isContentServicePluginEnabled(),
            'app.content-services.isMemberManagement': isMemberManagement,
            'app.content-services.displayLibraryInfoDrawer': displayLibraryInfoDrawer
        });
    }

    private isContentServicePluginEnabled(): boolean {
        const flag = this.appConfigService.get<boolean | string>('plugins.contentService', true);
        return flag === true || flag === 'true';
    }
}
