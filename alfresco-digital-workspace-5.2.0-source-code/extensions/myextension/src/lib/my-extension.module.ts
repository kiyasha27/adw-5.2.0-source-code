import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { HelloComponent } from './pages/hello/hello.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TaxNumberComponent } from './pages/hello/update-taxnumber/update-taxnumber.component';


@NgModule({

  
  imports: [
    CommonModule,
    MatSnackBarModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    HelloComponent,
    TaxNumberComponent
  ],
  
  providers: [
    // Provide your extension descriptor JSON
    provideExtensionConfig(['myorg.my-customization.json'])
  ]
})
export class MyExtensionModule {
  constructor(extension: ExtensionService) {
    extension.setComponents({
      'my-extension-id.pages.hello.page':HelloComponent,
      'my-extension-id.pages.hello.update-taxnumber.update-taxnumber.page':TaxNumberComponent
      
    });
  } 
}

