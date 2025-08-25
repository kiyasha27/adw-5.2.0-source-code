import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@alfresco/adf-core';
/* import { SitesService } from '@alfresco/adf-content-services';
import { SearchService} from '@alfresco/adf-content-services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskListService } from '@alfresco/adf-process-services'; */
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'lib-hello',
  standalone: true,
  imports: [CommonModule, MatCardModule,
    MatTableModule],
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css'],

})
export class HelloComponent implements OnInit{
 
 //--------------------------------------------------------------------variable declaration starts here
 
 hostname = 'http://localhost:4200/#';
 personalFiles = '/personal-files'; 
 sites: any[] = [];
 roles: any;
 src="https://kit.fontawesome.com/a076d05399.js";
 selectedDocument: any;
 documents: any[] = [];
 currentUser: string | undefined;
 myQueuedTasks: any[] = [];
activityList: any[] = [];

 //--------------------------------------------------------------------Divider to separate big jsons
 myCompletedTasks: any[] = [];

 //--------------------------------------------------------------------Divider to separate big jsons
 myTasks: any[] = [];
   //--------------------------------------------------------------------constructor starts here
  constructor(
    // private sitesServices: SitesService,
    // private searchService: SearchService,
    private authService: AuthenticationService,
    // private http: HttpClient,
    // private taskListService: TaskListService,
  ){} 
  //--------------------------------------------------------------------constructor ends here




