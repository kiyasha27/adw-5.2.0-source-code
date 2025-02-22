/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs/operators';
import { SnackbarErrorAction } from '@alfresco/aca-shared/store';
import { updateProcessServiceHealth } from '../actions/process-services-health.actions';

@Injectable()
export class ProcessHealthEffects {
    private actions$ = inject(Actions);
    updateHealth$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(updateProcessServiceHealth),
                filter((action) => !action.health),
                map(() => new SnackbarErrorAction('PROCESS-EXTENSION.SNACKBAR.BACKEND_SERVICE_ERROR'))
            ),
        { dispatch: true }
    );
}
