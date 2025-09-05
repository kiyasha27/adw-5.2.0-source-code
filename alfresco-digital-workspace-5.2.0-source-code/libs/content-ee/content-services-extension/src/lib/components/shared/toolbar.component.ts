/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppExtensionService } from '@alfresco/aca-shared';
import { DestroyRef, Directive, inject, OnDestroy, OnInit } from '@angular/core';
import { getAppSelection, SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { ContentActionRef, SelectionState } from '@alfresco/adf-extensions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class ToolbarComponent implements OnInit, OnDestroy {
    selection: SelectionState;
    actions: Array<ContentActionRef>;

    private readonly destroyRef = inject(DestroyRef);
    protected readonly router = inject(Router);
    selectedNode: any;
    actionService: any;

    protected constructor(protected store: Store<any>, protected appExtensionService: AppExtensionService) { }

    ngOnInit(): void {
        this.store
            .select(getAppSelection)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((selection) => {
                this.selection = selection;
            });

        this.appExtensionService.getAllowedToolbarActions()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((actions) => {
                this.actions = actions;
            });
    }

    ngOnDestroy(): void {
        this.store.dispatch(new SetSelectedNodesAction([]));
    }

    trackByActionId(_: number, action: ContentActionRef) {
        return action.id;
    }

  onActionClick(action: any) {
    console.log('Action executed:', action);
    // later you can trigger your Alfresco action here
    
  


}
openInfoDrawer() {
    if (!this.selectedNode) {
      console.warn('No node selected!');
      return;
    }

    this.actionService.execute({
      id: 'sad500.actions.execute',
      entry: this.selectedNode
    });
  }
}

