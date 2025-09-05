import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { CustomInfoDrawerComponent } from './components/info-drawer/custom-info-drawer.component';
import { UpdateTinEtinTabComponent } from './components/tabs/update-tin-etin-tab/update-tin-etin-tab.component';
import { UpdateTaxpayerDataTabComponent } from './components/tabs/update-taxpayer-data-tab/update-taxpayer-data-tab.component';
import { UpdateSad500TabComponent } from './components/tabs/update-sad500-tab/update-sad500-tab.component';
import { DocumentActionsTabComponent } from './components/tabs/document-actions-tab/document-actions-tab.component';
import { CustomInfoDrawerService } from './services/custom-info-drawer.service';
import { CustomActionsHandler } from './actions/custom-actions.handler';
import * as customTabEvaluators from './rules/custom-tab.evaluator';
import { EffectsModule } from '@ngrx/effects';
import { UpdateMainTaxpayerDataTabComponent } from './components/tabs/update-main-taxpayer-data-tab/update-main-taxpayer-tab.component';
import { UpdateDocumentDataTabComponent } from './components/tabs/update-document-data-tab/update-document-data-tab.component';

@NgModule({

  
  imports: [
    CommonModule,
    EffectsModule.forFeature([CustomActionsHandler])
    
  ],
  
  providers: [
    // Provide your extension descriptor JSON 
    CustomInfoDrawerService,
    CustomActionsHandler,
    provideExtensionConfig(['myorg.my-customization.json'])
  ]
})
export class MyExtensionModule {
  constructor(extension: ExtensionService, infoDrawerService: CustomInfoDrawerService) {
    extension.setComponents({


      'my-extension-id.components.info-drawer': CustomInfoDrawerComponent,
      'my-extension-id.tabs.update-tin-etin': UpdateTinEtinTabComponent, //done
      'my-extension-id.tabs.update-taxpayer-data': UpdateTaxpayerDataTabComponent,
      'my-extension-id.tabs.update-sad500': UpdateSad500TabComponent, //done
      'my-extension-id.tabs.document-actions': DocumentActionsTabComponent,
      'my-extension-id.tabs.update-main-taxpayer-data': UpdateMainTaxpayerDataTabComponent, // done
      'my-extension-id.tabs.update-document-data': UpdateDocumentDataTabComponent

    });
        // Register custom evaluators for tab visibility
    extension.setEvaluators({
      'app.custom.isUpdateTinEtinTabVisible': (context: any) => customTabEvaluators.isUpdateTinEtinTabVisible(context, infoDrawerService),
      'app.custom.isUpdateTaxpayerDataTabVisible': (context: any) => customTabEvaluators.isUpdateTaxpayerDataTabVisible(context, infoDrawerService),
      'app.custom.isUpdateSad500TabVisible': (context: any) => customTabEvaluators.isUpdateSad500TabVisible(context, infoDrawerService),
      'app.custom.isDocumentActionsTabVisible': (context: any) => customTabEvaluators.isDocumentActionsTabVisible(context, infoDrawerService),
      'app.custom.isAnyCustomTabVisible': (context: any) => customTabEvaluators.isAnyCustomTabVisible(context, infoDrawerService),
      'app.custom.isUpdateMainTaxpayerDataTabVisible': (context: any) => customTabEvaluators.isUpdateMainTaxpayerDataTabVisible(context, infoDrawerService),
      'app.custom.isUpdateDocumentDataTabVisible': (context: any) => customTabEvaluators.isUpdateDocumentDataTabVisible(context, infoDrawerService)
    });
  } 
}

