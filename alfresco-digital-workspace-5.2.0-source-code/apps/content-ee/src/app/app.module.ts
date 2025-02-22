/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule, AuthGuard, AuthModule, provideTranslations } from '@alfresco/adf-core';
import { AppService, SharedModule } from '@alfresco/aca-shared';
import { AppExtensionsModule } from './extensions.module';
import { environment } from '../environments/environment';
import { registerLocaleData } from '@angular/common';

import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';
import localeIt from '@angular/common/locales/it';
import localeEs from '@angular/common/locales/es';
import localeJa from '@angular/common/locales/ja';
import localeNl from '@angular/common/locales/nl';
import localePt from '@angular/common/locales/pt';
import localeNb from '@angular/common/locales/nb';
import localeRu from '@angular/common/locales/ru';
import localeCh from '@angular/common/locales/zh';
import localeAr from '@angular/common/locales/ar';
import localeCs from '@angular/common/locales/cs';
import localePl from '@angular/common/locales/pl';
import localeFi from '@angular/common/locales/fi';
import localeDa from '@angular/common/locales/da';
import localeSv from '@angular/common/locales/sv';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.components';
import { ContentVersionService } from '@alfresco/adf-content-services';
import { ShellModule, SHELL_APP_SERVICE, SHELL_AUTH_TOKEN } from '@alfresco/adf-core/shell';
import { ContentUrlService, CONTENT_LAYOUT_ROUTES, ContentServiceExtensionModule, CoreExtensionsModule } from '@alfresco/aca-content';
import { APP_ROUTES } from './app.routes';
import { MatIconRegistry } from '@angular/material/icon';

registerLocaleData(localeFr);
registerLocaleData(localeDe);
registerLocaleData(localeIt);
registerLocaleData(localeEs);
registerLocaleData(localeJa);
registerLocaleData(localeNl);
registerLocaleData(localePt);
registerLocaleData(localeNb);
registerLocaleData(localeRu);
registerLocaleData(localeCh);
registerLocaleData(localeAr);
registerLocaleData(localeCs);
registerLocaleData(localePl);
registerLocaleData(localeFi);
registerLocaleData(localeDa);
registerLocaleData(localeSv);

@NgModule({
    imports: [
        AuthModule.forRoot({ useHash: true }),
        BrowserModule,
        TranslateModule.forRoot(),
        CoreModule.forRoot(),
        SharedModule,
        CoreExtensionsModule.forRoot(),
        ContentServiceExtensionModule,
        environment.e2e ? NoopAnimationsModule : BrowserAnimationsModule,
        RouterModule.forRoot(APP_ROUTES, {
            useHash: true
        }),
        AppExtensionsModule,
        ShellModule.withRoutes({
            shellChildren: [CONTENT_LAYOUT_ROUTES]
        })],
    providers: [
        { provide: ContentVersionService, useClass: ContentUrlService },
        {
            provide: SHELL_APP_SERVICE,
            useClass: AppService
        },
        {
            provide: SHELL_AUTH_TOKEN,
            useValue: AuthGuard
        },
        provideTranslations('app', 'assets')
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(matIconRegistry: MatIconRegistry) {
        matIconRegistry.setDefaultFontSetClass('material-icons-outlined');
    }
}
