/* import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SafePipeModule } from './safe.pipe.module';  // Import the pipe module
import { StorageService } from '@alfresco/adf-core';
import { AuthenticationService } from '@alfresco/adf-core'; //New

@Component({
  selector: 'lib-custom-viewer',
  standalone: true,
  imports: [CommonModule, SafePipeModule], 
  templateUrl: './custom-viewer.component.html',
  styleUrls: ['./custom-viewer.component.css'],
})
export class CustomViewerComponent implements AfterViewInit {
  enterpriseViewerUrl = '';
  currentUser: string | undefined; //New

  constructor(private router: Router, private storageService: StorageService, private authService: AuthenticationService) {
    const url = this.router.url;
    console.log('Router URL:', url);

    // This regex looks for "(viewer:view/" followed by any characters that are not a closing parenthesis
    // or additional slash, until we reach a parenthesis or query delimiter
    const regex = /\(viewer:view\/([^)]+)/;
    const match = url.match(regex);
    this.currentUser = this.authService.getUsername(); // Extracting username

    if (match && match[1]) {
      const extractedId = match[1];
      console.log('Extracted ID:', extractedId);

      // Storing user ticket
      const ecmTicket = this.storageService.getItem('ticket-ECM');
      console.log('ECM Ticket:', ecmTicket);

      // Generates the AEV URL to navigate to
      this.enterpriseViewerUrl = `http://localhost:8080/OpenAnnotate/login/external.htm?username=${this.currentUser}&ticket=${ecmTicket}&docId=workspace://SpacesStore/${extractedId}`;
      console.log(this.enterpriseViewerUrl);
      
      console.log("Constructed URL:", this.enterpriseViewerUrl);
    } else {
      console.error('No match found in URL:', url);
    }
  }

  ngAfterViewInit() {
    // Set the iframe src after view initialization
    const iframe = document.getElementById('customViewerIframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = this.enterpriseViewerUrl;
      console.log('Iframe source set to:', iframe.src);
    } else {
      console.error('Iframe not found');
    }
  }

  
}

 */