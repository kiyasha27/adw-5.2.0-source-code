import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { HelloComponent } from './pages/hello/hello.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
//import { DialogHostComponent } from './pages/hello/dialog-host.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';


@NgModule({

  
  imports: [
    CommonModule,
    MatSnackBarModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    HelloComponent,
    //DialogHostComponent
    
   //CustomViewerComponent
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
      'my-extension-id.pages.hello.page':HelloComponent,
      //'my-extension-id.handlers.dialogHost': DialogHostComponent,
    });
  } 
}

