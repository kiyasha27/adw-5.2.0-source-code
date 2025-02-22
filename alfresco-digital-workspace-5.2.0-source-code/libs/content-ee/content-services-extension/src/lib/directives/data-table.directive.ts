/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { DestroyRef, Directive, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserPreferencesService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { Node } from '@alfresco/js-api';
import { DataTableExtensionComponent } from '../components/shared/data-table-extension/data-table-extension.component';
import { DocumentListService } from '@alfresco/adf-content-services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
    standalone: true,
    selector: '[adwDataTable]'
})
export class DataTableDirective implements OnInit {
    private documentListService = inject(DocumentListService);
    selectedNode: Node;

    get sortingPreferenceKey(): string {
        return this.route.snapshot.data['sortingPreferenceKey'];
    }

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly store: Store<any>,
        private readonly containerComponent: DataTableExtensionComponent,
        private readonly preferences: UserPreferencesService,
        private readonly route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.documentListService.resetSelection$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.reset());

        if (this.sortingPreferenceKey) {
            const current = this.containerComponent.sorting;

            const key = this.preferences.get(`${this.sortingPreferenceKey}.sorting.key`, current[0]);
            const direction = this.preferences.get(`${this.sortingPreferenceKey}.sorting.direction`, current[1]);
            this.containerComponent.data.setSorting({ key, direction });
        }
    }

    @HostListener('sorting-changed', ['$event'])
    onSortingChanged(event: CustomEvent) {
        if (this.sortingPreferenceKey) {
            this.preferences.set(`${this.sortingPreferenceKey}.sorting.key`, event.detail.key);
            this.preferences.set(`${this.sortingPreferenceKey}.sorting.direction`, event.detail.direction);
        }
    }

    @HostListener('row-select', ['$event'])
    onNodeSelect(event: CustomEvent) {
        if (!!event.detail && !!event.detail.row.node) {
            this.updateSelection();
            this.selectedNode = event.detail.row.node;
        }
    }

    @HostListener('row-unselect')
    onNodeUnselect() {
        this.updateSelection();
    }

    private updateSelection() {
        const selection = this.containerComponent.dataTable.selection
            .map((selected) => selected['node'])
            .map((node) => {
                node['isLibrary'] = true;
                return node;
            });

        this.store.dispatch(new SetSelectedNodesAction(selection));
    }

    private reset() {
        this.containerComponent.dataTable.resetSelection();
        this.store.dispatch(new SetSelectedNodesAction([]));
    }
}
