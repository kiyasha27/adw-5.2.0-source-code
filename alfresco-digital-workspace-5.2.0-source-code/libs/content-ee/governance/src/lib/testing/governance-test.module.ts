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
    TranslationService,
    CookieService,
    AppConfigServiceMock,
    TranslationMock,
    CookieServiceMock,
    TRANSLATION_PROVIDER,
    AuthModule
} from '@alfresco/adf-core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RecordModule } from '../record/record.module';
import { GovernanceCoreModule } from '../core/governance-core.module';
import { TranslateModule, TranslateStore } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';
@NgModule({
    imports: [
        HttpClientModule,
        NoopAnimationsModule,
        MatSnackBarModule,
        RouterTestingModule,
        HttpClientTestingModule,
        EffectsModule.forRoot([]),
        GovernanceCoreModule,
        TranslateModule.forRoot(),
        RecordModule,
        StoreModule.forRoot(
            { app: (state) => state },
            {
                initialState: {
                    app: {
                        infoDrawerMetadataAspect: ''
                    }
                }
            }
        ),
        AuthModule.forRoot(),
        MatDialogModule,
        MatSnackBarModule,
        MatIconTestingModule
    ],
    providers: [
        TranslateStore,
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        { provide: AppConfigService, useClass: AppConfigServiceMock },
        { provide: TranslationService, useClass: TranslationMock },
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'governance-extension',
                source: 'assets/adf-governance'
            }
        },
        { provide: CookieService, useClass: CookieServiceMock }
    ]
})
export class GovernanceTestingModule {}
