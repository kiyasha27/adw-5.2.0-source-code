/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { BaseComponent} from '@alfresco-dbp/shared-playwright';
import { Page } from '@playwright/test';

export class AddMemberHeaderDialogComponent extends BaseComponent {
    private static rootElement = 'mat-card-header';

    constructor(page: Page) {
        super(page, AddMemberHeaderDialogComponent.rootElement);
    }

    public getSetAllRolesLocator = this.getChild('adw-role-selector');
}
