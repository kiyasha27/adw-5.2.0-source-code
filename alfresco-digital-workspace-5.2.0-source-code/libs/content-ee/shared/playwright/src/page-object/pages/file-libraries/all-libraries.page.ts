/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Page } from '@playwright/test';
import { LibrariesPage } from './libraries.page';

export class AllLibrariesPage extends LibrariesPage {

    private static pageUrl = 'all/libraries';
    private static urlRequest = /alfresco\/versions\/1\/sites/;

    constructor(page: Page) {
        super(page, AllLibrariesPage.pageUrl, AllLibrariesPage.urlRequest);
    }

}
