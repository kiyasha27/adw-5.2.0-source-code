import { Component } from '@angular/core';
//import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormsModule, ValidationErrors } from '@angular/forms';
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
import { Validators } from '@angular/forms';
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
        TINNumber: [
    '',
    [
       Validators.pattern(/^\d{5,7}-\d{1}$/)
    ]
  ],
  etinNumber: [
    '',
    [
      
      Validators.pattern(/^\d{5,9}-\d{1}$/)
    ]
  ],

      taxpayerType: ['', Validators.required],
      fileType: ['', Validators.required],
      documentType: ['', Validators.required],
      financialPeriod: [
        '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])-\d{4}$/)]
      ],
      financialYear: [
        '',
        [Validators.required, Validators.pattern(/^\d{4}\/\d{4}$/)]
      ],
      VIP: ['', Validators.required],
      legalName: ['', Validators.required],
      tradingName: ['', Validators.required],
      correspondenceType: ['', Validators.required],
      dateOfCorrespondence: [
        '',
        [Validators.required, Validators.pattern(/^\d{8}$/), validCCYYMMDD]
      ],
      dateReceivedSent: [
        '',
        [Validators.required, Validators.pattern(/^\d{8}$/), validCCYYMMDD]
      ],
      subject: ['', Validators.required],
      sender: ['', Validators.required],
      auditPeriod: [
        '',
        [Validators.required, Validators.pattern(/^(19|20)\d{2}-(19|20)\d{2}$/)]
      ],
      auditType: ['', Validators.required],
      collectorName: ['', Validators.required],
      exciseCommodity: ['', Validators.required],
      employeeName: ['', Validators.required]
    });
  }

  saveChanges() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      const errorFields = ['financialPeriod', 'financialYear', 'dateOfCorrespondence', 'dateReceivedSent', 'auditPeriod'] as const;

      const errorMap: Record<typeof errorFields[number], string> = {
        financialPeriod: 'Financial period must be in MM-CCYY format',
        financialYear: 'Financial year must be in CCYY/CCYY format',
        dateOfCorrespondence: 'Date of correspondence must be in CCYYMMDD format',
        dateReceivedSent: 'Date received/sent must be in CCYYMMDD format',
        auditPeriod: 'Audit period must be in CCYY-CCYY format'
      };

      for (const field of errorFields) {
        if (this.form.get(field)?.invalid) {
          this.snackBar.open(errorMap[field], 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          return;
        }
      }

      this.snackBar.open('Please fill out all required fields ⚠️', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      return;
    }

    this.updateMetadata();
     this.location.back();
  }

  updateMetadata() {
    const f = this.form.value;
    const nodeId = '82bff9bc-9919-43c4-bff9-bc9919e3c478'; 

    const updatedProps = {
      'lracore:TINNumber': f.TINNumber,
      'lracore:etinNumber': f.etinNumber,
      'lracore:taxpayerType': f.taxpayerType,
      'lracore:fileType': f.fileType,
      'lracore:documentType': f.documentType,
      'lracore:financialPeriod': f.financialPeriod,
      'lracore:financialYear': f.financialYear,
      'lracore:VIP': f.VIP,
      'lracore:legalName': f.legalName,
      'lracore:tradingName': f.tradingName,
      'lracore:correspondenceType': f.correspondenceType,
      'lracore:dateOfCorrespondence': convertCCYYMMDDToISO(f.dateOfCorrespondence),
      'lracore:dateReceivedSent': convertCCYYMMDDToISO(f.dateReceivedSent),
      'lracore:subject': f.subject,
      'lracore:sender': f.sender,
      'lracore:auditPeriod': f.auditPeriod,
      'lracore:auditType': f.auditType,
      'lracore:collectorName': f.collectorName,
      'lracore:exciseCommodity': f.exciseCommodity,
      'lracore:taxpayerName': f.employeeName
    };

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
        this.snackBar.open('Error saving changes ❌', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/personal-files']);
  }
}

// ✅ Validates CCYYMMDD format and ensures it's a real calendar date
export function validCCYYMMDD(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!/^\d{8}$/.test(value)) return { pattern: true };

  const year = +value.slice(0, 4);
  const month = +value.slice(4, 6);
  const day = +value.slice(6, 8);
  const date = new Date(`${year}-${month}-${day}`);
  return isNaN(date.getTime()) ? { invalidDate: true } : null;
}

// ✅ Converts CCYYMMDD string to ISO 8601 format for Alfresco d:date properties
function convertCCYYMMDDToISO(dateStr: string): string | null {
  if (!/^\d{8}$/.test(dateStr)) return null;
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  return isNaN(date.getTime()) ? null : date.toISOString();
}