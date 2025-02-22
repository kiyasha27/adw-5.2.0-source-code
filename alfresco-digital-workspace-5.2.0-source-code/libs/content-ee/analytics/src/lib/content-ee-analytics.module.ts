/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendoService } from './pendo.service';

@NgModule({
    imports: [CommonModule],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (service: PendoService) => {
                return () => service.init();
            },
            deps: [PendoService],
            multi: true
        }
    ]
})
export class ContentEeAnalyticsModule {}