 //--------------------------------------------------------------------ngOnInit() starts here
ngOnInit() {
  
  // Retrieve ECM username for content services purposes
  this.currentUser = this.authService.getUsername();
  console.log('Current ECM Username:', this.currentUser);
}
/*
  // Log current APS username for task queries (assuming getBpmUsername() is available)
  const bpmUsername = this.authService.getBpmUsername();
  console.log('Current APS Username:', bpmUsername);

  // SITE INFO
  this.sitesServices.getSites().subscribe(
    (response) => {
      const roles = ['SiteConsumer', 'SiteManager', 'SiteCollaborator', 'SiteContributor']; // Define roles
      this.sites = response.list?.entries
        ?.map(entry => entry.entry)
        .filter(entry => entry.role && roles.includes(entry.role)) || []; // Default to an empty array if undefined
  
      // Save the filtered sites where you have a role into the site array
      // eslint-disable-next-line no-self-assign
      this.sites = this.sites;
  
      console.log('LIBRARIES WHERE I HAVE A ROLE:', this.sites);
    },
    (error) => {
      console.error('Error getting libraries', error);
    }
  );

  // EXTRACTING CURRENT USER
  this.currentUser = this.authService.getUsername();
  console.log('Current ECM Username:', this.currentUser);

  // LOADING USER ACTIVITIES, TASKS, QUEUED TASKS, AND COMPLETED TASKS
  this.loadActivities();
  this.loadTasks();
  this.loadQueuedTasks();
  this.loadCompletedTasks();
  this.searchDocs();
  
} 
//--------------------------------------------------------------------ngOnInit() ends here 



//--------------------------------------------------------------------other methods start here
// To open and navigate a user to the selected task in the ADW
 openTask(taskId: string): void {
  const taskUrl = `http://localhost:8080/#/apps/0/task-details/${taskId}`;
  window.location.replace(taskUrl);
}

// To open and navigate a user to the selected doc in AEV within ADW
getDocumentUrl(documentId: string): void {
  const openRecentDocUrl = `http://localhost:8080/content-ee/alfresco-digital-workspace/#/recent-files/(viewer:view/${documentId})?location=%2Frecent-files`;
  window.location.replace(openRecentDocUrl);
}



// Get CSS class for icons based on MIME type
getIconClass(mimeTypeName: string): string {
  switch (mimeTypeName) {
    case 'PNG Image':
    case 'JPEG Image':
      return 'fas fa-file-image';

    case 'PDF Document':
      return 'fas fa-file-pdf';

    case 'Microsoft Word 2007':
      return 'fas fa-file-word';

    case 'JavaScript':
      return 'fas fa-file';

    default:
      return 'fas fa-file';
  }
}

searchDocs() {
  //Search query for what we want to retrieve
  const queryBody: any = {
    query: {
      language: 'afts',
      query: `cm:modifier:"${this.currentUser}" AND TYPE:"cm:content"`
    },
    //Set how many docs we want to see
    paging: {
      maxItems: 10,
      skipCount: 0
    },
    //Sorting data from most recently modified
    sort: [
      {
        type: 'FIELD',
        field: 'cm:modified',
        ascending: false
      }
    ]
  };
  //Capture the response
  this.searchService.searchByQueryBody(queryBody).subscribe({
    next: (result) => {
      console.log('Search results (AFTS via ADF):', result);
      const entries = result?.list?.entries ?? [];
    this.documents = entries.map((e: any) => e.entry);
    },
    error: (err) => console.error('Search error:', err)
  });
}


// Load activities for the current user
loadActivities() {
  const url = `http://localhost:8080/alfresco/api/-default-/public/alfresco/versions/1/people/${this.currentUser}/activities?maxItems=10&skipCount=0`;

  const headers = new HttpHeaders({
    Authorization: 'Basic ' + btoa('admin:admin')
  });

  this.http.get<any>(url, { headers }).subscribe({
    next: (response) => {
      // EXTRACTING & DISPLAYING LIST OF ACTIVITY TYPES
      this.activityList = response.list?.entries?.map((item: any) => item.entry) || [];
      console.log('Activities:', this.activityList);

      // Process each activity
      this.activityList.forEach(activity => {
        activity.activityTypeDescription = this.getActivityType(activity.activityType);
        activity.timeAgo = this.calculateTimeAgo(activity.postedAt);
      });

    },
    error: (err) => {
      console.error('Error retrieving activities:', err);
    }
  });
}

// Get a list of tasks assigned to the current user
loadTasks(): void {
  const bpmUsername = this.authService.getBpmUsername();
  const request = {
    assignee: bpmUsername,
    state: 'all',      // or 'all', 'completed', etc.
    size: 10,          // number of tasks to fetch
    start: 0
  };

  this.taskListService.getTasks(request).subscribe({
    next: (response: any) => {
      // Map tasks from response
      this.myTasks = response.data || [];
      console.log('My tasks:', this.myTasks);
    },
    error: (err) => {
      console.error('Error fetching tasks:', err);
    }
  });
}

// Get a list of tasks in the user's queue
loadQueuedTasks(): void {
  const request = {
    assignment: 'candidate',  // tasks the user can claim
    state: 'open',            // or 'active'
    // no 'assignee' to ensure they’re not assigned
    size: 10,
    start: 0
  };

  this.taskListService.getTasks(request).subscribe({
    next: (response: any) => {
      // Map queued tasks from response
      this.myQueuedTasks = response.data || [];
      console.log('My Queued tasks:', this.myQueuedTasks);
    },
    error: (err) => {
      console.error('Error fetching queued tasks:', err);
    }
  });
}

// Get a list of tasks completed by the user
loadCompletedTasks(): void {
  const bpmUsername = this.authService.getBpmUsername();
  const request = {
    assignee: bpmUsername,
    state: 'completed',   // or 'all' if you want all tasks
    size: 10,
    start: 0
  };

  this.taskListService.getTasks(request).subscribe({
    next: (response: any) => {
      // Map completed tasks from response
      this.myCompletedTasks = response.data || [];
      console.log('Completed tasks:', this.myCompletedTasks);
    },
    error: (err) => {
      console.error('Error fetching completed tasks:', err);
    }
  });
}

// Get activity type description based on the activity type
// Get activity type description based on the activity type
getActivityType(activityType: string): string {
  switch (activityType) {
    case 'org.alfresco.documentlibrary.file-added':
      return 'added file';

    case 'org.alfresco.documentlibrary.file-deleted':
      return 'deleted file';

    case 'org.alfresco.documentlibrary.file-previewed':
      return 'previewed file';

    case 'org.alfresco.documentlibrary.folder-added':
      return 'added folder';

    case 'org.alfresco.documentlibrary.file-downloaded':
      return 'downloaded file';

    case 'org.alfresco.site.user-left':
      return 'left';

    case 'org.alfresco.site.user-joined':
      return 'added user';

    case 'org.alfresco.documentlibrary.folder-deleted':
      return 'deleted folder';

    case 'org.alfresco.site.group-removed':
        return 'removed group';

    case 'org.alfresco.site.user-role-changed':
          return 'changed role of';

    case 'org.alfresco.documentlibrary.folders-added':
            return 'added folders';
      
    case 'org.alfresco.site.group-added':
            return 'added group'; 

    case 'org.alfresco.documentlibrary.file-updated':
              return 'updated file';
        
      
    default:
      return 'unknown';
  }
}

// Calculate time ago based on the posted date
calculateTimeAgo(postedAt: string): string {
  const postedDate = new Date(postedAt);
  const currentDate = new Date();
  const differenceInMilliseconds = currentDate.getTime() - postedDate.getTime();
  const differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));

  if (differenceInHours < 1) {
    const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
    return `${differenceInMinutes} minutes ago`;
  } else if (differenceInHours < 24) {
    return `${differenceInHours} hours ago`;
  } else if (differenceInHours >= 24 && differenceInHours < 48) {
    return "about a day old";
  } else {
    const differenceInDays = Math.floor(differenceInHours / 24);
    return `${differenceInDays} days ago`;
  }
}
//--------------------------------------------------------------------other methods ends here

*/

}
