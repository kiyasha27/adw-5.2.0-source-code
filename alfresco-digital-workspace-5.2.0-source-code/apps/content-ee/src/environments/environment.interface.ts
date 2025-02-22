/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

export interface ContentAppEnvironment {
    production: boolean;
    e2e: boolean;
    devTools: boolean;
    plugins: {
        aca_aos: boolean;
        aca_about: boolean;
        adw_analytics: boolean;
        adw_content_services: boolean;
        adw_governance: boolean;
        adw_office365: boolean;
        adw_aps1: boolean;
    };
}
