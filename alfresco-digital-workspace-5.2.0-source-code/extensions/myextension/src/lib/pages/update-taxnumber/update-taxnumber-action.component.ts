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
import { NodesApiService, SearchService } from '@alfresco/adf-content-services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ResultSetPaging, ResultSetRowEntry } from '@alfresco/js-api';


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
    private location: Location, private route: ActivatedRoute,
    private searchService: SearchService,
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


searchFolder() {
  // Get the TIN and ETIN values entered in the form and trim whitespace
  const tin = this.form.get('tin')?.value?.trim();
  const etin = this.form.get('etin')?.value?.trim();

  // Validate: if both TIN and ETIN are empty, show an error and exit
  if ((!tin || tin === '') && (!etin || etin === '')) {
    this.snackBar.open('TIN/ETIN must be specified', 'Close', { 
      duration: 3000, 
      panelClass: ['error-snackbar'] 
    });
    return; // Stop execution if no input
  }

  // Build the search term using Alfresco's search syntax
  // Here, we are looking for nodes (folders) with the aspect 'lracore:TaxNumberAspect'
  // AND whose cm:name matches either the ETIN (preferred) or TIN entered
  const searchTerm = `ASPECT:"lracore:TaxNumberAspect" AND (cm:name:"${etin || tin}")`;

  // Call the Alfresco search service
  // Parameters: 
  // - searchTerm: our query string
  // - maxResults: 10 results max
  // - skipCount: 0 (start from first result)
  this.searchService.search(searchTerm, 10, 0).subscribe({
    next: (res: ResultSetPaging) => {

      // Extract the search results safely
      const entries: ResultSetRowEntry[] = res.list?.entries || [];

      // If no matching folder is found, show a message
      if (entries.length === 0) {
        this.snackBar.open('No folder found for the provided TIN/ETIN', 'Close', { duration: 3000 });
        return;
      }

      // If a folder is found, log it and notify the user
      const folder = entries[0].entry; // The first matching folder
      console.log('Found folder:', folder);
      this.snackBar.open(`Folder found: ${folder.name}`, 'Close', { duration: 3000 });

      // Here you could call updateMetadata(folder.id) to update its properties
      // or perform other actions on the found folder.
    },
    error: err => {
      // 8️⃣ Handle search errors
      console.error('Search error:', err);
      this.snackBar.open('Error performing search', 'Close', { duration: 3000 });
    }
  });
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
  this.searchFolder();
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