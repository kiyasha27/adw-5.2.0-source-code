import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NodesApiService } from '@alfresco/adf-content-services';
import { CustomInfoDrawerService } from '../../../services/custom-info-drawer.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { SearchService } from '@alfresco/adf-content-services';
import { ResultSetPaging, ResultSetRowEntry } from '@alfresco/js-api';

@Component({
  selector: 'lib-app-update-tin-etin-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    TranslateModule,
        MatCardModule,
        
        
  ],
  template: `
<div class="custom-tab-content scroll-container">
  <h3>Update TIN/ETIN</h3>

  <!-- General Section -->
  <mat-card class="section-card">
    <div class="section-header">General</div>

    <form [formGroup]="form" class="form-content">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>TIN</mat-label>
        <input matInput formControlName="tin" placeholder="Format: 9999999-9" />
        <mat-error *ngIf="form.get('tin')?.hasError('pattern')">
          TIN must be in the format 9999999-9
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>ETIN</mat-label>
        <input matInput formControlName="etin" placeholder="Format: 299999999-9" />
        <mat-error *ngIf="form.get('etin')?.hasError('pattern')">
          ETIN must be in the format 299999999-9
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Taxpayer Type</mat-label>
        <mat-select formControlName="taxpayerType">
          <mat-option value="Company">Company</mat-option>
          <mat-option value="Individual">Individual</mat-option>
          <mat-option value="Employee">Employee</mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Action Buttons -->
      <div class="form-actions">
        <button mat-button color="warn" type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" (click)="onSubmit()">Save Changes</button>
      </div>
    </form>
  </mat-card>
</div>

  `,
  styleUrls: ['./update-tin-etin-tab.component.scss']
})
export class UpdateTinEtinTabComponent implements OnInit, OnDestroy {
  selectedNode: any;
  form!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private infoDrawerService: CustomInfoDrawerService,
    private nodeApi: NodesApiService,
    private snackBar: MatSnackBar,
     private searchService: SearchService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tin: ['', [Validators.pattern(/^\d{7}-\d{1}$/)]],
      
      etin: ['', [Validators.pattern(/^\d{9}-\d{1}$/)]],
      taxpayerType: ['']
    });

    // Subscribe to the info drawer service to get the selected node
    this.infoDrawerService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        console.log('Info drawer state changed:', state);
        if (state.selectedNode) {
          this.selectedNode = state.selectedNode;
          this.loadNodeData();
        }
      });

    // Also check current state immediately
    const currentState = this.infoDrawerService.currentState;
    if (currentState.selectedNode) {
      this.selectedNode = currentState.selectedNode;
      this.loadNodeData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadNodeData(): void {
    const nodeId = this.selectedNode?.entry?.id || this.selectedNode?.id;
    console.log('Loading node data for ID:', nodeId);
    
    if (!nodeId) {
      console.error('No node ID found in selectedNode:', this.selectedNode);
      this.showError('Could not find document ID');
      return;
    }
    
    this.nodeApi.getNode(nodeId).subscribe({
      next: (node: any) => {
        console.log('Node data loaded:', node);
        const props = node?.properties || {};
        this.form.patchValue({
          tin: props['lracore:TINNumber'] || '',
          etin: props['lracore:etinNumber'] || '',
          taxpayerType: props['lracore:taxpayerType'] || ''
        });
      },
      error: (err) => {
        console.error('Error loading node metadata:', err);
        this.showError('Could not load document metadata');
      }
    });
  }


  private updateMetadata(): void {
    // Get the currently selected node from the info drawer service or try to get it from ADF context
    const currentState = this.infoDrawerService.currentState;
    const nodeId = this.selectedNode?.entry?.id || this.selectedNode?.id || currentState.selectedNode?.entry?.id || currentState.selectedNode?.id;

    if (!nodeId) {
      this.showError('No document selected for update');
      return;
    }

    const updatedProps = {
      'lracore:TINNumber': this.form.value.tin || null,
      'lracore:etinNumber': this.form.value.etin || null,
      'lracore:taxpayerType': this.form.value.taxpayerType || null
    };

    console.log('Updating node:', nodeId, 'with properties:', updatedProps);

    this.nodeApi.updateNode(nodeId, { properties: updatedProps }).subscribe({
      next: (response: any) => {
        console.log('Node updated successfully:', response);
        this.showSuccess('TIN/ETIN updated successfully ✅');
      },
      error: (err) => {
        console.error('Error updating node:', err);
        console.error('Error details:', err.error || err.message || err);
        this.showError(`Error updating TIN/ETIN: ${err.error?.message || err.message || 'Unknown error'}`);
      }
    });
    this.form.reset();
  }

  onSubmit(): void {
    const tin = this.form.get('tin')?.value?.trim();
    const etin = this.form.get('etin')?.value?.trim();

    // Validation: Both empty?
    if ((!tin || tin === '') && (!etin || etin === '')) {
      this.showError('TIN/ETIN must be specified');
      return;
    }

    // Invalid TIN?
    if (tin && this.form.get('tin')?.invalid) {
      this.showError('TIN must be of format 9999999-9');
      return;
    }

    // Invalid ETIN?
    if (etin && this.form.get('etin')?.invalid) {
      this.showError('ETIN must be of format 299999999-9');
      return;
    }

    // Update the selected document directly
    //this.searchFolder();
    this.updateMetadata();
    
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
      this.updateMetadata();

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


  onCancel(): void {
    // Reset form
    this.form.reset();
    
    // Close the drawer
    this.infoDrawerService.closeDrawer();
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
