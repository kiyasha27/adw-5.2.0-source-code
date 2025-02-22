/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { NodesApiService, NameColumnComponent } from '@alfresco/adf-content-services';
import { Component, ViewEncapsulation, ElementRef, OnInit } from '@angular/core';
import { SecurityMarksService } from '../security-marks.service';
import { SecurityMarkPaging, SecurityMarkEntry } from '@alfresco/js-api';
import { BehaviorSubject, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DisplaySecurityMarksDialogComponent } from '../display-security-marks-dialogBox/display-security-marks-dialog.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'aga-security-marks-column',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './display-security-marks.component.html',
    styleUrls: ['./display-security-marks.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DisplaySecurityMarksComponent extends NameColumnComponent implements OnInit {
    constructor(
        public elementRef: ElementRef,
        private securityMarksService: SecurityMarksService,
        nodesService: NodesApiService,
        private dialog: MatDialog
    ) {
        super(elementRef, nodesService);
    }

    securityMarksList: Array<string> = [];
    marksData = new BehaviorSubject(this.securityMarksList);

    ngOnInit() {
        this.updateValue();

        this.securityMarksService
            .getNodeSecurityMarks(this.node?.entry?.id)
            .then((securityMarkPaging: SecurityMarkPaging) => {
                const securityMarkResponse = {
                    entries: securityMarkPaging?.list?.entries?.map((mark: SecurityMarkEntry) => mark.entry)
                };
                securityMarkResponse?.entries?.forEach((securityMark) => {
                    this.securityMarksList.push(securityMark.name);
                });

                this.securityMarksList.sort((mark1, mark2) => mark1.localeCompare(mark2));
                this.marksData.next(this.securityMarksList);
            })
            .catch((error) => {
                throwError(error);
            });
    }

    showAll() {
        this.dialog.open(DisplaySecurityMarksDialogComponent, {
            data: { securityMarksData: this.securityMarksList },
            width: '320px',
            height: 'auto'
        });
    }
}
