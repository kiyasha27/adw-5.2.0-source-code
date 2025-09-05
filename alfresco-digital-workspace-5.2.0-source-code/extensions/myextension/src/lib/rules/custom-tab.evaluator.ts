import { RuleContext } from '@alfresco/adf-extensions';
import { CustomInfoDrawerService } from '../services/custom-info-drawer.service';

export function isUpdateTinEtinTabVisible(context: RuleContext, infoDrawerService?: CustomInfoDrawerService): boolean {
  if (!infoDrawerService) {
    return false;
  }
  
  const currentState = infoDrawerService.currentState;
  return currentState.isOpen && currentState.drawerType === 'update-taxnumber';
}

export function isUpdateTaxpayerDataTabVisible(context: RuleContext, infoDrawerService?: CustomInfoDrawerService): boolean {
  if (!infoDrawerService) {
    return false;
  }
  
  const currentState = infoDrawerService.currentState;
  return currentState.isOpen && currentState.drawerType === 'update-taxpayer-data';
}

export function isUpdateSad500TabVisible(context: RuleContext, infoDrawerService?: CustomInfoDrawerService): boolean {
  if (!infoDrawerService) {
    return false;
  }
  
  const currentState = infoDrawerService.currentState;
  return currentState.isOpen && currentState.drawerType === 'update-sad500';
}

// new action function
export function isUpdateMainTaxpayerDataTabVisible(context: RuleContext, infoDrawerService?: CustomInfoDrawerService): boolean {
  if (!infoDrawerService) {
    return false;
  }

  const currentState = infoDrawerService.currentState;
  return currentState.isOpen && currentState.drawerType === 'update-main-taxpayer-data';
}

// new action function
export function isUpdateDocumentDataTabVisible(context: RuleContext, infoDrawerService?: CustomInfoDrawerService): boolean {
  if (!infoDrawerService) {
    return false;
  }

  const currentState = infoDrawerService.currentState;
  return currentState.isOpen && currentState.drawerType === 'update-document-data';
}



export function isDocumentActionsTabVisible(context: RuleContext, infoDrawerService?: CustomInfoDrawerService): boolean {
  if (!infoDrawerService) {
    return false;
  }


  
  const currentState = infoDrawerService.currentState;
  const documentActionTypes = [
    'update-main-taxpayer-data',
    'update-document-data', 
    'run-script',
    'place-in-file',
    'request-physical-file',
    'update-main-taxpayer-data',
    'update-document-data'
  ];
  
  return currentState.isOpen && documentActionTypes.includes(currentState.drawerType || '');
}

export function isAnyCustomTabVisible(context: RuleContext, infoDrawerService?: CustomInfoDrawerService): boolean {
  if (!infoDrawerService) {
    return false;
  }
  
  const currentState = infoDrawerService.currentState;
  return currentState.isOpen && !!currentState.drawerType;
}
