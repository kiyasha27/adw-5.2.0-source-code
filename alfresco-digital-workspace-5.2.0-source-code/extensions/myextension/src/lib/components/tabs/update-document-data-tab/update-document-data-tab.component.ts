import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NodesApiService } from '@alfresco/adf-content-services';
import { CustomInfoDrawerService } from '../../../services/custom-info-drawer.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'lib-app-update-document-data-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCardModule
  ],
  template: `
    <div class="custom-tab-content scroll-container">
  <h3>Update Document Data</h3>

  <!-- General Section -->
  <mat-card class="section-card">
    <div class="section-header">General</div>
    <form [formGroup]="form" class="form-content">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Financial Period (MM-CCYY)</mat-label>
        <input matInput formControlName="financialPeriod" placeholder="e.g. 03-2024" />
        <mat-error *ngIf="form.get('financialPeriod')?.hasError('pattern')">
          Format must be MM-CCYY
        </mat-error>
      </mat-form-field>
    </form>
  </mat-card>

  <!-- Correspondence Section -->
  <mat-card class="section-card">
    <div class="section-header">Correspondence</div>
    <form [formGroup]="form" class="form-content">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Correspondence Type</mat-label>
        <mat-select formControlName="correspondenceType">
          <mat-option value="Received">Received</mat-option>
          <mat-option value="Sent">Sent</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Date of Correspondence (CCYYMMDD)</mat-label>
        <input matInput formControlName="dateOfCorrespondence" placeholder="e.g. 20240829" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Date Received/Sent (CCYYMMDD)</mat-label>
        <input matInput formControlName="dateReceivedSent" placeholder="e.g. 20240830" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Subject</mat-label>
        <input matInput formControlName="subject" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Receiver/Sender</mat-label>
        <input matInput formControlName="sender" />
      </mat-form-field>
    </form>
  </mat-card>

  <!-- Audit Section -->
  <mat-card class="section-card">
    <div class="section-header">Audit</div>
    <form [formGroup]="form" class="form-content">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Audit Period (CCYY-CCYY)</mat-label>
        <input matInput formControlName="auditPeriod" placeholder="e.g. 2023-2024" />
        <mat-error *ngIf="form.get('auditPeriod')?.hasError('pattern')">
          Format must be CCYY-CCYY
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Audit Type</mat-label>
        <mat-select formControlName="auditType">
          <mat-option value="Verification">Verification</mat-option>
          <mat-option value="Limited Scope Audit">Limited Scope Audit</mat-option>
          <mat-option value="Intensive Audit">Intensive Audit</mat-option>
          <mat-option value="Desk Audit">Desk Audit</mat-option>
        </mat-select>
      </mat-form-field>
    </form>
  </mat-card>

  <!-- Collections Section -->
  <mat-card class="section-card">
    <div class="section-header">Collections</div>
    <form [formGroup]="form" class="form-content">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Name of Collector</mat-label>
        <input matInput formControlName="collectorName" />
      </mat-form-field>
    </form>
  </mat-card>

  <!-- Action Buttons -->
  <div class="form-actions">
    <button mat-button color="warn" type="button" (click)="onCancel()">Cancel</button>
    <button mat-raised-button color="primary" type="submit" (click)="onSubmit()">Save Changes</button>
  </div>
</div>

  `,
  styleUrls: ['../update-tin-etin-tab/update-tin-etin-tab.component.scss']
})
export class UpdateDocumentDataTabComponent implements OnInit, OnDestroy {
  selectedNode: any;
  form!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private infoDrawerService: CustomInfoDrawerService,
    private nodeApi: NodesApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fileType: [''],
      documentType: [''],
      financialPeriod: [''],
      correspondenceType: [''],
      dateOfCorrespondence: [''],
      dateReceivedSent: [''],
      subject: [''],
      sender: [''],
      auditType: [''],
      auditPeriod: [''],
      collectorName: ['']
    });

    // subscribe to drawer state
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
    if (!nodeId) {
      this.showError('No node ID found');
      return;
    }

    this.nodeApi.getNode(nodeId).subscribe({
      next: (node: any) => {
        const props = node?.properties || {};
        this.form.patchValue({
          fileType: props['lracore:fileType'] || '',
          documentType: props['lracore:documentType'] || '',
          financialPeriod: props['lracore:financialPeriod'] || '',
          correspondenceType: props['lracore:correspondenceType'] || '',
          dateOfCorrespondence: props['lracore:dateOfCorrespondence'] || '',
          dateReceivedSent: props['lracore:dateReceivedSent'] || '',
          subject: props['lracore:subject'] || '',
          sender: props['lracore:sender'] || '',
          auditType: props['lracore:auditType'] || '',
          auditPeriod: props['lracore:auditPeriod'] || '',
          collectorName: props['lracore:collectorName'] || ''
        });
      },
      error: () => this.showError('Could not load document metadata')
    });
  }

  private updateMetadata(): void {
    const nodeId = this.selectedNode?.entry?.id || this.selectedNode?.id;
    if (!nodeId) {
      this.showError('No document selected');
      return;
    }

    const f = this.form.value;
    const updatedProps = {
      'lracore:financialPeriod': f.financialPeriod || null,
      'lracore:correspondenceType': f.correspondenceType || null,
      'lracore:dateOfCorrespondence': convertCCYYMMDDToISO(f.dateOfCorrespondence) || null,
      'lracore:dateReceivedSent': convertCCYYMMDDToISO(f.dateReceivedSent) || null,
      'lracore:subject': f.subject || null,
      'lracore:sender': f.sender || null,
      'lracore:auditType': f.auditType || null,
      'lracore:auditPeriod': f.auditPeriod || null,
      'lracore:collectorName': f.collectorName || null
    };

    this.nodeApi.updateNode(nodeId, { properties: updatedProps }).subscribe({
      next: () => this.showSuccess('Document data updated successfully ✅'),
      error: (err) => {
        console.error('Error updating document:', err);
        this.showError('Error saving changes ❌');
      }
      
    });
     this.form.reset();
  }

  onSubmit(): void {
    if (!this.validateFinancialPeriod()) return;
    if (!this.validateCorrespondence()) return;
    if (!this.validateAuditSupporting()) return;
    if (!this.validateCollection()) return;

    this.updateMetadata();
    this.infoDrawerService.closeDrawer();
  }

  onCancel(): void {
    this.form.reset();
    this.infoDrawerService.closeDrawer();
  }

  // 🔹 VALIDATIONS
  private validateFinancialPeriod(): boolean {
    const ft = this.form.value.fileType;
    const finPeriod = this.form.value.financialPeriod;

    if (['Audit', 'Collection', 'Registration'].includes(ft)) {
      if (finPeriod) {
        this.showError("Financial Period may not be specified for 'Audit', 'Collection' or 'Registration' File Types.");
        return false;
      }
      return true;
    }
    if (!finPeriod) {
      this.showError("Financial Period is required for this File Type.");
      return false;
    }
    const regex = /^(0[1-9]|1[0-2])-\d{4}$/;
    if (!regex.test(finPeriod)) {
      this.showError("Financial Period format must be MM-CCYY (e.g., 03-2024).");
      return false;
    }
    return true;
  }

  private validateCorrespondence(): boolean {
    const dt = this.form.value.documentType;
    const { correspondenceType, sender, subject, dateOfCorrespondence, dateReceivedSent } = this.form.value;

    if (dt === 'Correspondence') {
      if (!correspondenceType || !sender) {
        this.showError("'Correspondence Type' and 'Receiver/Sender' must be specified for Correspondence.");
        return false;
      }
      if ((dateOfCorrespondence && !isValidCCYYMMDD(dateOfCorrespondence)) ||
          (dateReceivedSent && !isValidCCYYMMDD(dateReceivedSent))) {
        this.showError("'Date of Correspondence' and 'Date Received/Sent' must be valid (format CCYYMMDD).");
        return false;
      }
    } else if (correspondenceType || sender || subject || dateOfCorrespondence || dateReceivedSent) {
      this.showError("Correspondence fields may not be specified for non-'Correspondence' documents.");
      return false;
    }
    return true;
  }

  private validateAuditSupporting(): boolean {
    const dt = this.form.value.documentType;
    const { auditType, auditPeriod } = this.form.value;

    if (dt === 'Audit Supporting Documents') {
      if (auditPeriod) {
        const regex = /^\d{4}-\d{4}$/;
        if (!regex.test(auditPeriod)) {
          this.showError("Audit Period must be in CCYY-CCYY format (e.g., 2022-2023).");
          return false;
        }
        const [startYear, endYear] = auditPeriod.split('-').map(Number);
        if (endYear - startYear !== 1) {
          this.showError("Audit Period years must be consecutive (e.g., 2022-2023).");
          return false;
        }
      }
    } else if (auditType || auditPeriod) {
      this.showError("Audit fields may not be specified for non-'Audit' documents.");
      return false;
    }
    return true;
  }

  private validateCollection(): boolean {
    const dt = this.form.value.documentType;
    const { collectorName } = this.form.value;

    if (dt === 'Collection Information Statement') return true;
    if (collectorName) {
      this.showError("'Name of Collector' may not be specified for non-'Collection' documents.");
      return false;
    }
    return true;
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
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

// 🔹 Helpers
function isValidCCYYMMDD(value: string): boolean {
  if (!/^\d{8}$/.test(value)) return false;
  const year = +value.slice(0, 4);
  const month = +value.slice(4, 6);
  const day = +value.slice(6, 8);
  const date = new Date(`${year}-${month}-${day}`);
  return !isNaN(date.getTime());
}

function convertCCYYMMDDToISO(dateStr: string): string | null {
  if (!/^\d{8}$/.test(dateStr)) return null;
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  return isNaN(date.getTime()) ? null : date.toISOString();
}
