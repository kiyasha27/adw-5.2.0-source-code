/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'aga-bulk-holds-warning',
    templateUrl: './bulk-holds-warning.component.html',
    styleUrls: ['./bulk-holds-warning.component.scss'],
    host: { class: 'aga-bulk-holds-warning' },
    encapsulation: ViewEncapsulation.None,
    imports: [TranslateModule],
    standalone: true
})
export class BulkHoldsWarningComponent {}
