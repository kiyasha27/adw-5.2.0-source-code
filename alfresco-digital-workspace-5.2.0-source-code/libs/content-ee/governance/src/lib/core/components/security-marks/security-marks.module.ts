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
import { EditSecurityMarkEffect } from './effects/edit-security-mark.effect';
import { SecurityMarksDialogComponent } from './components/security-marks.dialog';
import { DisplaySecurityMarksComponent } from './components/display-security-marks/display-security-marks.component';
import { DisplaySecurityMarksDialogComponent } from './components/display-security-marks-dialogBox/display-security-marks-dialog.component';

export const effects = [EditSecurityMarkEffect];

@NgModule({
    imports: [EffectsModule.forFeature(effects), SecurityMarksDialogComponent, DisplaySecurityMarksComponent, DisplaySecurityMarksDialogComponent],
    exports: [SecurityMarksDialogComponent, DisplaySecurityMarksComponent, DisplaySecurityMarksDialogComponent]
})
export class SecurityMarksModule {
    constructor(extensions: ExtensionService) {
        extensions.setComponents({
            'app.display.security.marks': DisplaySecurityMarksComponent
        });
    }
}
