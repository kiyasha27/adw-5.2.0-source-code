import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipe } from "../safe.pipe";
import { ViewerExtensionInterface } from '@alfresco/adf-extensions';
import { Node } from '@alfresco/js-api';

@Component({
    selector: 'app-custom-viewer',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule, SafePipe],
    template: `
        <div class="custom-viewer-wrapper">
            <div class="custom-viewer-toolbar">
                <button mat-icon-button (click)="zoomIn()">
                    <mat-icon>zoom_in</mat-icon>
                </button>
                <button mat-icon-button (click)="zoomOut()">
                    <mat-icon>zoom_out</mat-icon>
                </button>
            </div>
            <div class="custom-viewer-content">
                <iframe
                    *ngIf="blobUrl"
                    [src]="blobUrl | safe"
                    width="100%"
                    height="100%"
                    frameborder="0">
                </iframe>
            </div>
        </div>
    `,
    styles: [`
        .custom-viewer-wrapper {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
        }

        .custom-viewer-toolbar {
            display: flex;
            padding: 8px;
            background-color:rgb(147, 211, 246);
            border-bottom: 1px solid #eee;
        }

        .custom-viewer-content {
            flex: 1;
            overflow: hidden;
        }

        iframe {
            border: none;
        }
    `],
    encapsulation: ViewEncapsulation.None
})
export class CustomViewerComponent implements ViewerExtensionInterface {
    url: string;
    nameFile: string;
    node: Node;
    @Input() blobFile?: Blob;
    @Input() fileName?: string;

    blobUrl?: string;
    zoom: number = 100;

    ngOnInit() {
        if (this.blobFile) {
            this.blobUrl = URL.createObjectURL(this.blobFile);
        }
    }

    ngOnDestroy() {
        if (this.blobUrl) {
            URL.revokeObjectURL(this.blobUrl);
        }
    }

    zoomIn() {
        this.zoom = Math.min(this.zoom + 25, 300);
        this.updateZoom();
    }

    zoomOut() {
        this.zoom = Math.max(this.zoom - 25, 25);
        this.updateZoom();
    }

    private updateZoom() {
        // Implement zoom logic here
    }
}
 