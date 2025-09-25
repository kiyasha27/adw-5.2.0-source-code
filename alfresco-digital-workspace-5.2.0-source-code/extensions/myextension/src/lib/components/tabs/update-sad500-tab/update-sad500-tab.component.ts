import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NodesApiService } from '@alfresco/adf-content-services';
import { CustomInfoDrawerService } from '../../../services/custom-info-drawer.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'lib-app-update-sad500-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCardModule
  ],

  template: `
   <div class="custom-tab-content scroll-container">
  <h3>Update SAD500 Data</h3>

  <!-- General Section -->
  <mat-card class="section-card">
    <div class="section-header">General</div>

    <form [formGroup]="form" class="form-content">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>SAD500 Type</mat-label>
        <mat-select formControlName="sad500Type">
          <mat-option value="Vehicle">Vehicle</mat-option>
          <mat-option value="Other Goods and Services">Other Goods and Services</mat-option>
        </mat-select>
        <mat-error *ngIf="form.get('sad500Type')?.hasError('required')">
          SAD500 Type is required
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Date Submitted</mat-label>
        <input
          matInput
          [matDatepicker]="picker"
          placeholder="DD/MM/YYYY"
          formControlName="dateSubmitted"
        />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
        <mat-error *ngIf="form.get('dateSubmitted')?.hasError('required')">
          Date Submitted is required
        </mat-error>
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
  styleUrls: ['../update-tin-etin-tab/update-tin-etin-tab.component.scss']
})
export class UpdateSad500TabComponent implements OnInit, OnDestroy {
  selectedNode: any;
  form!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private infoDrawerService: CustomInfoDrawerService,
    private nodeApi: NodesApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      sad500Type: [''],
      dateSubmitted: ['']
    });

    // ✅ Subscribe like in TIN/ETIN
    this.infoDrawerService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state.selectedNode) {
          this.selectedNode = state.selectedNode;
          this.loadNodeData();
        }
      });

    // ✅ Check current state immediately
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

 /*  private futureDateValidator(control: any) {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today ? { futureDate: true } : null;
  } */

  private loadNodeData(): void {
    const nodeId = this.selectedNode?.entry?.id || this.selectedNode?.id;
    if (!nodeId) {
      this.showError('No node ID found');
      return;
    }

    this.nodeApi.getNode(nodeId).subscribe({
      next: (node: any) => {
        const props = node?.properties || {};
        this.form.patchValue({
          sad500Type: props['lracore:sad500Type'] || '',
          dateSubmitted: props['lracore:dateSubmitted'] ? new Date(props['lracore:dateSubmitted']) : null
        });
      },
      error: () => this.showError('Could not load document metadata')
    });
  }

  private updateMetadata(): void {
    const nodeId = this.selectedNode?.entry?.id || this.selectedNode?.id;
    if (!nodeId) {
      this.showError('No document selected');
      return;
    }

    const rawDate = this.form.value.dateSubmitted;
    const normalizedDate = rawDate
      ? new Date(Date.UTC(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate()))
      : null;

    const updatedProps = {
      'lracore:sad500Type': this.form.value.sad500Type || null,
      'lracore:dateSubmitted': normalizedDate?.toISOString() || null
    };


    this.nodeApi.updateNode(nodeId, { properties: updatedProps }).subscribe({
      next: () => this.showSuccess('SAD500 updated successfully ✅'),
      error: (err) => {
      console.error('Error updating SAD500:', err);
     
      
    }
    });
    this.form.reset();
  }

  onSubmit(): void {
    this.updateMetadata();
  }

  onCancel(): void {
    this.form.reset();
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
