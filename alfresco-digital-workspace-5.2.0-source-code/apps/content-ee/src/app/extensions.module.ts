/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { NgModule } from '@angular/core';
import { AosExtensionModule } from '@alfresco/aca-content/ms-office';
import { RecordModule } from '@alfresco/adf-governance';
import { ContentServicesExtensionModule } from '@alfresco/adf-content-services-extension';
import { ProcessServicesExtensionModule } from '@alfresco/adf-process-services-extension';
import { AcaAboutModule, DEV_MODE_TOKEN, PACKAGE_JSON } from '@alfresco/aca-content/about';
import { MicrosoftOfficeOnlineIntegrationExtensionModule } from '@alfresco/microsoft-office-online-integration-extension';
import { environment } from '../environments/environment';
import packageJson from 'package.json';
import { ContentEeAnalyticsModule } from '@alfresco/analytics';
import { ViewerExtensionModule } from '../../../../libs/content-ee/viewer-extension/src/lib/viewer-extension.module';
import { MyExtensionModule } from '../../../../extensions/myextension/src/lib/my-extension.module';


@NgModule({
    imports: [
        ViewerExtensionModule,
        environment.plugins.aca_aos ? AosExtensionModule : [],
        environment.plugins.aca_about ? AcaAboutModule : [],
        environment.plugins.adw_governance ? RecordModule : [],
        environment.plugins.adw_aps1 ? ProcessServicesExtensionModule : [],
        environment.plugins.adw_content_services ? ContentServicesExtensionModule : [],
        environment.plugins.adw_office365 ? MicrosoftOfficeOnlineIntegrationExtensionModule : [],
        environment.plugins.adw_analytics ? ContentEeAnalyticsModule : [],
        MyExtensionModule,
        
    ],
    providers: [
        { provide: PACKAGE_JSON, useValue: packageJson },
        { provide: DEV_MODE_TOKEN, useValue: true }
    ]
})
export class AppExtensionsModule {}
