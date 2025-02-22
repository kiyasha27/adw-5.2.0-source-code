/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Page } from '@playwright/test';
import { LibrariesPage } from './libraries.page';

export class PersonalFilesPage extends LibrariesPage {

    private static pageUrl = 'personal-files';

    constructor(page: Page) {
        super(page, PersonalFilesPage.pageUrl);
        console.log("heya");
        
    }

    async waitForPageLoaded() {
        await this.page.waitForURL(`**/${PersonalFilesPage.pageUrl}`);
    }
}
