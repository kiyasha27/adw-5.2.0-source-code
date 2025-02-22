/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
    AppExtensionService,
    AppHookService,
    ContextActionsDirective,
    InfoDrawerComponent,
    PageComponent,
    PageLayoutComponent,
    PaginationDirective,
    ToolbarComponent
} from '@alfresco/aca-shared';
import { merge } from 'rxjs';
import { isInfoDrawerOpened, NavigateLibraryAction, SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs/operators';
import {
    CustomEmptyContentTemplateDirective,
    DataColumnComponent,
    DataColumnListComponent,
    EmptyContentComponent,
    PaginationComponent,
    UserPreferencesService
} from '@alfresco/adf-core';
import { LibraryNameColumnComponent, LibraryRoleColumnComponent, SitesService } from '@alfresco/adf-content-services';
import { SiteEntry, SitePaging } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DataTableDirective } from '../../../directives/data-table.directive';
import { DataTableExtensionComponent } from '../../shared/data-table-extension/data-table-extension.component';

@Component({
    selector: 'adw-library-list',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        PageLayoutComponent,
        InfoDrawerComponent,
        PaginationDirective,
        ContextActionsDirective,
        DataTableDirective,
        DataTableExtensionComponent,
        ToolbarComponent,
        DataColumnComponent,
        DataColumnListComponent,
        LibraryNameColumnComponent,
        LibraryRoleColumnComponent,
        EmptyContentComponent,
        PaginationComponent,
        CustomEmptyContentTemplateDirective
    ],
    templateUrl: './library-list.component.html',
    styleUrls: ['./library-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LibraryListComponent extends PageComponent implements OnInit, OnDestroy {
    sites: SitePaging;
    isLoading = true;

    constructor(
        protected appExtensionService: AppExtensionService,
        protected store: Store<any>,
        private sitesService: SitesService,
        private userPreferences: UserPreferencesService,
        private appHookService: AppHookService
    ) {
        super();
        this.infoDrawerOpened$ = this.store.select(isInfoDrawerOpened);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.loadSites(0, this.userPreferences.paginationSize);
        merge(
            this.appHookService.libraryDeleted,
            this.appHookService.libraryLeft,
            this.appHookService.libraryJoined,
            this.appHookService.libraryUpdated
        ).subscribe(() => {
            this.store.dispatch(new SetSelectedNodesAction([]));
            this.loadSites(0, this.userPreferences.paginationSize);
        });
    }

    loadSites(skipCount, maxItems) {
        this.isLoading = true;
        this.sitesService
            .getSites({ skipCount, maxItems })
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe((sites) => (this.sites = sites));
    }

    navigateTo(site: SiteEntry) {
        console.log(site);
        
        this.store.dispatch(new NavigateLibraryAction(site.entry.guid));
    }

    updatePagination({ skipCount, maxItems }): void {
        this.loadSites(skipCount, maxItems);
    }
}
