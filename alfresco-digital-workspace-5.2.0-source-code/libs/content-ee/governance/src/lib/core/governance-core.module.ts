/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { NgModule } from '@angular/core';
import * as siteEvaluator from './rules/site.evaluator';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { BulkOperationDialogComponent } from './components/bulk-operation-dialog/bulk-operation-dialog.component';
import { IconComponent } from './components/icon/icon.component';
import { SecurityMarksModule } from './components/security-marks/security-marks.module';
import { IconService } from './services/icon.service';
import { ManageHoldsModule } from './components/manage-holds/manage-holds.module';

@NgModule({
    imports: [SecurityMarksModule, ManageHoldsModule, BulkOperationDialogComponent, IconComponent],
    exports: [BulkOperationDialogComponent, IconComponent],
    providers: [provideExtensionConfig(['governance-core.extension.json'])]
})
export class GovernanceCoreModule {
    constructor(extension: ExtensionService, iconService: IconService) {
        iconService.loadIcons();
        extension.setEvaluators({
            'app.selection.isRMSite': siteEvaluator.isRMSite,
            isLibraryAction: siteEvaluator.isLibraryAction,
            isAGSInstalled: siteEvaluator.isAGSInstalled
        });
    }
}
