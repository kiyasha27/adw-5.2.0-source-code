import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'lib-app-custom-info-drawer',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './custom-info-drawer.component.html',
  styleUrls: ['./custom-info-drawer.component.scss']
})
export class CustomInfoDrawerComponent implements OnInit {
  @Input() drawerType = '';
  @Input() selectedNode: any;

  formData: any = {};

  ngOnInit(): void {
    this.initializeFormForDrawerType();
  }

  private initializeFormForDrawerType(): void {
    switch (this.drawerType) {
      case 'update-taxnumber':
        this.formData = {
          title: 'Update TIN/ETIN',
          fields: [
            { name: 'tinNumber', label: 'TIN Number', type: 'text', required: true },
            { name: 'etinNumber', label: 'Kopano Number', type: 'text', required: false }
          ]
        };
        break;
      case 'update-taxpayer-data':
        this.formData = {
          title: 'Update Taxpayer Data',
          fields: [
            { name: 'taxpayerName', label: 'Taxpayer Name', type: 'text', required: true },
            { name: 'taxpayerAddress', label: 'Address', type: 'textarea', required: true },
            { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: false }
          ]
        };
        break;
      case 'update-sad500':
        this.formData = {
          title: 'Update SAD500',
          fields: [
            { name: 'sad500Number', label: 'SAD500 Number', type: 'text', required: true },
            { name: 'declarationDate', label: 'Declaration Date', type: 'date', required: true },
            { name: 'amount', label: 'Amount', type: 'number', required: true }
          ]
        };
        break;
      case 'update-main-taxpayer-data':
        this.formData = {
          title: 'Update Main Taxpayer Data',
          fields: [
            { name: 'mainTaxpayerName', label: 'Main Taxpayer Name', type: 'text', required: true },
            { name: 'registrationNumber', label: 'Registration Number', type: 'text', required: true },
            { name: 'businessType', label: 'Business Type', type: 'select', required: true, options: [
              { value: 'individual', label: 'Individual' },
              { value: 'company', label: 'Company' },
              { value: 'partnership', label: 'Partnership' }
            ]}
          ]
        };
        break;
      case 'update-document-data':
        this.formData = {
          title: 'Update Document Data',
          fields: [
            { name: 'documentTitle', label: 'Document Title', type: 'text', required: true },
            { name: 'documentType', label: 'Document Type', type: 'select', required: true, options: [
              { value: 'invoice', label: 'Invoice' },
              { value: 'receipt', label: 'Receipt' },
              { value: 'contract', label: 'Contract' },
              { value: 'other', label: 'Other' }
            ]},
            { name: 'description', label: 'Description', type: 'textarea', required: false }
          ]
        };
        break;
      case 'run-script':
        this.formData = {
          title: 'Run Script',
          fields: [
            { name: 'scriptType', label: 'Script Type', type: 'select', required: true, options: [
              { value: 'validation', label: 'Validation Script' },
              { value: 'processing', label: 'Processing Script' },
              { value: 'export', label: 'Export Script' }
            ]},
            { name: 'parameters', label: 'Parameters', type: 'textarea', required: false }
          ]
        };
        break;
      case 'place-in-file':
        this.formData = {
          title: 'Place In File',
          fields: [
            { name: 'fileCategory', label: 'File Category', type: 'select', required: true, options: [
              { value: 'tax-documents', label: 'Tax Documents' },
              { value: 'legal-documents', label: 'Legal Documents' },
              { value: 'financial-documents', label: 'Financial Documents' }
            ]},
            { name: 'priority', label: 'Priority', type: 'select', required: true, options: [
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' }
            ]}
          ]
        };
        break;
      case 'request-physical-file':
        this.formData = {
          title: 'Request Physical File',
          fields: [
            { name: 'requestReason', label: 'Request Reason', type: 'textarea', required: true },
            { name: 'urgency', label: 'Urgency', type: 'select', required: true, options: [
              { value: 'urgent', label: 'Urgent' },
              { value: 'normal', label: 'Normal' },
              { value: 'low', label: 'Low Priority' }
            ]},
            { name: 'requesterName', label: 'Requester Name', type: 'text', required: true }
          ]
        };
        break;
      default:
        this.formData = {
          title: 'Custom Action',
          fields: []
        };
    }
  }

  onSubmit(): void {
    console.log('Form submitted:', this.formData);
    // Here you would typically make an API call to update the document
    // For now, we'll just log the data
  }

  onCancel(): void {
    // Close the drawer or reset form
    console.log('Action cancelled');
  }
}
