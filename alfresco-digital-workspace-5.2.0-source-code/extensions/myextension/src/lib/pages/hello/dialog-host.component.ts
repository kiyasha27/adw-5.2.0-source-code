import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelloComponent } from './hello.component';

@Component({
  selector: 'lib-dialog-host',
  standalone: true,
  template: ''
})
export class DialogHostComponent {
  constructor(private dialog: MatDialog) {}

  openHelloDialog(): void {
    this.dialog.open(HelloComponent, {
      width: '400px'
    });
  }
}