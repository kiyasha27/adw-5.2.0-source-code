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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'lib-update-main-taxpayer-data-action',
  templateUrl: './update-main-taxpayer-data-action.component.html',
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
  styleUrls: ['./update-main-taxpayer-data-action.component.css'],
  standalone: true
})
export class MainTaxpayerDataComponent {
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
      taxpayerType: [''],
      fileType: [''],
      documentType: ['', Validators.required],
      financialYear: ['']
    });
  }

  /**
   * Validation: File Type vs Document Type
   */
  private validateFileVsDocument(): boolean {
    const fileType = this.form.value.fileType;
    const documentType = this.form.value.documentType;

    if (fileType === 'Audit' && documentType !== 'Audit Supporting Documents') {
      this.showError("'File Type' and 'Document Type' do not match (Audit requires Audit Supporting Documents)");
      return false;
    }
    if (fileType === 'Collection' && documentType !== 'Collection Information Statement') {
      this.showError("'File Type' and 'Document Type' do not match (Collection requires Collection Information Statement)");
      return false;
    }
    if (fileType === 'Registration' && documentType !== 'Taxpayer Registration Form') {
      this.showError("'File Type' and 'Document Type' do not match (Registration requires Taxpayer Registration Form)");
      return false;
    }

    // allowed "general" types
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

  /**
   * Validation: Financial Year
   */
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

  updateMetadata() {
    const nodeId = '283f72c5-3f76-408e-bf72-c53f76a08e6e';
    const updatedProps = {
      'lracore:taxpayerType': this.form.value.taxpayerType,
      'lracore:fileType': this.form.value.fileType,
      'lracore:documentType': this.form.value.documentType,
      'lracore:financialYear': this.form.value.financialYear,
    };

    this.nodeApi.updateNode(nodeId, { properties: updatedProps }).subscribe({
      next: (response: any) => {
        console.log('Node updated successfully:', response);
        this.snackBar.open('Main taxpayer data updated ✅', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['save-snackbar']
        });
      },
      error: (err) => {
        console.error('Error updating node:', err);
        this.showError('Failed to update taxpayer data ❌');
      }
    });
  }

  saveChanges() {
    if (!this.validateFileVsDocument()) return;
    if (!this.validateFinancialYear()) return;

    this.updateMetadata();
     this.location.back();

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
