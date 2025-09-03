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
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';



//import { nodeHasProperty } from '../../core/rules/node.evaluator';
//import { NodeEntry, NodePaging, Node } from '@alfresco/js-api';



@Component({
  selector: 'lib-update-taxnumber-action',
  templateUrl: './update-taxnumber-action.component.html',
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

  styleUrls: ['./update-taxnumber-action.component.css'],
  standalone: true
})
export class TaxNumberComponent {
  form!: FormGroup;
  nodeId!: string;


  constructor(
    private fb: FormBuilder,
    private nodeApi: NodesApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private location: Location, private route: ActivatedRoute
  ) {}

    ngOnInit() {
  this.form = this.fb.group({
    tin: ['', [Validators.pattern(/^\d{7}-\d{1}$/)]],
    etin: ['', [Validators.pattern(/^2\d{8}-\d{1}$/)]],
    taxpayerType: ['']
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  this.nodeId = this.route.snapshot.paramMap.get('nodeId')!;
  
}

  updateMetadata() {
    const nodeId = '905d2fc6-66ff-42de-9d2f-c666ff52de06';

    const updatedProps = {
      'lracore:TINNumber': this.form.value.tin || null,
      'lracore:etinNumber': this.form.value.etin,
      'lracore:taxpayerType': this.form.value.taxpayerType || null
    };

    this.nodeApi.updateNode(nodeId, { properties: updatedProps }).subscribe({
      next: (response: any) => {
        console.log('Node updated successfully:', response);
      },
      error: (err) => {
        console.error('Error updating node:', err);
      }
    });
  }



saveChanges() {
  const tin = this.form.get('tin')?.value?.trim();
  const etin = this.form.get('etin')?.value?.trim();

  // 1. Both empty?
  if ((!tin || tin === '') && (!etin || etin === '')) {
    this.snackBar.open('TIN/ETIN must be specified', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
    return;
  }

  // 2. Invalid TIN?
  if (tin && this.form.get('tin')?.invalid) {
    this.snackBar.open('TIN must be of format 9999999-9', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
    return;
  }

  // 3. Invalid ETIN?
  if (etin && this.form.get('etin')?.invalid) {
    this.snackBar.open('ETIN must be of format 299999999-9', 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
    return;
  }

  // 4. Proceed to update
  this.updateMetadata();

  this.snackBar.open('Taxnumber changes saved successfully ✅', 'Close', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['save-snackbar']
  });

    this.location.back();
}


  cancel() {
    this.router.navigate(['/personal-files']);
  }
}