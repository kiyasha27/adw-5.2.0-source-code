/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ExtensionService } from '@alfresco/adf-extensions';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ManageHoldsComponent } from './components/manage-holds/manage-holds.component';
import { ManageHoldsEffect } from './effects/manage-holds.effect';
import { canManageHolds, canManageHoldsContextMenu, isNodeOnHold } from './rules/manage-hold.rules';
import { HoldIconComponent } from './components/hold-icon/hold-icon.component';

export const effects = [ManageHoldsEffect];

@NgModule({
    imports: [
        EffectsModule.forFeature(effects),
        ManageHoldsComponent
    ]
})
export class ManageHoldsModule {
    constructor(extensions: ExtensionService) {
        extensions.setComponents({
            'app.manage.holds.hold-icon': HoldIconComponent
        });

        extensions.setEvaluators({
            'app.manage.holds.canManageHolds': canManageHolds,
            'app.manage.holds.canManageHoldsContextMenu': canManageHoldsContextMenu,
            'app.manage.holds.isNodeOnHold': isNodeOnHold
        });
    }
}
