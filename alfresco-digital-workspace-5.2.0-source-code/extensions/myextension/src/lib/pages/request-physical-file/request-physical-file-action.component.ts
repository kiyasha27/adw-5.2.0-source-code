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
//import { NodesApiService } from '@alfresco/adf-content-services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

//import { nodeHasProperty } from '../../core/rules/node.evaluator';
//import { NodeEntry, NodePaging, Node } from '@alfresco/js-api';



@Component({
  selector: 'lib-request-physical-file-action',
  templateUrl: './request-physical-file-action.component.html',
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

  styleUrls: ['./request-physical-file-action.component.css'],
  standalone: true
})
export class RequestPhysicalFileComponent {
  requestReason: any;
  returnDate: any;
  form!: FormGroup;

constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) {}

ngOnInit() {
  this.form = this.fb.group({
    requestReason: ['', Validators.required],
    returnDate: [null, Validators.required]
  });
}


saveRequestPhysicalFileChanges() {
    if (this.form.invalid) {
      this.snackBar.open('Please fill in all required fields correctly ❗', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    const { requestReason, returnDate } = this.form.value;
    console.log('Request reason:', requestReason);
    console.log('Date submitted:', returnDate);
this.snackBar.open('Request physical file parameters saved ✅', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['save-snackbar']
    });
  }
  cancel() {
    this.router.navigate(['/personal-files']);
  }
}