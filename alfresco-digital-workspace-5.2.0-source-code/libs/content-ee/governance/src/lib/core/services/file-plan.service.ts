/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Injectable } from '@angular/core';
import { FilePlansApi } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-content-services';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FilePlanService {
    private _filePlansApi: FilePlansApi;

    constructor(private apiService: AlfrescoApiService) {}

    get filePlansApi(): FilePlansApi {
        return this._filePlansApi || (this._filePlansApi = new FilePlansApi(this.apiService.getInstance()));
    }

    checkFilePlan(filePlanId = '-filePlan-'): Observable<boolean> {
        return from(this.filePlansApi.getFilePlan(filePlanId)).pipe(
            map((filePlan) => filePlan !== undefined),
            catchError(() => of(false))
        );
    }
}
