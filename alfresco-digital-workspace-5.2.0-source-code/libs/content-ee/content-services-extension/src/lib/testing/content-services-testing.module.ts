/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
    AppConfigService,
    AppConfigServiceMock,
    AuthModule,
    TRANSLATION_PROVIDER,
    TranslationMock,
    TranslationService
} from '@alfresco/adf-core';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';

@NgModule({
    imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot({}),
        AuthModule.forRoot(),
        MatSnackBarModule,
        MatDialogModule
    ],
    providers: [
        TranslateStore,
        TranslateService,
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        { provide: AppConfigService, useClass: AppConfigServiceMock },
        { provide: TranslationService, useClass: TranslationMock },
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'content-services-extension',
                source: 'assets'
            }
        }
    ]
})
export class ContentServicesTestingModule {}
