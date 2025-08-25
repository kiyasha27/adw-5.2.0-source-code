import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { HelloComponent } from './pages/hello/hello.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  
  imports: [
    CommonModule,
    MatSnackBarModule
   // CustomViewerComponent
  ],
  providers: [
    // Provide your extension descriptor JSON
    provideExtensionConfig(['myorg.my-customization.json'])
  ]
})
export class MyExtensionModule {
  constructor(extension: ExtensionService) {
    extension.setComponents({
      //'my-org.components.custom-viewer': CustomViewerComponent,
      'my-extension-id.pages.hello.page':HelloComponent
    });
  } 
}
