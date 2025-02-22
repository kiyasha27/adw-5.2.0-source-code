/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { provideTranslations } from '@alfresco/adf-core';
import { ExtensionService } from '@alfresco/adf-extensions';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { DeclareRecordEffects } from './effects/declare-record.effect';
import { DeleteRecordEffect } from './effects/delete-record.effect';
import { AdminDeleteRecordEffect } from './effects/admin-delete-record.effect';
import { RejectRecordEffect } from './effects/reject-record.effect';
import { MoveRecordEffect } from './effects/move-record.effect';
import * as recordEvaluator from './rules/record.evaluator';
import { GovernanceCoreModule } from '../core/governance-core.module';
import { GlacierModule } from '../glacier/glacier.module';
import { RecordIconComponent } from './components/record-icon/record-icon.component';
import { AcaRuleContext, canOpenWithOffice } from '@alfresco/aca-shared/rules';
import { OpenRecordInfoDrawerEffect } from './effects/open-record-info-drawer.effect';

export const effects = [
    DeclareRecordEffects,
    RejectRecordEffect,
    AdminDeleteRecordEffect,
    DeleteRecordEffect,
    MoveRecordEffect,
    OpenRecordInfoDrawerEffect
];

@NgModule({
    imports: [EffectsModule.forFeature(effects), GovernanceCoreModule, GlacierModule, RecordIconComponent],
    providers: [provideTranslations('governance-extension', 'assets/adf-governance')],
    exports: [RecordIconComponent]
})
export class RecordModule {
    constructor(extensions: ExtensionService) {
        extensions.setEvaluators({
            'app.selection.isRecord': recordEvaluator.isNodeRecord,
            'app.selection.isRejectedRecord': recordEvaluator.isNodeRecordRejected,
            'app.selection.canDeclareAsRecord': recordEvaluator.canDeclareAsRecord,
            'app.selection.canDeleteRecord': recordEvaluator.canDeleteRecord,
            'app.selection.canUpdateRecord': recordEvaluator.canUpdateRecord,
            'app.selection.file.canUploadVersion': recordEvaluator.canUploadRecordVersion,

            'app.record.canUpdateVersion': recordEvaluator.canUpdateVersion,
            'app.record.canDeleteStoredNode': recordEvaluator.canDeleteStoredNode,
            'app.record.canDeleteStoredRecord': recordEvaluator.canDeleteStoredRecord,
            'app.record.canShareRecord': recordEvaluator.canShareRecord,
            'app.record.canEditSharedURL': recordEvaluator.canEditSharedURL,
            'app.record.canToggleEditOfflineRecord': recordEvaluator.canToggleEditOfflineRecord,

            'aos.canOpenWithOffice': (context: AcaRuleContext) => canOpenWithOffice(context) && recordEvaluator.canOpenRecordWithOffice(context)
        });
    }
}
