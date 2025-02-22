/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'aga-security-marks-dialog',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, TranslateModule],
    templateUrl: './display-security-marks-dialog.component.html',
    styleUrls: ['./display-security-marks-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DisplaySecurityMarksDialogComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { securityMarksData: Array<string> }) {}

    marksList: Array<string>;

    ngOnInit() {
        this.marksList = this.data.securityMarksData;
    }
}
