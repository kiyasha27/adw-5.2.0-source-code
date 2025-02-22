import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { CustomViewerComponent } from './viewer/custom-viewer/custom-viewer.component';
import { HelloComponent } from './pages/hello/hello.component';

@NgModule({
  imports: [
    CommonModule,
    CustomViewerComponent
  ],
  providers: [
    // Provide your extension descriptor JSON
    provideExtensionConfig(['myorg.my-customization.json'])
  ]
})
export class MyExtensionModule {
  constructor(extension: ExtensionService) {
    extension.setComponents({
      'my-org.components.custom-viewer': CustomViewerComponent,
      'my-extension-id.pages.hello.page':HelloComponent
    });
  }
}
