import { Component } from '@angular/core';
//import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';


//import { nodeHasProperty } from '../../core/rules/node.evaluator';
//import { NodeEntry, NodePaging, Node } from '@alfresco/js-api';



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
  selectedCategory: any;
  submittedDate: any;
  form!: FormGroup;

constructor(private fb: FormBuilder, private nodeApi: NodesApiService, private snackBar: MatSnackBar, private router: Router) {}

    ngOnInit() {
    this.form = this.fb.group({
      financialPeriod: [
        '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])-\d{4}$/)]],
      correspondenceType: ['', Validators.required],
      dateOfCorrespondence: [
         '',
         [Validators.required, Validators.pattern(/^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/), validCCYYMMDD] ],
      
      dateReceivedSent: [
        '',
        [Validators.required, Validators.pattern(/^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/), validCCYYMMDD]], 
      subject: ['', Validators.required],
      sender: ['', Validators.required],

      auditType: ['', Validators.required],
     
      collectorName: ['', Validators.required],
            auditPeriod: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(19|20)\d{2}-(19|20)\d{2}$/),
          
        ]
      ],
    });
  }

  saveChanges() {
    if (this.form.valid) {
      this.updateMetadata();
      return;
    }
    else{
      if (this.form.get('financialPeriod')?.invalid) {
          this.snackBar.open('Financial period must be in MM-CCYY format', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'top'
    });
    return;
  }
  else  if (this.form.get('auditPeriod')?.invalid) {
          this.snackBar.open('Audit period must be in CCYYMMDD format', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'top'
    });
    return;
  }
    }

    this.form.markAllAsTouched(); // Show validation errors

    // const errorFields = ['financialPeriod', 'dateReceivedSent', 'dateOfCorrespondence', 'auditPeriod'] as const;

    // const errorMap: Record<typeof errorFields[number], string> = {
    //   financialPeriod: 'Financial period must be in MM-CCYY format',
    //   dateReceivedSent: 'Date received/sent must be in CCYYMMDD format',
    //   dateOfCorrespondence: 'Correspondence date must be in CCYYMMDD format',
    //   auditPeriod: 'Audit period must be in CCYY-CCYY format and end year must not be earlier than start year'
    // };

      // for (const field of errorFields) {
      //   if (this.form.get(field)?.invalid) {
      //     this.snackBar.open(errorMap[field], 'Close', {
      //       duration: 3000,
      //       panelClass: ['error-snackbar'],
      //       horizontalPosition: 'right',
      //       verticalPosition: 'top'
      //     });
      //     return;
      //   }
      // }

    this.snackBar.open('Please fill out all required fields ⚠️', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  updateMetadata() {
    //const f = this.form.value;
    const nodeId = '273dc576-a2a4-46b5-bdc5-76a2a4f6b58a';

    const updatedProps = {
      'lracore:financialPeriod': this.form.value.financialPeriod || null ,
      'lracore:correspondenceType': this.form.value.correspondenceType || null,
      'lracore:dateOfCorrespondence': convertCCYYMMDDToISO(this.form.value.dateOfCorrespondence) || null,
      'lracore:dateReceivedSent': convertCCYYMMDDToISO(this.form.value.dateReceivedSent) || null,
       'lracore:subject': this.form.value.subject,
       'lracore:sender': this.form.value.sender,
       'lracore:auditPeriod': this.form.value.auditPeriod || null,
       'lracore:auditType': this.form.value.auditType,
       'lracore:collectorName': this.form.value.collectorName || null
    };

    this.nodeApi.updateNode(nodeId, { properties: updatedProps }).subscribe({
      next: (response: any) => {
        console.log('Node updated successfully:', response);
        this.snackBar.open('Changes saved successfully ✅', 'Close', {
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

// // ✅ Custom validator for auditPeriod range
// function auditPeriodRangeValidator(control: AbstractControl): ValidationErrors | null {
//   const value = control.value;
//   const match = /^(19|20)\d{2}-(19|20)\d{2}$/.exec(value);
//   if (!match) return null;

//   const [startYear, endYear] = value.split('-').map(Number);
//   return endYear >= startYear ? null : { invalidRange: true };
// }


export function validCCYYMMDD(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!/^\d{8}$/.test(value)) return { pattern: true };

  const year = +value.slice(0, 4);
  const month = +value.slice(4, 6);
  const day = +value.slice(6, 8);
  const date = new Date(`${year}-${month}-${day}`);
  return isNaN(date.getTime()) ? { invalidDate: true } : null;
}

function convertCCYYMMDDToISO(dateStr: string): string | null {
  if (!/^\d{8}$/.test(dateStr)) return null;
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  return isNaN(date.getTime()) ? null : date.toISOString();
}