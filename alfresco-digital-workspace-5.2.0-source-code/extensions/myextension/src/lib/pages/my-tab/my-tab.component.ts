// src/app/custom/my-tab.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'lib-my-tab',
  template: `
    <mat-card>
      <h3>Custom Tab Content</h3>
      <p *ngIf="node"><strong>Name:</strong> {{ node.name }}</p>
      <p *ngIf="node"><strong>ID:</strong> {{ node.id }}</p>
      <p *ngIf="!node">No data available.</p>
    </mat-card>
  `,
  standalone: true,
  imports: [CommonModule, MatCardModule]
})
export class MyTabComponent {
  @Input() node: any; // receives payload from drawer
}
