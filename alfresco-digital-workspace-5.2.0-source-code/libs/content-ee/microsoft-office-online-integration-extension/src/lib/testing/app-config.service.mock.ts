/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Injectable } from '@angular/core';
import { AppConfigService, Status } from '@alfresco/adf-core';

@Injectable({ providedIn: 'root' })
export class AppConfigServiceMock extends AppConfigService {

    config: any = {
        plugins: {
            microsoftOnline: true
        },
        msOnline: {
            msClientId: '<client-id>',
            msAuthority: '<authority>',
            msRedirectUri: '<redirect-uri>',
            msHost: '<ms-host>'
        }
    };

    load(): Promise<any> {
        return new Promise((resolve) => {
            this.status = Status.LOADED;
            this.onDataLoaded();
            resolve(this.config);
        });
    }
}
