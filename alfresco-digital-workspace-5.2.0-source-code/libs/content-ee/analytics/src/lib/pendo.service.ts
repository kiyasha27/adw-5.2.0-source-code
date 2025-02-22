/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { DestroyRef, inject, Injectable } from '@angular/core';
import { AppConfigService, AuthenticationService } from '@alfresco/adf-core';
import { take } from 'rxjs/operators';
import sha256 from 'crypto-js/sha256';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root'
})
export class PendoService {

    private readonly destroyRef = inject(DestroyRef);

    constructor(private authenticationService: AuthenticationService, private appConfigService: AppConfigService) {}

    init(): void {
        this.appConfigService
            .select('analytics')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((config: {
                pendoEnabled: boolean;
                pendoKey: string;
                pendoCustomerName: string;
            }) => {
                if (config.pendoEnabled) {
                    this.injectPendo(config.pendoKey);
                    this.initPendo(config.pendoCustomerName);
                }
            });
    }

    injectPendo(key: string) {
        // Code snippet from Pendo to make integration available

        ((apiKey: string) => {
            (function (p, e, n, d, o) {
                // eslint-disable-next-line
                // @ts-ignore
                let v, w, x, y, z;
                // eslint-disable-next-line
                // @ts-ignore
                o = p[d] = p[d] || {};
                // eslint-disable-next-line
                // @ts-ignore
                o._q = o._q || [];
                // eslint-disable-next-line prefer-const
                v = ['initialize', 'identify', 'updateOptions', 'pageLoad', 'track'];
                for (w = 0, x = v.length; w < x; ++w) {
                    (function (m) {
                        // eslint-disable-next-line
                        // @ts-ignore
                        o[m] =
                            // eslint-disable-next-line
                            // @ts-ignore
                            o[m] ||
                            function () {
                                // eslint-disable-next-line
                                // @ts-ignore
                                o._q[m === v[0] ? 'unshift' : 'push']([m].concat([].slice.call(parameters, 0)));
                            };
                    })(v[w]);
                }
                // eslint-disable-next-line
                y = e.createElement(n);
                // eslint-disable-next-line
                // @ts-ignore
                y.async = !0;
                // eslint-disable-next-line
                // @ts-ignore
                y.src = 'https://cdn.pendo.io/agent/static/' + apiKey + '/pendo.js';
                // eslint-disable-next-line
                z = e.getElementsByTagName(n)[0];
                // eslint-disable-next-line
                // @ts-ignore
                z.parentNode.insertBefore(y, z);
            })(window, document, 'script', 'pendo');
        }).bind(this)(key);
    }

    initPendo(customerName: string): void {
        this.authenticationService.onLogin.pipe(take(1)).subscribe(() => {
            const username = this.authenticationService.getEcmUsername() || this.authenticationService.getBpmUsername();
            const hiddenUserName = this.hashUserName(username);
            const accountId = this.getAccountId();
            // eslint-disable-next-line
            // @ts-ignore
            window['pendo'].initialize({
                visitor: {
                    id: hiddenUserName
                },
                account: {
                    id: accountId,
                    customerName: customerName
                }
            });
        });
    }

    private hashUserName(username: string): string {
        return sha256(username).toString();
    }

    private getAccountId(): string {
        const appTitle = this.appConfigService.get<string>('application.name')?.replace(/\s+/g, '-').toLowerCase();
        const customerName = this.appConfigService.get<string>('customer.name');
        return customerName || appTitle;
    }
}
