import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
//import { NodesApiService } from '@alfresco/adf-content-services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';



@Component({
  selector: 'lib-place-in-file-action',
  templateUrl: './place-in-file-action.component.html',
  styleUrls: ['./place-in-file-action.component.css'],
  standalone: true,
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
  ]
})
export class PlaceInFileComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      barcode: ['', Validators.required]
    });
  }

    saveChanges() {
    if (this.form.invalid) {
      this.snackBar.open('Please fill in all required fields correctly ❗', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    const { barcode } = this.form.value;
    console.log('Barcode value:', barcode);
    
      this.snackBar.open('Barcode parameters saved ✅', 'Close', {
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