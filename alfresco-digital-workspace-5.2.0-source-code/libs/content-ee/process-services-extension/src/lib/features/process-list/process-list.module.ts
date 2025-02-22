/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ExtensionService } from '@alfresco/adf-extensions';
import { ProcessListExtComponent } from './components/process-list-ext.component';
import { ProcessListExtEffect } from './effects/process-list-ext.effect';

@NgModule({
    imports: [EffectsModule.forFeature([ProcessListExtEffect]), ProcessListExtComponent]
})
export class ProcessListModule {
    constructor(extensions: ExtensionService) {
        extensions.setComponents({
            'process-services-plugin.components.process-list-ext': ProcessListExtComponent
        });
    }
}
