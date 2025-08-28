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

constructor(private fb: FormBuilder, private nodeApi: NodesApiService, private snackBar: MatSnackBar) {}

ngOnInit() {
  this.form = this.fb.group({
    sad500Type: ['', Validators.required],
    dateSubmitted: [null, Validators.required]
  });
}

  updateMetadata() {
    const nodeId = '4ce06f90-95be-46f3-a06f-9095be36f358';
    const updatedProps = {
      'lracore:sad500Type': this.selectedCategory,
      'lracore:dateSubmitted': this.submittedDate?.toISOString()
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

  this.selectedCategory = this.form.value.sad500Type;
  this.submittedDate = this.form.value.dateSubmitted;
  this.updateMetadata();

  this.snackBar.open('Changes saved successfully ✅', 'Close', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['save-snackbar']
    
  });

}

}