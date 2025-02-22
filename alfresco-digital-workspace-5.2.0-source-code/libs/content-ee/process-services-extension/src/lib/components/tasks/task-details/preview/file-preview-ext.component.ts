/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ContentLinkModel, DownloadService, ViewerComponent, ViewerMoreActionsComponent } from '@alfresco/adf-core';
import { CommonModule, Location } from '@angular/common';
import { ProcessServiceExtensionState } from '../../../../store/reducers/process-services.reducer';
import { Store } from '@ngrx/store';
import { getAttachedContent } from '../../../../process-services-ext.selector';
import { ProcessContentService } from '@alfresco/adf-process-services';
import { first } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'aps-file-preview-ext',
    standalone: true,
    imports: [CommonModule, ViewerComponent, TranslateModule, MatMenuModule, MatIconModule, ViewerMoreActionsComponent],
    templateUrl: './file-preview-ext.component.html',
    styles: [
        `
            adf-viewer .adf-viewer__file-title {
                top: unset;
            }
        `
    ],
    encapsulation: ViewEncapsulation.None
})
export class FilePreviewExtComponent implements OnInit, OnDestroy {
    content = new ContentLinkModel();
    showViewer = true;
    constructor(
        private processContentService: ProcessContentService,
        private downloadService: DownloadService,
        private location: Location,
        private store: Store<ProcessServiceExtensionState>
    ) {}

    ngOnInit() {
        console.log("heya");
        
        this.store.select(getAttachedContent).pipe(first()).subscribe((content) => {
            const id = content?.id || parseInt(sessionStorage.getItem('file-viewer-file-id'), 10);
            const name = content?.name || sessionStorage.getItem('file-viewer-file-name');

            if (content?.contentBlob) {
                this.content = content;
            } else {
                this.processContentService.getFileRawContent(id).pipe(first()).subscribe((blob: Blob) => {
                    this.content.contentBlob = blob;
                    this.content.id = id;
                    this.content.name = name;
                });
            }

            if (id && name) {
                sessionStorage.setItem('file-viewer-file-id', String(id));
                sessionStorage.setItem('file-viewer-file-name', name);
            }
        });
    }

    ngOnDestroy(): void {
        sessionStorage.removeItem('file-viewer-file-id');
        sessionStorage.removeItem('file-viewer-file-name');
    }

    onViewerVisibilityChanged() {
        this.location.back();
    }

    public downloadContent(): void {
        this.processContentService
            .getFileRawContent(this.content.id)
            .subscribe((blob: Blob) => this.downloadService.downloadBlob(blob, this.content.name));
    }
}
