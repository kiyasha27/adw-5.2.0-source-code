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


//import { nodeHasProperty } from '../../core/rules/node.evaluator';
//import { NodeEntry, NodePaging, Node } from '@alfresco/js-api';



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
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      taxpayerType: ['', Validators.required],
      fileType: ['', Validators.required],
      documentType: ['', Validators.required],
      financialYear: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]],
      dateSubmitted: [null, Validators.required]
    });
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
        this.snackBar.open('Failed to update taxpayer data ❌', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  saveChanges() {
     if (this.form.get('financialYear')?.invalid) {
    this.snackBar.open('Financial year is incorrect. Expected format is CCYY-YY', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
    return;
  }


    this.updateMetadata();
  }

  cancel() {
    this.router.navigate(['/personal-files']);
  }
}


