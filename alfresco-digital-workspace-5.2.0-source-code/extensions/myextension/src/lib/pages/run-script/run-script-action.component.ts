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
  selector: 'lib-run-script',
  templateUrl: './run-script-action.component.html',
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
  styleUrls: ['./run-script-action.component.css'],
  standalone: true
})

export class RunScriptComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      scriptPath: ['', Validators.required],
      commitLimit: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
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

    const { scriptPath, commitLimit } = this.form.value;
    console.log('Script Path:', scriptPath);
    console.log('Commit Limit:', commitLimit);
this.snackBar.open('Script parameters saved ✅', 'Close', {
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
