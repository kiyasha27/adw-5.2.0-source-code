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
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'lib-update-taxpayer-data-action',
  templateUrl: './update-taxpayer-data-action.component.html',
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
  styleUrls: ['./update-taxpayer-data-action.component.css'],
  standalone: true
})
export class TaxpayerDataComponent {
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
      TINNumber: ['', [Validators.pattern(/^\d{5,7}-\d{1}$/)]],
      etinNumber: ['', [Validators.pattern(/^\d{5,9}-\d{1}$/)]],
      taxpayerType: [''],
      fileType: [''],
      documentType: [''],
      financialYear: [''],
      financialPeriod: [''],
      legalName: [''],
      tradingName: [''],
      employeeName: [''],
      correspondenceType: [''],
      sender: [''],
      subject: [''],
      dateOfCorrespondence: [''],
      dateReceivedSent: [''],
      auditType: [''],
      auditPeriod: [''],
      collectorName: [''],
      exciseCommodity: ['']
    });

    const nodeId = '82bff9bc-9919-43c4-bff9-bc9919e3c478';
    this.nodeApi.getNode(nodeId).subscribe({
      next: (node: any) => {
        console.log('Full node response:', node);
        const props = node?.properties || {};
        console.log('Extracted properties:', props);
        console.log('DocumentType from backend:', props['lracore:documentType']);
        console.log('FileType from backend:', props['lracore:fileType']);

        this.form.patchValue({
          fileType: props['lracore:fileType'] || '',
          documentType: props['lracore:documentType']
        });

        console.log('✅ Form values after patch:', this.form.value);
      },
      error: (err) => {
        console.error('Error loading node metadata:', err);
        this.showError('Could not load document metadata');
      }
    });
  }

  saveChanges() {
    if (!this.validateTINETIN()) return;
    if (!this.validateFinancialYear()) return;
    if (!this.validateFinancialPeriod()) return;
    if (!this.validateExciseCommodity()) return;
    if (!this.validateCorrespondence()) return;
    if (!this.validateAudit()) return;
    if (!this.validateCollection()) return;
    if (!this.validateBusinessRegistration()) return;
    if (!this.validateIndividualRegistration()) return;

    this.updateMetadata();
    this.location.back();
  }

/**
 * 🔹 Validates TIN and ETIN
 */
