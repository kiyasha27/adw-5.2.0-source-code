import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-custom-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-viewer.component.html',
  styleUrls: ['./custom-viewer.component.css'],
})
export class CustomViewerComponent implements AfterViewInit {
  enterpriseViewerUrl = '';

  constructor(private router: Router) {
    const url = this.router.url;
    console.log('Router URL:', url);

    // This regex looks for "(viewer:view/" followed by any characters that are not a closing parenthesis
    // or additional slash, until we reach a parenthesis or query delimiter
    const regex = /\(viewer:view\/([^)]+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      const extractedId = match[1];
      console.log('Extracted ID:', extractedId);
      this.enterpriseViewerUrl = `http://192.168.82.62:8080/OpenAnnotate/viewer.htm?docId=workspace://SpacesStore/${extractedId}`;
      window.open(this.enterpriseViewerUrl, '_blank');
      
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


/* OLD CODE:
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-custom-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-viewer.component.html',
  styleUrls: ['./custom-viewer.component.css'],
})
export class CustomViewerComponent {
  enterpriseViewerUrl = '';
  constructor(private router:Router){
    const url = this.router.url;

// This regex looks for "(viewer:view/" followed by any characters that are not a closing parenthesis
// or additional slash, until we reach a parenthesis or query delimiter
const regex = /\(viewer:view\/([^)]+)/;
const match = url.match(regex);

if (match && match[1]) {
  const extractedId = match[1];
  console.log('Extracted ID:', extractedId);
  const enterpriseViewerUrl = `http://192.168.82.62:8080/OpenAnnotate/viewer.htm?docId=workspace://SpacesStore/${extractedId}`;
  
  //this.enterpriseViewerUrl = `http://192.168.82.62:8080/OpenAnnotate/viewer.htm?docId=workspace://SpacesStore/${extractedId}`;
     window.open(enterpriseViewerUrl, '_blank');
     console.log("URL", this.enterpriseViewerUrl);
} else {
  console.error('No match found');
}
    
  }
}*/