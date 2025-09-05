import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';
import { CustomInfoDrawerService } from '../services/custom-info-drawer.service';

export interface ToggleInfoDrawerAction extends Action {
  type: 'TOGGLE_INFO_DRAWER';
  payload: {
    drawerType: string;
    selectedNode?: any;
  };
}

@Injectable()
export class CustomActionsHandler {
  constructor(
    private actions$: Actions,
    private infoDrawerService: CustomInfoDrawerService,
    private store: Store<any>
  ) {}

  toggleInfoDrawer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ToggleInfoDrawerAction>('TOGGLE_INFO_DRAWER'),
        withLatestFrom(this.store.select(state => state.selection || {})),
        tap(([action, selectionState]) => {
          const { drawerType } = action.payload;
          
          console.log('Action payload:', action.payload);
          console.log('Selection state:', selectionState);
          
          // Get the selected node from the store state or from action payload
          const selectedNode = action.payload.selectedNode || 
                              selectionState.file || 
                              selectionState.nodes?.[0] ||
                              selectionState.first ||
                              null;
          
          console.log('Final selected node for drawer:', selectedNode);
          
          // Set the drawer state to show the appropriate tab
          this.infoDrawerService.openDrawer(drawerType, selectedNode);
          
          // Dispatch action to show the standard info drawer
          // This will make the sidebar visible, and our custom tabs will appear
          this.store.dispatch({
            type: 'SET_INFO_DRAWER_STATE',
            payload: true
          });
        })
      ),
    { dispatch: false }
  );
}
