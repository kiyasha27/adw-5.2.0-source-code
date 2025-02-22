/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { PaginationModel } from '@alfresco/adf-core';
import { VersionCompatibilityService, SitesService } from '@alfresco/adf-content-services';
import { SiteMemberPaging } from '@alfresco/js-api';
import { catchError, map, finalize } from 'rxjs/operators';
import { ACS_VERSIONS } from '../../../models/types';

@Injectable({ providedIn: 'root' })
export class LibraryMemberService {
    members = new BehaviorSubject<SiteMemberPaging>({});
    loading = new BehaviorSubject<boolean>(false);
    pagination = new BehaviorSubject<PaginationModel>({
        maxItems: 25,
        skipCount: 0,
        totalItems: 0,
    });

    constructor(private siteService: SitesService, private versionCompatibilityService: VersionCompatibilityService) {}

    loadMembers(siteId: string, { maxItems = 25, skipCount = 0 } = {}, showSpinner = true) {
        this.loading.next(showSpinner);
        let count = of(null);

        if (!this.versionCompatibilityService.isVersionSupported(ACS_VERSIONS['7'])) {
            count = this.siteService.getSiteMembers(siteId).pipe(
                map((siteDetails) => siteDetails['relations'].members.list.pagination.count),
                catchError(() => of(null))
            );
        }

        forkJoin([count, this.siteService.listSiteMemberships(siteId, { maxItems, skipCount }).pipe(catchError(() => of(null)))])
            .pipe(finalize(() => this.loading.next(false)))
            .subscribe(([total, siteMemberPaging]) => {
                if (siteMemberPaging) {
                    if (total) {
                        siteMemberPaging.list.pagination.totalItems = total;
                    }
                    this.members.next(siteMemberPaging);
                    this.pagination.next(siteMemberPaging.list.pagination);
                }
            });
    }
}
