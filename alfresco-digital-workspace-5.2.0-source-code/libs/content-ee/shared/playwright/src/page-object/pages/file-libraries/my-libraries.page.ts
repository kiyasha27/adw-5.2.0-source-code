/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Page } from '@playwright/test';
import { LibrariesPage } from './libraries.page';

export class MyLibrariesPage extends LibrariesPage {

    private static pageUrl = 'libraries';

    constructor(page: Page) {
        console.log("ehehehehh");
        
        super(page, MyLibrariesPage.pageUrl);
    }

}
