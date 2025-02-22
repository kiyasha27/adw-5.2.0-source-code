/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { BaseComponent } from '@alfresco-dbp/shared-playwright';
import { Page } from '@playwright/test';

export class AcaLibMembersComponent extends BaseComponent {
    private static rootElement = 'adw-info-drawer-member-list';

    constructor(page: Page) {
        super(page, AcaLibMembersComponent.rootElement);
    }

    public getTitleLocator = this.getChild('.adw-toolbar-title');
    public getEmailsListOfMembersLocator = this.getChild('span.adf-user-email-column');
}
