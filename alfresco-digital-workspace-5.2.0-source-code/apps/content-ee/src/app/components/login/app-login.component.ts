/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, ViewEncapsulation } from '@angular/core';
import { AppConfigModule, LoginComponent } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    imports: [AppConfigModule, TranslateModule, LoginComponent],
    templateUrl: './app-login.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AppLoginComponent {}
