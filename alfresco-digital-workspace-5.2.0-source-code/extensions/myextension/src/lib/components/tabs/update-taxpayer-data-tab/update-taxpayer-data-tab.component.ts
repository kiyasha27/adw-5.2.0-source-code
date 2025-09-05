import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NodesApiService } from '@alfresco/adf-content-services';
import { CustomInfoDrawerService } from '../../../services/custom-info-drawer.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lib-app-update-taxpayer-data-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  template:`

  <div class="custom-tab-content scroll-container">
      <h3>Update Taxpayer Data</h3>

      <!-- General Section -->
      <mat-card class="section-card">
        <div class="section-header">General</div>
        <form [formGroup]="form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>TIN</mat-label>
            <input matInput formControlName="TINNumber" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>ETIN</mat-label>
            <input matInput formControlName="etinNumber" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>File Type</mat-label>
            <mat-select formControlName="fileType">
              <mat-option value="Audit">Audit</mat-option>
              <mat-option value="Collection">Collection</mat-option>
              <mat-option value="Registration">Registration</mat-option>
              <mat-option value="VAT">VAT</mat-option>
              <mat-option value="PAYE">PAYE</mat-option>
              <mat-option value="WHT">WHT</mat-option>
              <mat-option value="CIT">CIT</mat-option>
              <mat-option value="IIT">IIT</mat-option>
              <mat-option value="FBT">FBT</mat-option>
              <mat-option value="Excise Tax">Excise Tax</mat-option>
              <mat-option value="Gaming Levy">Gaming Levy</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Document Type</mat-label>
            <mat-select formControlName="documentType">
              <mat-option value="Individual Taxpayer Registration Form">Individual Taxpayer Registration Form</mat-option>
              <mat-option value="Business Taxpayer Registration Form">Business Taxpayer Registration Form</mat-option>
              <mat-option value="Audit Reports">Audit Reports</mat-option>
              <mat-option value="Collection Information Statement">Collection Information Statement</mat-option>
              <mat-option value="Customs Client Registration Form">Customs Client Registration Form</mat-option>
              <mat-option value="Customs Client Supporting Documents">Customs Client Supporting Documents</mat-option>
              <mat-option value="Correspondence">Correspondence</mat-option>
              <mat-option value="Tax Return Forms">Tax Return Forms</mat-option>
              <mat-option value="Financial Statements">Financial Statements</mat-option>
              <mat-option value="Supporting Documents">Supporting Documents</mat-option>
              <mat-option value="Excise Tax Return">Excise Tax Return</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Financial Year (CCYY-YY)</mat-label>
            <input matInput formControlName="financialYear" placeholder="e.g. 2024-25" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Financial Period (MM-CCYY)</mat-label>
            <input matInput formControlName="financialPeriod" placeholder="e.g. 03-2024" />
          </mat-form-field>
        </form>
      </mat-card>

      <!-- Registration Section -->
      <mat-card class="section-card">
        <div class="section-header">Registration</div>
        <form [formGroup]="form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Taxpayer Type</mat-label>
            <mat-select formControlName="taxpayerType">
              <mat-option value="Company">Company</mat-option>
              <mat-option value="Individual">Individual</mat-option>
              <mat-option value="Employee">Employee</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Employee Name</mat-label>
            <input matInput formControlName="employeeName" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Legal Name</mat-label>
            <input matInput formControlName="legalName" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Trading Name</mat-label>
            <input matInput formControlName="tradingName" />
          </mat-form-field>
        </form>
      </mat-card>

      <!-- Correspondence Section -->
      <mat-card class="section-card">
        <div class="section-header">Correspondence</div>
        <form [formGroup]="form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Correspondence Type</mat-label>
            <mat-select formControlName="correspondenceType">
              <mat-option value="Received">Received</mat-option>
              <mat-option value="Sent">Sent</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Date of Correspondence (CCYYMMDD)</mat-label>
            <input matInput formControlName="dateOfCorrespondence" placeholder="e.g. 20240829" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Date Received/Sent (CCYYMMDD)</mat-label>
            <input matInput formControlName="dateReceivedSent" placeholder="e.g. 20240830" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Subject</mat-label>
            <input matInput formControlName="subject" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Receiver/Sender</mat-label>
            <input matInput formControlName="sender" />
          </mat-form-field>
        </form>
      </mat-card>

      <!-- Audit Section -->
      <mat-card class="section-card">
        <div class="section-header">Audit</div>
        <form [formGroup]="form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Audit Period (CCYY-CCYY)</mat-label>
            <input matInput formControlName="auditPeriod" placeholder="e.g. 2023-2024" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Audit Type</mat-label>
            <mat-select formControlName="auditType">
              <mat-option value="Verification">Verification</mat-option>
              <mat-option value="Limited Scope Audit">Limited Scope Audit</mat-option>
              <mat-option value="Intensive Audit">Intensive Audit</mat-option>
              <mat-option value="Desk Audit">Desk Audit</mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </mat-card>

      <!-- Collections Section -->
      <mat-card class="section-card">
        <div class="section-header">Collections</div>
        <form [formGroup]="form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Name of Collector</mat-label>
            <input matInput formControlName="collectorName" />
          </mat-form-field>
        </form>
      </mat-card>

      <!-- Commodity/Goods Section -->
      <mat-card class="section-card">
        <div class="section-header">Commodity / Goods</div>
        <form [formGroup]="form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Commodity Type</mat-label>
            <mat-select formControlName="exciseCommodity">
              <mat-option value="Beer">Beer</mat-option>
              <mat-option value="Tobacco">Tobacco</mat-option>
              <mat-option value="Electronics">Electronics</mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </mat-card>

      <!-- Action Buttons -->
      <div class="form-actions">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSubmit()">
          Save Changes
        </button>
      </div>


  `,
  styleUrls: ['../update-tin-etin-tab/update-tin-etin-tab.component.scss']
})
export class UpdateTaxpayerDataTabComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  selectedNode: any;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private infoDrawerService: CustomInfoDrawerService,
    private nodeApi: NodesApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      TINNumber: ['', [Validators.pattern(/^\d{5,7}-\d{1}$/)]],
      etinNumber: ['', [Validators.pattern(/^\d{5,9}-\d{1}$/)]],
      taxpayerType: [''],
      fileType: [''],
      documentType: [''],
      financialYear: [''],
      financialPeriod: [''],
      legalName: [''],
      tradingName: [''],
      employeeName: [''],
      correspondenceType: [''],
      sender: [''],
      subject: [''],
      dateOfCorrespondence: [''],
      dateReceivedSent: [''],
      auditType: [''],
      auditPeriod: [''],
      collectorName: [''],
      exciseCommodity: ['']
    });

    // 🔹 Subscribe to drawer state
    this.infoDrawerService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state.selectedNode) {
          this.selectedNode = state.selectedNode;
          this.loadNodeData();
        }
      });

    // 🔹 Load immediately if a node is already selected
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
    if (!nodeId) return;

    this.nodeApi.getNode(nodeId).subscribe({
      next: (node: any) => {
        const props = node?.properties || {};
        this.form.patchValue({
          TINNumber: props['lracore:TINNumber'] || '',
          etinNumber: props['lracore:etinNumber'] || '',
          taxpayerType: props['lracore:taxpayerType'] || '',
          fileType: props['lracore:fileType'] || '',
          documentType: props['lracore:documentType'] || '',
          financialYear: props['lracore:financialYear'] || '',
          financialPeriod: props['lracore:financialPeriod'] || '',
          legalName: props['lracore:legalName'] || '',
          tradingName: props['lracore:tradingName'] || '',
          employeeName: props['lracore:taxpayerName'] || '',
          correspondenceType: props['lracore:correspondenceType'] || '',
          sender: props['lracore:sender'] || '',
          subject: props['lracore:subject'] || '',
          dateOfCorrespondence: props['lracore:dateOfCorrespondence'] ? this.convertISOToCCYYMMDD(props['lracore:dateOfCorrespondence']) : '',
          dateReceivedSent: props['lracore:dateReceivedSent'] ? this.convertISOToCCYYMMDD(props['lracore:dateReceivedSent']) : '',
          auditType: props['lracore:auditType'] || '',
          auditPeriod: props['lracore:auditPeriod'] || '',
          collectorName: props['lracore:collectorName'] || '',
          exciseCommodity: props['lracore:exciseCommodity'] || ''
        });
      },
      error: () => this.showError('Could not load document metadata')
    });
  }

  onSubmit(): void {
    if (!this.validateTINETIN()) return;
    if (!this.validateFinancialYear()) return;
    if (!this.validateFinancialPeriod()) return;
    if (!this.validateExciseCommodity()) return;
    if (!this.validateCorrespondence()) return;
    if (!this.validateAudit()) return;
    if (!this.validateCollection()) return;
    if (!this.validateBusinessRegistration()) return;
    if (!this.validateIndividualRegistration()) return;

    this.updateMetadata();
    this.infoDrawerService.closeDrawer();
  }

  private validateTINETIN(): boolean {
    const { TINNumber, etinNumber } = this.form.value;

    if (!TINNumber && !etinNumber) {
      this.showError("At least one of TIN or ETIN must be specified");
      return false;
    }

    if (TINNumber && this.form.get('TINNumber')?.invalid) {
      this.showError('TIN must be of format 9999999-9');
      return false;
    }

    if (etinNumber && this.form.get('etinNumber')?.invalid) {
      this.showError('ETIN must be of format 299999999-9');
      return false;
    }

    return true;
  }

  private validateFinancialYear(): boolean {
    const fileType = this.form.value.fileType;
    const finYear = this.form.value.financialYear;

    if (['Audit', 'Collection', 'Registration'].includes(fileType)) {
      if (finYear && finYear.trim() !== '') {
        this.showError("Financial Year must NOT be specified for Audit, Collection or Registration");
        return false;
      }
      return true;
    }

    if (!finYear || finYear.trim() === '') {
      this.showError("Financial Year is required");
      return false;
    }

    const regex = /^\d{4}-\d{2}$/;
    if (!regex.test(finYear)) {
      this.showError("Financial Year format must be CCYY-YY (e.g., 2022-23)");
      return false;
    }

    const startYear = parseInt(finYear.substring(0, 4), 10);
    const endYear = parseInt(finYear.substring(5), 10) + 2000;
    if (endYear - startYear !== 1) {
      this.showError("Financial Year years must be consecutive (e.g., 2022-23)");
      return false;
    }

    return true;
  }

  private validateFinancialPeriod(): boolean {
    const ft = this.form.value.fileType;
    const finPeriod = this.form.value.financialPeriod;

    if (['Audit', 'Collection', 'Registration'].includes(ft)) {
      if (finPeriod) {
        this.showError("Financial Period may not be specified for 'Audit', 'Collection' or 'Registration' File Types.");
        return false;
      }
      return true;
    }

    if (!finPeriod) {
      this.showError("Financial Period is required for this File Type.");
      return false;
    }

    const regex = /^(0[1-9]|1[0-2])-\d{4}$/;
    if (!regex.test(finPeriod)) {
      this.showError("Financial Period format must be MM-CCYY (e.g., 03-2024).");
      return false;
    }

    return true;
  }

  private validateExciseCommodity(): boolean {
    const { documentType, exciseCommodity } = this.form.value;
    if (documentType === 'Excise Tax Return' && !exciseCommodity) {
      this.showError("Commodity must be specified for Excise Tax");
      return false;
    }
    return true;
  }

  private validateCorrespondence(): boolean {
    const { documentType, correspondenceType, sender, dateOfCorrespondence, dateReceivedSent } = this.form.value;
    if (documentType === 'Correspondence') {
      if (!correspondenceType || !sender) {
        this.showError("Correspondence Type and Sender/Receiver must be specified for Correspondence");
        return false;
      }
      if ((dateOfCorrespondence && !this.isValidCCYYMMDD(dateOfCorrespondence)) ||
          (dateReceivedSent && !this.isValidCCYYMMDD(dateReceivedSent))) {
        this.showError("Date of Correspondence and Date Received/Sent must be valid (yyyyMMdd)");
        return false;
      }
    } else if (correspondenceType || sender || dateOfCorrespondence || dateReceivedSent) {
      this.showError("Correspondence fields may not be specified for non-'Correspondence' documents");
      return false;
    }
    return true;
  }

  private validateAudit(): boolean {
    const { documentType, fileType, auditType, auditPeriod } = this.form.value;
    if (documentType === 'Audit Reports') {
      if (fileType !== 'Audit') {
        this.showError("Documents of type 'Audit' can only be associated with 'Audit' file type");
        return false;
      }
      if (auditPeriod) {
        const regex = /^\d{4}-\d{4}$/;
        if (!regex.test(auditPeriod)) {
          this.showError("Audit Period must be in CCYY-CCYY format");
          return false;
        }
        const [start, end] = auditPeriod.split('-').map(Number);
        if (end - start !== 1) {
          this.showError("Audit Period years must be consecutive");
          return false;
        }
      }
    } else if (auditType || auditPeriod) {
      this.showError("Audit fields may not be specified for non-'Audit' documents");
      return false;
    }
    return true;
  }

  private validateCollection(): boolean {
    const { documentType, fileType, collectorName } = this.form.value;
    if (documentType === 'Collection Information Statement') {
      if (fileType !== 'Collection') {
        this.showError("Documents of type 'Collections' can only be associated with 'Collection' file type");
        return false;
      }
    } else if (collectorName) {
      this.showError("'Name of Collector' may not be specified for non-'Collection' documents");
      return false;
    }
    return true;
  }

  private validateBusinessRegistration(): boolean {
    const { documentType, fileType, legalName, tradingName, employeeName, taxpayerType } = this.form.value;
    if (documentType === 'Business Taxpayer Registration Form') {
      if (fileType !== 'Registration') {
        this.showError("Documents of type 'Business Taxpayer Registration' can only be associated with 'Registration' file type");
        return false;
      }
      if (!legalName && !tradingName) {
        this.showError("One of 'Legal Name' or 'Trading Name' must be specified");
        return false;
      }
      if (employeeName) {
        this.showError("'Employee Name' may not be specified for Business Registrations");
        return false;
      }
      if (!taxpayerType) {
        this.showError("'Taxpayer Type' must be specified");
        return false;
      }
    }
    return true;
  }

  private validateIndividualRegistration(): boolean {
    const { documentType, fileType, legalName, tradingName, employeeName, taxpayerType } = this.form.value;
    if (documentType === 'Individual Taxpayer Registration Form') {
      if (fileType !== 'Registration') {
        this.showError("Documents of type 'Individual Taxpayer Registration' can only be associated with 'Registration' file type");
        return false;
      }
      if (!employeeName) {
        this.showError("'Employee Name' must be specified");
        return false;
      }
      if (legalName || tradingName) {
        this.showError("'Legal Name' or 'Trading Name' may not be specified for Individual Registrations");
        return false;
      }
      if (!taxpayerType) {
        this.showError("'Taxpayer Type' must be specified");
        return false;
      }
    }
    return true;
  }

  onCancel(): void {
    this.form.reset();
    this.infoDrawerService.closeDrawer();
  }

  private updateMetadata(): void {
    const nodeId = this.selectedNode?.entry?.id || this.selectedNode?.id;
    if (!nodeId) {
      this.showError('No document selected');
      return;
    }

    const f = this.form.value;
    const updatedProps = {
      'lracore:TINNumber': f.TINNumber || null,
      'lracore:etinNumber': f.etinNumber || null,
      'lracore:taxpayerType': f.taxpayerType || null,
      'lracore:fileType': f.fileType || null,
      'lracore:documentType': f.documentType || null,
      'lracore:financialYear': f.financialYear || null,
      'lracore:financialPeriod': f.financialPeriod || null,
      'lracore:legalName': f.legalName || null,
      'lracore:tradingName': f.tradingName || null,
      'lracore:taxpayerName': f.employeeName || null,
      'lracore:correspondenceType': f.correspondenceType || null,
      'lracore:sender': f.sender || null,
      'lracore:subject': f.subject || null,
      'lracore:dateOfCorrespondence': this.convertCCYYMMDDToISO(f.dateOfCorrespondence) || null,
      'lracore:dateReceivedSent': this.convertCCYYMMDDToISO(f.dateReceivedSent) || null,
      'lracore:auditType': f.auditType || null,
      'lracore:auditPeriod': f.auditPeriod || null,
      'lracore:collectorName': f.collectorName || null,
      'lracore:exciseCommodity': f.exciseCommodity || null
    };

    this.nodeApi.updateNode(nodeId, { properties: updatedProps }).subscribe({
      next: () => this.showSuccess('Taxpayer data updated successfully ✅'),
      error: (err) => {
      console.error('Error updating TPD:', err);
     
      
    }
    });
    this.form.reset();
  }

  //  all other existing validation methods here ...

private isValidCCYYMMDD(value: string): boolean {
    if (!/^\d{8}$/.test(value)) return false;
    const year = +value.slice(0, 4);
    const month = +value.slice(4, 6);
    const day = +value.slice(6, 8);
    const date = new Date(`${year}-${month}-${day}`);
    return !isNaN(date.getTime());
  }

  private convertCCYYMMDDToISO(dateStr: string): string | null {
    if (!/^\d{8}$/.test(dateStr)) return null;
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
    return isNaN(date.getTime()) ? null : date.toISOString();
  }

  private convertISOToCCYYMMDD(isoStr: string): string {
    const date = new Date(isoStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
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