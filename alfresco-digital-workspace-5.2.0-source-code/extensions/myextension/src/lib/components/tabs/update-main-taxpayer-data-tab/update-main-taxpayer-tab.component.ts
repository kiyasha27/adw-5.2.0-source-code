import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NodesApiService } from '@alfresco/adf-content-services';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomInfoDrawerService } from '../../../services/custom-info-drawer.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'lib-app-update-main-taxpayer-data-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    MatCardModule

  ],
  template: `
  <div class="custom-tab-content scroll-container">
  <h3>Update Main Taxpayer Data</h3>

  <!-- General Section -->
  <mat-card class="section-card">
    <div class="section-header">General</div>

    <form [formGroup]="form" class="form-content">
      <!-- Taxpayer Type -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Taxpayer Type</mat-label>
        <mat-select formControlName="taxpayerType">
          <mat-option value="Company">Company</mat-option>
          <mat-option value="Individual">Individual</mat-option>
          <mat-option value="Employee">Employee</mat-option>
        </mat-select>
        <mat-error *ngIf="form.get('taxpayerType')?.hasError('required')">
          Taxpayer Type is required
        </mat-error>
      </mat-form-field>

      <!-- File Type -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>File Type</mat-label>
        <mat-select formControlName="fileType">
          <mat-option value="Audit">Audit</mat-option>
          <mat-option value="Collection">Collection</mat-option>
          <mat-option value="Registration">Registration</mat-option>
          <mat-option value="VAT">VAT</mat-option>
          <mat-option value="PAYE">PAYE</mat-option>
          <mat-option value="WHT">WHT</mat-option>
          <mat-option value="CIT">CIT</mat-option>
          <mat-option value="IIT">IIT</mat-option>
          <mat-option value="FBT">FBT</mat-option>
          <mat-option value="Excise Tax">Excise Tax</mat-option>
          <mat-option value="Gaming Levy">Gaming Levy</mat-option>
        </mat-select>
        <mat-error *ngIf="form.get('fileType')?.hasError('required')">
          File Type is required
        </mat-error>
      </mat-form-field>

      <!-- Financial Year -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Financial Year</mat-label>
        <input matInput formControlName="financialYear" placeholder="e.g. 2024-25" />
        <mat-error *ngIf="form.get('financialYear')?.hasError('required')">
          Financial Year is required
        </mat-error>
      </mat-form-field>

      <!-- Document Type -->
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Document Type</mat-label>
        <mat-select formControlName="documentType">
          <mat-option value="Taxpayer Registration Form">Taxpayer Registration Form</mat-option>
          <mat-option value="Audit Supporting Documents">Audit Supporting Documents</mat-option>
          <mat-option value="Collection Information Statement">Collection Information Statement</mat-option>
          <mat-option value="Customs Client Registration Form">Customs Client Registration Form</mat-option>
          <mat-option value="Customs Client Supporting Documents">Customs Client Supporting Documents</mat-option>
          <mat-option value="Correspondence">Correspondence</mat-option>
          <mat-option value="Tax Return Forms">Tax Return Forms</mat-option>
          <mat-option value="Financial Statements">Financial Statements</mat-option>
          <mat-option value="Supporting Documents">Supporting Documents</mat-option>
          <mat-option value="Excise Tax Return">Excise Tax Return</mat-option>
          <mat-option value="Other">Other</mat-option>
        </mat-select>
        <mat-error *ngIf="form.get('documentType')?.hasError('required')">
          Document Type is required
        </mat-error>
      </mat-form-field>

      <!-- Action Buttons -->
      <div class="form-actions">
        <button mat-button color="warn" type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" (click)="onSubmit()">Save Changes</button>
      </div>
    </form>
  </mat-card>
</div>

`,
styleUrls: ['../update-tin-etin-tab/update-tin-etin-tab.component.scss']
})
export class UpdateMainTaxpayerDataTabComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  selectedNode: any;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private nodeApi: NodesApiService,
    private infoDrawerService: CustomInfoDrawerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      taxpayerType: [''],
      fileType: [''],
      documentType: ['', Validators.required],
      financialYear: ['']
    });

    // subscribe to info drawer state
    this.infoDrawerService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state.selectedNode) {
          this.selectedNode = state.selectedNode;
          this.loadNodeData();
        }
      });

    // check immediately
    const currentState = this.infoDrawerService.currentState;
    if (currentState.selectedNode) {
      this.selectedNode = currentState.selectedNode;
      this.loadNodeData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadNodeData(): void {
    const nodeId = this.selectedNode?.entry?.id || this.selectedNode?.id;
    if (!nodeId) return;

    this.nodeApi.getNode(nodeId).subscribe({
      next: (node: any) => {
        const props = node?.properties || {};
        this.form.patchValue({
          taxpayerType: props['lracore:taxpayerType'] || '',
          fileType: props['lracore:fileType'] || '',
          documentType: props['lracore:documentType'] || '',
          financialYear: props['lracore:financialYear'] || ''
        });
      },
      error: () => this.showError('Could not load taxpayer data ❌')
    });
  }

  private validateFileVsDocument(): boolean {
    const { fileType, documentType } = this.form.value;

    if (fileType === 'Audit' && documentType !== 'Audit Supporting Documents') {
      this.showError("Audit requires 'Audit Supporting Documents'");
      return false;
    }
    if (fileType === 'Collection' && documentType !== 'Collection Information Statement') {
      this.showError("Collection requires 'Collection Information Statement'");
      return false;
    }
    if (fileType === 'Registration' && documentType !== 'Taxpayer Registration Form') {
      this.showError("Registration requires 'Taxpayer Registration Form'");
      return false;
    }

    const allowedTypes = [
      'Correspondence',
      'Financial Statements',
      'Supporting Documents',
      'Tax Return Forms',
      'Customs Client Registration Form',
      'Customs Client Supporting Documents',
      'Excise Tax Return',
      'Other'
    ];

    if (!['Audit', 'Collection', 'Registration'].includes(fileType) && !allowedTypes.includes(documentType)) {
      this.showError("'File Type' and 'Document Type' do not match");
      return false;
    }

    return true;
  }

  private validateFinancialYear(): boolean {
    const { fileType, financialYear } = this.form.value;

    if (['Audit', 'Collection', 'Registration'].includes(fileType)) {
      if (financialYear?.trim()) {
        this.showError("Financial Year must NOT be specified for Audit, Collection, Registration");
        return false;
      }
      return true;
    }

    if (!financialYear?.trim()) {
      this.showError("Financial Year is required");
      return false;
    }

    const regex = /^\d{4}-\d{2}$/;
    if (!regex.test(financialYear)) {
      this.showError("Format must be CCYY-YY (e.g., 2022-23)");
      return false;
    }

    const startYear = parseInt(financialYear.substring(0, 4), 10);
    const endYear = parseInt(financialYear.substring(5), 10) + 2000;
    if (endYear - startYear !== 1) {
      this.showError("Years must be consecutive (e.g., 2022-23)");
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validateFileVsDocument()) return;
    if (!this.validateFinancialYear()) return;

    this.updateMetadata();
  }

  private updateMetadata(): void {
    const nodeId = this.selectedNode?.entry?.id || this.selectedNode?.id;
    if (!nodeId) {
      this.showError('No node selected ❌');
      return;
    }

    const updatedProps = {
      'lracore:taxpayerType': this.form.value.taxpayerType,
      'lracore:fileType': this.form.value.fileType,
      'lracore:documentType': this.form.value.documentType,
      'lracore:financialYear': this.form.value.financialYear
    };

    this.nodeApi.updateNode(nodeId, { properties: updatedProps }).subscribe({
      next: () => this.showSuccess('Main taxpayer data updated ✅'),
      error: (err) => {
        console.error('Error updating taxpayer data:', err);
        this.showError('Failed to update taxpayer data ❌');
      }
    });
    this.form.reset();
  }

  onCancel(): void {
    this.form.reset();
    this.infoDrawerService.closeDrawer();
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
