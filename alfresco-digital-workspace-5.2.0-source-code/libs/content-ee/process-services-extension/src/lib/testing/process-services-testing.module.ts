/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    AppConfigService,
    TranslationService,
    AppConfigServiceMock,
    TranslationMock,
    TRANSLATION_PROVIDER,
    AuthModule,
    PageTitleService,
    FORM_FIELD_MODEL_RENDER_MIDDLEWARE
} from '@alfresco/adf-core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule, TranslateStore, TranslateService } from '@ngx-translate/core';
import * as fromProcessServices from '../store/reducers/process-services.reducer';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { HttpClientModule } from '@angular/common/http';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';

@NgModule({
    imports: [
        NoopAnimationsModule,
        HttpClientModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(fromProcessServices.featureKey, fromProcessServices.reducer),
        EffectsModule.forRoot([]),
        TranslateModule.forRoot(),
        AuthModule.forRoot(),
        MatSnackBarModule,
        MatDialogModule,
        MatIconTestingModule
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
                name: 'process-services-extension',
                source: 'assets'
            }
        },
        {
            provide: PageTitleService,
            useValue: {}
        },
        { provide: FORM_FIELD_MODEL_RENDER_MIDDLEWARE, useValue: [] }
    ],
    exports: [NoopAnimationsModule, TranslateModule, AuthModule]
})
export class ProcessServicesTestingModule {}
