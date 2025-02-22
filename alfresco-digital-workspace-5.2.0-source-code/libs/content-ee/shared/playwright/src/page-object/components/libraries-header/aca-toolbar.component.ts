/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { BaseComponent, MatMenuComponent } from '@alfresco-dbp/shared-playwright';
import { Page } from '@playwright/test';

export class LibrariesToolbarComponent extends BaseComponent {
    private static rootElement = 'aca-toolbar-action';

    constructor(page: Page, rootElement = LibrariesToolbarComponent.rootElement) {
        super(page, rootElement);
    }

    public list = new MatMenuComponent(this.page);
    public getButtonLocatorForOption = (optionTitle: string) => this.getChild(`button[title='${optionTitle}']`);
}