private validateTINETIN(): boolean {
  const { TINNumber, etinNumber } = this.form.value;

  // 1. At least one of TIN or ETIN must be specified
  if (!TINNumber && !etinNumber) {
    this.showError("At least one of TIN or ETIN must be specified");
    return false;
  }

  // 2. Invalid TIN format
  if (TINNumber && this.form.get('TINNumber')?.invalid) {
    this.snackBar.open('TIN must be of format 9999999-9', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
    return false;
  }

  // 3. Invalid ETIN format
  if (etinNumber && this.form.get('etinNumber')?.invalid) {
    this.snackBar.open('ETIN must be of format 299999999-9', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
    return false;
  }

  return true;
}


  private validateFinancialYear(): boolean {
    const fileType = this.form.value.fileType;
    const finYear = this.form.value.financialYear;

    // 1. Audit/Collection/Registration → financial year must NOT be specified
    if (['Audit', 'Collection', 'Registration'].includes(fileType)) {
      if (finYear && finYear.trim() !== '') {
        this.showError("Financial Year must NOT be specified for Audit, Collection or Registration");
        return false;
      }
      return true;
    }

    // 2. For other types → financial year is required
    if (!finYear || finYear.trim() === '') {
      this.showError("Financial Year is required");
      return false;
    }

    // 3. Validate format CCYY-YY
    const regex = /^\d{4}-\d{2}$/;
    if (!regex.test(finYear)) {
      this.showError("Financial Year format must be CCYY-YY (e.g., 2022-23)");
      return false;
    }

    // 4. Check consecutive years
    const startYear = parseInt(finYear.substring(0, 4), 10);
    const endYear = parseInt(finYear.substring(5), 10) + 2000; // add century
    if (endYear - startYear !== 1) {
      this.showError("Financial Year years must be consecutive (e.g., 2022-23)");
      return false;
    }

    return true;
  }

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

  // Check that month is between 1 and 12
  const month = parseInt(finPeriod.slice(0, 2), 10);
  if (month < 1 || month > 12) {
    this.showError("Financial Period month must be between 1 and 12");
    return false;
  }

  return true;
}


  private validateExciseCommodity(): boolean {
    const { documentType, exciseCommodity } = this.form.value;
    if (documentType === 'Excise Tax Return' && !exciseCommodity) {
      this.showError("Commodity must be specified for Excise Tax");
      return false;
    }
    return true;
  }

  private validateCorrespondence(): boolean {
    const { documentType, correspondenceType, sender, subject, dateOfCorrespondence, dateReceivedSent } = this.form.value;
    if (documentType === 'Correspondence') {
      if (!correspondenceType || !sender) {
        this.showError("Correspondence Type and Sender/Receiver must be specified for Correspondence");
        return false;
      }
      if ((dateOfCorrespondence && !isValidCCYYMMDD(dateOfCorrespondence)) ||
          (dateReceivedSent && !isValidCCYYMMDD(dateReceivedSent))) {
        this.showError("Date of Correspondence and Date Received/Sent must be valid (yyyyMMdd)");
        return false;
      }
    } else if (correspondenceType || sender || subject || dateOfCorrespondence || dateReceivedSent) {
      this.showError("Correspondence fields may not be specified for non-'Correspondence' documents");
      return false;
    }
    return true;
  }

  private validateAudit(): boolean {
    const { documentType, fileType, auditType, auditPeriod } = this.form.value;
    if (documentType === 'Audit Reports')  { //Audit Supporting Documents
      if (fileType !== 'Audit') {
        this.showError("Documents of type 'Audit' can only be associated with 'Audit' file type");
        return false;
      }
      if (auditPeriod) {
        const regex = /^\d{4}-\d{4}$/;
        if (!regex.test(auditPeriod)) {
          this.showError("Audit Period must be in CCYY-CCYY format");
          return false;
        }
        const [start, end] = auditPeriod.split('-').map(Number);
        if (end - start !== 1) {
          this.showError("Audit Period years must be consecutive");
          return false;
        }
      }
    } else if (auditType || auditPeriod) {
      this.showError("Audit fields may not be specified for non-'Audit' documents");
      return false;
    }
    return true;
  }

  private validateCollection(): boolean {
    const { documentType, fileType, collectorName } = this.form.value;
    if (documentType === 'Collection Information Statement') {
      if (fileType !== 'Collection') {
        this.showError("Documents of type 'Collections' can only be associated with 'Collection' file type");
        return false;
      }
    } else if (collectorName) {
      this.showError("'Name of Collector' may not be specified for non-'Collection' documents");
      return false;
    }
    return true;
  }

  private validateBusinessRegistration(): boolean {
    const { documentType, fileType, legalName, tradingName, employeeName, taxpayerType } = this.form.value;
    if (documentType === 'Business Taxpayer Registration Form') {
      if (fileType !== 'Registration') {
        this.showError("Documents of type 'Business Taxpayer Registration' can only be associated with 'Registration' file type");
        return false;
      }
      if (!legalName && !tradingName) {
        this.showError("One of 'Legal Name' or 'Trading Name' must be specified");
        return false;
      }
      if (employeeName) {
        this.showError("'Employee Name' may not be specified for Business Registrations");
        return false;
      }
      if (!taxpayerType) {
        this.showError("'Taxpayer Type' must be specified");
        return false;
      }
    }
    return true;
  }

  private validateIndividualRegistration(): boolean {
    const { documentType, fileType, legalName, tradingName, employeeName, taxpayerType } = this.form.value;
    if (documentType === 'Individual Taxpayer Registration Form') {
      if (fileType !== 'Registration') {
        this.showError("Documents of type 'Individual Taxpayer Registration' can only be associated with 'Registration' file type");
        return false;
      }
      if (!employeeName) {
        this.showError("'Employee Name' must be specified");
        return false;
      }
      if (legalName || tradingName) {
        this.showError("'Legal Name' or 'Trading Name' may not be specified for Individual Registrations");
        return false;
      }
      if (!taxpayerType) {
        this.showError("'Taxpayer Type' must be specified");
        return false;
      }
    }
    return true;
  }

  updateMetadata() {
    const nodeId = '82bff9bc-9919-43c4-bff9-bc9919e3c478';
    const f = this.form.value;

    const updatedProps = {
      'lracore:TINNumber': f.TINNumber || null,
      'lracore:etinNumber': f.etinNumber || null,
      'lracore:taxpayerType': f.taxpayerType || null,
      'lracore:fileType': f.fileType || null,
      'lracore:documentType': f.documentType || null,
      'lracore:financialYear': f.financialYear || null,
      'lracore:financialPeriod': f.financialPeriod || null,
      'lracore:legalName': f.legalName || null,
      'lracore:tradingName': f.tradingName || null,
      'lracore:taxpayerName': f.employeeName || null,
      'lracore:correspondenceType': f.correspondenceType || null,
      'lracore:sender': f.sender || null,
      'lracore:subject': f.subject || null,
      'lracore:dateOfCorrespondence': convertCCYYMMDDToISO(f.dateOfCorrespondence) || null,
      'lracore:dateReceivedSent': convertCCYYMMDDToISO(f.dateReceivedSent) || null,
      'lracore:auditType': f.auditType || null,
      'lracore:auditPeriod': f.auditPeriod || null,
      'lracore:collectorName': f.collectorName || null,
      'lracore:exciseCommodity': f.exciseCommodity || null
    };

    switch (f.documentType) {
      case 'Business Taxpayer Registration Form':
      case 'Individual Taxpayer Registration Form':
        // Save only the fields needed for TRF forms
        // Do NOT save documentType because it would break the model
        break;

      default:
        // For all other docTypes, save normally
        updatedProps['lracore:documentType'] = f?.documentType || null;
        break;
}


    this.nodeApi.updateNode(nodeId, { properties: updatedProps }).subscribe({
      next: (response: any) => {
        console.log('Node updated successfully:', response);
        this.snackBar.open('Taxpayer data updated successfully ✅', 'Close', {
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
