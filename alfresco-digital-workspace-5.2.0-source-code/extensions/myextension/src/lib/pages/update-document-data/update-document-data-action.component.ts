import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { NodesApiService } from '@alfresco/adf-content-services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'lib-update-document-data-action',
  templateUrl: './update-document-data-action.component.html',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./update-document-data-action.component.css'],
  standalone: true
})
export class DocumentDataComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private nodeApi: NodesApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
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

    const nodeId = '82bff9bc-9919-43c4-bff9-bc9919e3c478';
    this.nodeApi.getNode(nodeId).subscribe({
    next: (node: any) => {
    console.log('📥 Full node response:', node);

    const props = node?.properties || {};
    console.log('📑 Extracted properties:', props);
    console.log('👉 DocumentType from backend:', props['lracore:documentType']);
    console.log('👉 FileType from backend:', props['lracore:fileType']);

    // Patch form with backend documentType and fileType
    this.form.patchValue({
      fileType: props['lracore:fileType'] || '',
      documentType: props['lracore:documentType'] || ''
    });

    console.log('✅ Form values after patch:', this.form.value);
  },
  error: (err) => {
    console.error('❌ Error loading node metadata:', err);
    this.showError('Could not load document metadata ❌');
  }
});
    
  }

  /**
   * 🔹 Financial Period Validation
   */
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

  // For all other file types → financial period is required
  if (!finPeriod) {
    this.showError("Financial Period is required for this File Type.");
    return false;
  }

  // Check format MM-CCYY
  const regex = /^(0[1-9]|1[0-2])-\d{4}$/;
  if (!regex.test(finPeriod)) {
    this.showError("Financial Period format must be MM-CCYY (e.g., 03-2024).");
    return false;
  }

    return true;
  }

  /**
   * 🔹 Correspondence Validation
   */
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
        this.showError("'Date of Correspondence' and 'Date Received/Sent' must be valid (format yyyyMMdd).");
        return false;
      }
    } else {
      if (correspondenceType || sender || subject || dateOfCorrespondence || dateReceivedSent) {
        this.showError("Correspondence fields may not be specified for non-'Correspondence' documents.");
        return false;
      }
    }

    return true;
  }

  /**
   * 🔹 Audit Supporting Documents Validation
   */
private validateAuditSupporting(): boolean {
  const dt = this.form.value.documentType;
  const { auditType, auditPeriod } = this.form.value;

  if (dt === 'Audit Supporting Documents') {
    if (auditPeriod) {
      // Validate CCYY-CCYY format
      const regex = /^\d{4}-\d{4}$/;
      if (!regex.test(auditPeriod)) {
        this.showError("Audit Period must be in CCYY-CCYY format (e.g., 2022-2023).");
        return false;
      }
      // Validate consecutive years
      const [startYear, endYear] = auditPeriod.split('-').map(Number);
      if (endYear - startYear !== 1) {
        this.showError("Audit Period years must be consecutive (e.g., 2022-2023).");
        return false;
      }
    }
    return true;
  } else {
    if (auditType || auditPeriod) {
      this.showError("Audit fields may not be specified for non-'Audit' documents.");
      return false;
    }
  }
  return true;
}

/* original without auditPeriod validations
  private validateAuditSupporting(): boolean {
    const dt = this.form.value.documentType;
    const { auditType, auditPeriod } = this.form.value;

    if (dt === 'Audit Supporting Documents') {
      return true;
    } else {
      if (auditType || auditPeriod) {
        this.showError("Audit fields may not be specified for non-'Audit' documents.");
        return false;
      }
    }
    return true;
  } */

  /**
   * 🔹 Collection Validation
   */
  private validateCollection(): boolean {
    const dt = this.form.value.documentType;
    const { collectorName } = this.form.value;

    if (dt === 'Collection') {
      return true;
    } else {
      if (collectorName) {
        this.showError("'Name of Collector' may not be specified for non-'Collection' documents.");
        return false;
      }
    }
    return true;
  }

  saveChanges() {
    if (!this.validateFinancialPeriod()) return;
    if (!this.validateCorrespondence()) return;
    if (!this.validateAuditSupporting()) return;
    if (!this.validateCollection()) return;

    this.updateMetadata();
     this.location.back();
  }

  updateMetadata() {
    const nodeId = '82bff9bc-9919-43c4-bff9-bc9919e3c478';
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
      next: (response: any) => {
        console.log('Node updated successfully:', response);
        this.snackBar.open('Main taxpayer changes saved successfully ✅', 'Close', {
          duration: 3000,
          panelClass: ['save-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      },
      error: (err) => {
        console.error('Error updating node:', err);
        this.showError('Error saving changes ❌');
      }
    });
  }

  cancel() {
    this.router.navigate(['/personal-files']);
  }

  private showError(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 4000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}

/**
 * ✅ Date helper: CCYYMMDD validation
 */
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
