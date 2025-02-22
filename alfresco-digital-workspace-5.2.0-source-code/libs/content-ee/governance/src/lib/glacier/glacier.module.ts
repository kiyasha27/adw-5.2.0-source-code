/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { TRANSLATION_PROVIDER } from '@alfresco/adf-core';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import * as glacierEvaluator from '../glacier/rules/glacier-evaluator';
import { GlacierRestoreEffect } from './effects/glacier-restore.effect';
import { GlacierStoreEffect } from './effects/glacier-store.effect';
import { RestoreDialogComponent } from './components/restore-dialog/restore-dialog.component';
import { GlacierExtendRestoreEffect } from './effects/glacier-extend-restore.effect';

export const effects = [GlacierStoreEffect, GlacierRestoreEffect, GlacierExtendRestoreEffect];

@NgModule({
    imports: [EffectsModule.forFeature(effects), RestoreDialogComponent],
    declarations: [],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'governance-extension',
                source: 'assets/adf-governance'
            }
        },
        provideExtensionConfig(['glacier.extension.json'])
    ]
})
export class GlacierModule {
    constructor(extensions: ExtensionService) {
        extensions.setEvaluators({
            'app.glacier.canStoreRecord': glacierEvaluator.canStoreNode,
            'app.glacier.canRestoreRecord': glacierEvaluator.canRestoreNode,
            'app.glacier.canExtendRestoreRecord': glacierEvaluator.canExtendRestoreNode,

            'app.glacier.isStored': glacierEvaluator.hasStored,
            'app.glacier.isPendingRestore': glacierEvaluator.hasPendingRestore,
            'app.glacier.isRestored': glacierEvaluator.hasRestored,

            'app.glacier.canShowViewer': glacierEvaluator.canShowViewer
        });
    }
}
