import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CustomInfoDrawerService } from '../../../services/custom-info-drawer.service';

@Component({
  selector: 'lib-app-document-actions-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    TranslateModule
  ],
  template: `
    <div class="custom-tab-content">
      <h3>Document Actions</h3>
      
      <!-- Action Type Selector -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Select Action</mat-label>
        <mat-select [(ngModel)]="selectedAction" name="actionType" (selectionChange)="onActionChange()">
          <mat-option value="update-main-taxpayer-data">Update Main Taxpayer Data</mat-option>
          <mat-option value="update-document-data">Update Document Data</mat-option>
          <mat-option value="run-script">Run Script</mat-option>
          <mat-option value="place-in-file">Place In File</mat-option>
          <mat-option value="request-physical-file">Request Physical File</mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Dynamic Form based on selected action -->
      <form #actionForm="ngForm" (ngSubmit)="onSubmit()" *ngIf="selectedAction">
        
        <!-- Update Main Taxpayer Data -->
        <ng-container *ngIf="selectedAction === 'update-main-taxpayer-data'">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Main Taxpayer Name</mat-label>
            <input matInput [(ngModel)]="formData.mainTaxpayerName" name="mainTaxpayerName" required>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Registration Number</mat-label>
            <input matInput [(ngModel)]="formData.registrationNumber" name="registrationNumber" required>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Business Type</mat-label>
            <mat-select [(ngModel)]="formData.businessType" name="businessType" required>
              <mat-option value="individual">Individual</mat-option>
              <mat-option value="company">Company</mat-option>
              <mat-option value="partnership">Partnership</mat-option>
            </mat-select>
          </mat-form-field>
        </ng-container>

        <!-- Update Document Data -->
        <ng-container *ngIf="selectedAction === 'update-document-data'">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Document Title</mat-label>
            <input matInput [(ngModel)]="formData.documentTitle" name="documentTitle" required>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Document Type</mat-label>
            <mat-select [(ngModel)]="formData.documentType" name="documentType" required>
              <mat-option value="invoice">Invoice</mat-option>
              <mat-option value="receipt">Receipt</mat-option>
              <mat-option value="contract">Contract</mat-option>
              <mat-option value="other">Other</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput [(ngModel)]="formData.description" name="description" rows="3"></textarea>
          </mat-form-field>
        </ng-container>

        <!-- Run Script -->
        <ng-container *ngIf="selectedAction === 'run-script'">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Script Type</mat-label>
            <mat-select [(ngModel)]="formData.scriptType" name="scriptType" required>
              <mat-option value="validation">Validation Script</mat-option>
              <mat-option value="processing">Processing Script</mat-option>
              <mat-option value="export">Export Script</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Parameters</mat-label>
            <textarea matInput [(ngModel)]="formData.parameters" name="parameters" rows="4" 
              placeholder="Enter script parameters (JSON format)"></textarea>
          </mat-form-field>
        </ng-container>

        <!-- Place In File -->
        <ng-container *ngIf="selectedAction === 'place-in-file'">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>File Category</mat-label>
            <mat-select [(ngModel)]="formData.fileCategory" name="fileCategory" required>
              <mat-option value="tax-documents">Tax Documents</mat-option>
              <mat-option value="legal-documents">Legal Documents</mat-option>
              <mat-option value="financial-documents">Financial Documents</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Priority</mat-label>
            <mat-select [(ngModel)]="formData.priority" name="priority" required>
              <mat-option value="high">High</mat-option>
              <mat-option value="medium">Medium</mat-option>
              <mat-option value="low">Low</mat-option>
            </mat-select>
          </mat-form-field>
        </ng-container>

        <!-- Request Physical File -->
        <ng-container *ngIf="selectedAction === 'request-physical-file'">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Request Reason</mat-label>
            <textarea matInput [(ngModel)]="formData.requestReason" name="requestReason" required rows="3"
              placeholder="Please provide the reason for requesting the physical file"></textarea>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Urgency</mat-label>
            <mat-select [(ngModel)]="formData.urgency" name="urgency" required>
              <mat-option value="urgent">Urgent</mat-option>
              <mat-option value="normal">Normal</mat-option>
              <mat-option value="low">Low Priority</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Requester Name</mat-label>
            <input matInput [(ngModel)]="formData.requesterName" name="requesterName" required>
          </mat-form-field>
        </ng-container>

        <div class="form-actions">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!actionForm.form.valid">
            Execute Action
          </button>
        </div>
      </form>

      <!-- Selected Node Info -->
      <div class="node-info" *ngIf="selectedNode">
        <h4>Document Information</h4>
        <p><strong>Name:</strong> {{ selectedNode.name }}</p>
        <p><strong>Type:</strong> {{ selectedNode.nodeType }}</p>
        <p><strong>Modified:</strong> {{ selectedNode.modifiedAt | date }}</p>
      </div>
    </div>
  `,
  styleUrls: ['../update-tin-etin-tab/update-tin-etin-tab.component.scss']
})
export class DocumentActionsTabComponent implements OnInit {
  @Input() selectedNode: any;

  selectedAction = '';
  formData: any = {};

  constructor(private infoDrawerService: CustomInfoDrawerService) {}

  ngOnInit(): void {
    // Initialize based on drawer state if needed
    const currentState = this.infoDrawerService.currentState;
    if (currentState.drawerType && currentState.drawerType !== 'update-taxnumber' && 
        currentState.drawerType !== 'update-taxpayer-data' && currentState.drawerType !== 'update-sad500') {
      this.selectedAction = currentState.drawerType;
      this.onActionChange();
    }
  }

  onActionChange(): void {
    // Reset form data when action changes
    this.formData = {};
  }

  onSubmit(): void {
    console.log(`${this.selectedAction} form submitted:`, this.formData);
    // Here you would typically make an API call to execute the action
  }

  onCancel(): void {
    // Reset form data
    this.selectedAction = '';
    this.formData = {};
    
    // Close the drawer
    this.infoDrawerService.closeDrawer();
  }
}
