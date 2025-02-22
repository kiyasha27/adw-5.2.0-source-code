/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ContentAppEnvironment } from './environment.interface';

export const environment: ContentAppEnvironment = {
    production: true,
    e2e: false,
    devTools: false,
    plugins: {
        aca_aos: true,
        aca_about: true,
        adw_analytics: true,
        adw_content_services: true,
        adw_governance: true,
        adw_office365: true,
        adw_aps1: true
    }
};
