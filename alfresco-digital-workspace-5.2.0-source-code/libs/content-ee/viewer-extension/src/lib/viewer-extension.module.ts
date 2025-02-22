import { NgModule } from '@angular/core';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { CustomViewerComponent } from './components/custom-viewer/custom-viewer.component';


@NgModule({
    imports: [CustomViewerComponent],
    providers: [
        provideExtensionConfig(['viewer-extension.json'])
    ]
})
export class ViewerExtensionModule {
    constructor(extensions: ExtensionService) {
        extensions.setComponents({
            'app.viewer.custom-viewer': CustomViewerComponent
        });
    }
}
