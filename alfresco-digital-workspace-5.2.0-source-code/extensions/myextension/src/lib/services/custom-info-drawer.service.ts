import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface InfoDrawerState {
  isOpen: boolean;
  drawerType: string | null;
  selectedNode: any | null;
}

@Injectable({
  providedIn: 'root'
})
export class CustomInfoDrawerService {
  private initialState: InfoDrawerState = {
    isOpen: false,
    drawerType: null,
    selectedNode: null
  };

  private stateSubject = new BehaviorSubject<InfoDrawerState>(this.initialState);
  public state$: Observable<InfoDrawerState> = this.stateSubject.asObservable();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  get currentState(): InfoDrawerState {
    return this.stateSubject.value;
  }

  openDrawer(drawerType: string, selectedNode?: any): void {
    this.stateSubject.next({
      isOpen: true,
      drawerType,
      selectedNode: selectedNode || null
    });
  }

  closeDrawer(): void {
    this.stateSubject.next({
      ...this.currentState,
      isOpen: false
    });
  }

  toggleDrawer(drawerType: string, selectedNode?: any): void {
    const currentState = this.currentState;
    
    if (currentState.isOpen && currentState.drawerType === drawerType) {
      this.closeDrawer();
    } else {
      this.openDrawer(drawerType, selectedNode);
    }
  }

  setSelectedNode(selectedNode: any): void {
    this.stateSubject.next({
      ...this.currentState,
      selectedNode
    });
  }

  reset(): void {
    this.stateSubject.next(this.initialState);
  }
}
