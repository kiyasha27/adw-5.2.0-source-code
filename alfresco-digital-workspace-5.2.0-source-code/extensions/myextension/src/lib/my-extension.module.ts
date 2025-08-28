import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { HelloComponent } from './pages/hello/hello.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TaxNumberComponent } from './pages/update-taxnumber/update-taxnumber-action.component';
import { Sad500Component } from './pages/update-sad500/update-sad500-action.component';
import {TaxpayerDataComponent } from './pages/update-taxpayer-data/update-taxpayer-data-action.component';
import { MainTaxpayerDataComponent } from './pages/update-main-taxpayer-data/update-main-taxpayer-data-action.component';
import { DocumentDataComponent } from './pages/update-document-data/update-document-data-action.component';
import { RunScriptComponent } from './pages/run-script/run-script-action.component';
import { RequestPhysicalFileComponent } from './pages/request-physical-file/request-physical-file-action.component';
import { PlaceInFileComponent } from './pages/place-in-file/place-in-file-action.component';

@NgModule({

  
  imports: [
    CommonModule,
    MatSnackBarModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    HelloComponent,
    TaxNumberComponent,
    TaxpayerDataComponent,
    Sad500Component,
    MainTaxpayerDataComponent,
    DocumentDataComponent,
    RequestPhysicalFileComponent,
    PlaceInFileComponent
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
      'my-extension-id.pages.action.update-taxnumber.page':TaxNumberComponent,
      'my-extension-id.pages.action.update-taxpayer-data.page': TaxpayerDataComponent,
      'my-extension-id.pages.action.update-sad500.page': Sad500Component,
      'my-extension-id.pages.action.update-main-taxpayer-data.page': MainTaxpayerDataComponent,
      'my-extension-id.pages.action.update-document-data.page': DocumentDataComponent,
      'my-extension-id.pages.action.run-script.page': RunScriptComponent,
      'my-extension-id.pages.action.place-in-file.page': PlaceInFileComponent,
      'my-extension-id.pages.action.request-physical-file.page': RequestPhysicalFileComponent

    });
  } 
}

