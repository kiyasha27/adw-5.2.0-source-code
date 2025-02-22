import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SitesService } from '@alfresco/adf-content-services';
//import { SearchService} from '@alfresco/adf-content-services';
import { AuthenticationService } from '@alfresco/adf-core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskListService } from '@alfresco/adf-process-services';

@Component({
  selector: 'lib-hello',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css'],
})
export class HelloComponent implements OnInit{
 
 //--------------------------------------------------------------------variable declaration starts here
 hostname = 'http://localhost:4200/#';
 personalFiles = '/personal-files'; 
 sites: any;
 src="https://kit.fontawesome.com/a076d05399.js";
 selectedDocument: any;
 documents: any[] = [];
 currentUser: string | undefined;
 myQueuedTasks: any[] = [
  {
    "id": "82553",
    "name": "Review",
    "description": null,
    "category": null,
    "assignee": null,
    "created": "2024-11-29T11:35:50.227Z",
    "duration": null,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "82528",
    "processInstanceName": null,
    "processDefinitionId": "review:1:70013",
    "processDefinitionName": "Review and Approve (pooled review)",
    "processDefinitionDescription": null,
    "processDefinitionKey": "review",
    "processDefinitionCategory": "http://www.activiti.org/processdef",
    "processDefinitionVersion": 1,
    "processDefinitionDeploymentId": "70001",
    "formKey": "1252",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-E62F03E2-BE2B-475D-999D-F68600742192",
    "executionId": "82532",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  }
];
 

 activities: any[] = [
  {
    postedAt: "2025-02-13T11:46:30.578+0000",
    feedPersonId: "admin",
    postPersonId: "admin",
    siteId: "migration",
    activitySummary: {
      firstName: "Admin",
      lastName: "Admin",
      parentObjectId: "1920a277-928e-41f6-b5e1-4b27471d5fd4",
      title: "ADW Folder2.png",
      objectId: "a641ac2b-30cb-4dac-ba35-6f70921cac31"
    },
    id: 999,
    activityType: "org.alfresco.documentlibrary.file-added"
  },
  {
    postedAt: "2025-02-09T12:34:16.070+0000",
    feedPersonId: "admin",
    postPersonId: "admin",
    siteId: "254005",
    activitySummary: {
      firstName: "Administrator",
      parentObjectId: "30863c67-cf4b-4913-8b25-c7182d2c0375",
      title: "Capture.PNG",
      objectId: "4b466d15-b7c0-4441-ad87-d2236db4d7dc"
    },
    id: 997,
    activityType: "org.alfresco.documentlibrary.file-deleted"
  },
  {
    postedAt: "2025-02-11T12:34:07.049+0000",
    feedPersonId: "admin",
    postPersonId: "admin",
    siteId: "254005",
    activitySummary: {
      firstName: "Administrator",
      parentObjectId: "ade919bd-049f-4530-b786-0170e3c6a6d4",
      title: "Capture7.PNG",
      objectId: "09a5595f-f954-43de-a5c1-3d83156ce57b"
    },
    id: 996,
    activityType: "org.alfresco.documentlibrary.file-deleted"
  },
  {
    postedAt: "2025-02-13T12:33:56.519+0000",
    feedPersonId: "admin",
    postPersonId: "admin",
    siteId: "254005",
    activitySummary: {
      firstName: "Administrator",
      parentObjectId: "9238e7b7-e8d4-470d-8a1f-d9f9305e25e3",
      title: "Capture2.PNG",
      objectId: "dd37da31-b575-41a9-91b0-1766793d33a9"
    },
    id: 995,
    activityType: "org.alfresco.documentlibrary.file-deleted"
  },
  {
    postedAt: "2025-02-12T12:33:23.425+0000",
    feedPersonId: "admin",
    postPersonId: "admin",
    siteId: "migration",
    activitySummary: {
      firstName: "Administrator",
      parentObjectId: "1920a277-928e-41f6-b5e1-4b27471d5fd4",
      title: "Capture6.PNG",
      objectId: "d2b09f21-a552-4811-8e48-4102c63f10b9"
    },
    id: 992,
    activityType: "org.alfresco.documentlibrary.file-deleted"
  },
  {
    postedAt: "2025-02-12T12:33:23.425+0000",
    feedPersonId: "admin",
    postPersonId: "admin",
    siteId: "migration",
    activitySummary: {
      firstName: "Administrator",
      parentObjectId: "1920a277-928e-41f6-b5e1-4b27471d5fd4",
      title: "Capture5.PNG",
      objectId: "76a9a5c6-67ad-4421-905c-ec33fc2b2409"
    },
    id: 994,
    activityType: "org.alfresco.documentlibrary.file-deleted"
  },
  {
    postedAt: "2025-02-12T12:33:23.411+0000",
    feedPersonId: "admin",
    postPersonId: "admin",
    siteId: "migration",
    activitySummary: {
      firstName: "Administrator",
      parentObjectId: "1920a277-928e-41f6-b5e1-4b27471d5fd4",
      title: "Capture4.PNG",
      objectId: "f0d2580d-7116-48f3-9e65-e679a0e38678"
    },
    id: 990,
    activityType: "org.alfresco.documentlibrary.file-deleted"
  },
  {
    postedAt: "2025-02-12T12:33:11.316+0000",
    feedPersonId: "admin",
    postPersonId: "admin",
    siteId: "migration",
    activitySummary: {
      firstName: "Administrator",
      parentObjectId: "5156ad63-63a8-4930-8f17-67856077ff20",
      title: "Capture4.PNG",
      objectId: "3a840d9c-28ca-455b-97dd-f405dd6f252d"
    },
    id: 988,
    activityType: "org.alfresco.documentlibrary.file-deleted"
  },
  {
    postedAt: "2025-02-10T12:33:11.305+0000",
    feedPersonId: "admin",
    postPersonId: "admin",
    siteId: "migration",
    activitySummary: {
      firstName: "Administrator",
      parentObjectId: "5156ad63-63a8-4930-8f17-67856077ff20",
      title: "Capture3.PNG",
      objectId: "c052d46d-ee2d-4b87-9ae8-22fec6c1a5fd"
    },
    id: 982,
    activityType: "org.alfresco.documentlibrary.file-deleted"
  },
  {
    postedAt: "2025-02-12T12:33:11.305+0000",
    feedPersonId: "admin",
    postPersonId: "admin",
    siteId: "migration",
    activitySummary: {
      firstName: "Administrator",
      parentObjectId: "5156ad63-63a8-4930-8f17-67856077ff20",
      title: "Capture6.PNG",
      objectId: "5ab4c4dc-2f6b-4ad7-8797-ef575e76bff9"
    },
    id: 986,
      activityType: "org.alfresco.documentlibrary.file-deleted"
    }
  ];

 //--------------------------------------------------------------------Divider to separate big jsons
 myCompletedTasks: any[] = [
  {
    "id": "127707",
    "name": "Questionnaire Task",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2025-01-29T13:52:17.524Z",
    "endDate": "2025-01-29T13:54:03.685Z",
    "duration": 106161,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "127689",
    "processInstanceName": null,
    "processDefinitionId": "questionnaire-process:9:127684",
    "processDefinitionName": null,
    "processDefinitionDescription": null,
    "processDefinitionKey": null,
    "processDefinitionCategory": null,
    "processDefinitionVersion": 0,
    "processDefinitionDeploymentId": null,
    "formKey": "2558",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-33EFD534-0186-43CD-AA67-C762E9E84AE2",
    "executionId": "127693",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  },
  {
    "id": "127679",
    "name": "Questionnaire Task",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2025-01-29T13:41:32.803Z",
    "endDate": "2025-01-29T13:52:09.991Z",
    "duration": 637188,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "127661",
    "processInstanceName": null,
    "processDefinitionId": "questionnaire-process:8:127660",
    "processDefinitionName": null,
    "processDefinitionDescription": null,
    "processDefinitionKey": null,
    "processDefinitionCategory": null,
    "processDefinitionVersion": 0,
    "processDefinitionDeploymentId": null,
    "formKey": "2557",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-33EFD534-0186-43CD-AA67-C762E9E84AE2",
    "executionId": "127665",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  },
  {
    "id": "127600",
    "name": "Questionnaire Task",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2025-01-29T12:47:47.336Z",
    "endDate": "2025-01-29T12:48:44.690Z",
    "duration": 57354,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "127582",
    "processInstanceName": null,
    "processDefinitionId": "questionnaire-process:5:127581",
    "processDefinitionName": null,
    "processDefinitionDescription": null,
    "processDefinitionKey": null,
    "processDefinitionCategory": null,
    "processDefinitionVersion": 0,
    "processDefinitionDeploymentId": null,
    "formKey": "2554",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-33EFD534-0186-43CD-AA67-C762E9E84AE2",
    "executionId": "127586",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  },
  {
    "id": "127519",
    "name": "Questionnaire Task",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2025-01-29T12:22:41.672Z",
    "endDate": "2025-01-29T12:39:18.259Z",
    "duration": 996587,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "127501",
    "processInstanceName": null,
    "processDefinitionId": "questionnaire-process:1:125003",
    "processDefinitionName": null,
    "processDefinitionDescription": null,
    "processDefinitionKey": null,
    "processDefinitionCategory": null,
    "processDefinitionVersion": 0,
    "processDefinitionDeploymentId": null,
    "formKey": "2501",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-33EFD534-0186-43CD-AA67-C762E9E84AE2",
    "executionId": "127505",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  },
  {
    "id": "118597",
    "name": "Supervisor Diarized - 30024",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2024-12-18T23:04:55.543Z",
    "endDate": "2024-12-18T23:05:08.851Z",
    "duration": 13308,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "118357",
    "processInstanceName": null,
    "processDefinitionId": "Process_sid-8B59D0C8-D905-4A60-85D7-06FE7EBE5572:34:118356",
    "processDefinitionName": null,
    "processDefinitionDescription": null,
    "processDefinitionKey": null,
    "processDefinitionCategory": null,
    "processDefinitionVersion": 0,
    "processDefinitionDeploymentId": null,
    "formKey": "2445",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-9861023F-4331-4C98-911C-D0623A8AFB7A",
    "executionId": "118445",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  },
  {
    "id": "118472",
    "name": "Supervisor Review - 30024",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2024-12-18T23:04:16.365Z",
    "endDate": "2024-12-18T23:04:46.574Z",
    "duration": 30209,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "118357",
    "processInstanceName": null,
    "processDefinitionId": "Process_sid-8B59D0C8-D905-4A60-85D7-06FE7EBE5572:34:118356",
    "processDefinitionName": null,
    "processDefinitionDescription": null,
    "processDefinitionKey": null,
    "processDefinitionCategory": null,
    "processDefinitionVersion": 0,
    "processDefinitionDeploymentId": null,
    "formKey": "2444",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-A5DDA7B4-CAF0-430B-96EB-719E54EB8A5E",
    "executionId": "118445",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  },
  {
    "id": "118229",
    "name": "Supervisor Review - 30024",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2024-12-18T22:58:36.512Z",
    "endDate": "2024-12-18T23:00:38.643Z",
    "duration": 122131,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "118114",
    "processInstanceName": null,
    "processDefinitionId": "Process_sid-8B59D0C8-D905-4A60-85D7-06FE7EBE5572:33:118020",
    "processDefinitionName": null,
    "processDefinitionDescription": null,
    "processDefinitionKey": null,
    "processDefinitionCategory": null,
    "processDefinitionVersion": 0,
    "processDefinitionDeploymentId": null,
    "formKey": "2436",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-A5DDA7B4-CAF0-430B-96EB-719E54EB8A5E",
    "executionId": "118202",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  },
  {
    "id": "118210",
    "name": "Adjuster Review - 30024",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2024-12-18T22:58:36.375Z",
    "endDate": "2024-12-18T23:00:38.641Z",
    "duration": 122266,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "118114",
    "processInstanceName": null,
    "processDefinitionId": "Process_sid-8B59D0C8-D905-4A60-85D7-06FE7EBE5572:33:118020",
    "processDefinitionName": null,
    "processDefinitionDescription": null,
    "processDefinitionKey": null,
    "processDefinitionCategory": null,
    "processDefinitionVersion": 0,
    "processDefinitionDeploymentId": null,
    "formKey": "2441",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-2BF5602C-7DE3-437A-8877-4D13D4CCEA05",
    "executionId": "118201",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  },
  {
    "id": "117996",
    "name": "EDI Team Review - 30024",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2024-12-18T08:35:44.400Z",
    "endDate": "2024-12-18T22:57:29.061Z",
    "duration": 51704661,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "117881",
    "processInstanceName": null,
    "processDefinitionId": "Process_sid-A4E9E80C-268A-4CBF-96D9-9953E245E11C:18:117880",
    "processDefinitionName": null,
    "processDefinitionDescription": null,
    "processDefinitionKey": null,
    "processDefinitionCategory": null,
    "processDefinitionVersion": 0,
    "processDefinitionDeploymentId": null,
    "formKey": "2424",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-324DA776-CD7D-4217-9E73-58A65A0585C6",
    "executionId": "117885",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  },
  {
    "id": "117976",
    "name": "Adjuster Review - 30024",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2024-12-18T08:35:44.348Z",
    "endDate": "2024-12-18T22:57:29.053Z",
    "duration": 51704705,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "117881",
    "processInstanceName": null,
    "processDefinitionId": "Process_sid-A4E9E80C-268A-4CBF-96D9-9953E245E11C:18:117880",
    "processDefinitionName": null,
    "processDefinitionDescription": null,
    "processDefinitionKey": null,
    "processDefinitionCategory": null,
    "processDefinitionVersion": 0,
    "processDefinitionDeploymentId": null,
    "formKey": "2426",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-2BF5602C-7DE3-437A-8877-4D13D4CCEA05",
    "executionId": "117968",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  }
]

 //--------------------------------------------------------------------Divider to separate big jsons
 myTasks: any[] = [
  {
    "id": "127735",
    "name": "Questionnaire Task",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2025-01-29T13:57:11.795Z",
    "duration": null,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "127717",
    "processInstanceName": null,
    "processDefinitionId": "questionnaire-process:10:127716",
    "processDefinitionName": "questionnaire-process",
    "processDefinitionDescription": null,
    "processDefinitionKey": "questionnaire-process",
    "processDefinitionCategory": "http://www.activiti.org/processdef",
    "processDefinitionVersion": 10,
    "processDefinitionDeploymentId": "127714",
    "formKey": "2559",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-33EFD534-0186-43CD-AA67-C762E9E84AE2",
    "executionId": "127721",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  },
  {
    "id": "118605",
    "name": "Supervisor Review - 30024",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2024-12-18T23:05:08.867Z",
    "duration": null,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "118357",
    "processInstanceName": null,
    "processDefinitionId": "Process_sid-8B59D0C8-D905-4A60-85D7-06FE7EBE5572:34:118356",
    "processDefinitionName": null,
    "processDefinitionDescription": null,
    "processDefinitionKey": "Process_sid-8B59D0C8-D905-4A60-85D7-06FE7EBE5572",
    "processDefinitionCategory": "http://www.activiti.org/processdef",
    "processDefinitionVersion": 34,
    "processDefinitionDeploymentId": "118354",
    "formKey": "2444",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-A5DDA7B4-CAF0-430B-96EB-719E54EB8A5E",
    "executionId": "118445",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  },
  {
    "id": "118453",
    "name": "Adjuster Review - 30024",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2024-12-18T23:04:16.345Z",
    "duration": null,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "118357",
    "processInstanceName": null,
    "processDefinitionId": "Process_sid-8B59D0C8-D905-4A60-85D7-06FE7EBE5572:34:118356",
    "processDefinitionName": null,
    "processDefinitionDescription": null,
    "processDefinitionKey": "Process_sid-8B59D0C8-D905-4A60-85D7-06FE7EBE5572",
    "processDefinitionCategory": "http://www.activiti.org/processdef",
    "processDefinitionVersion": 34,
    "processDefinitionDeploymentId": "118354",
    "formKey": "2449",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-2BF5602C-7DE3-437A-8877-4D13D4CCEA05",
    "executionId": "118444",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  },
  {
    "id": "82619",
    "name": "Review Task",
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2024-11-29T11:39:34.498Z",
    "dueDate": "2024-12-09T00:00:00.000Z",
    "duration": null,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "82563",
    "processInstanceName": null,
    "processDefinitionId": "activitiMultiplePeopleReview:1:70010",
    "processDefinitionName": "Review and Approve (one or more reviewer)",
    "processDefinitionDescription": null,
    "processDefinitionKey": "activitiMultiplePeopleReview",
    "processDefinitionCategory": "http://alfresco.org",
    "processDefinitionVersion": 1,
    "processDefinitionDeploymentId": "70001",
    "formKey": "1266",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "reviewTask",
    "executionId": "82611",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  },
  {
    "id": "57797",
    "name": null,
    "description": null,
    "category": null,
    "assignee": {
      "id": 1,
      "firstName": null,
      "lastName": "Administrator",
      "email": "kopano.thekiso@falcorp.co.za"
    },
    "created": "2024-11-09T08:45:38.486Z",
    "duration": null,
    "priority": 0,
    "parentTaskId": null,
    "parentTaskName": null,
    "processInstanceId": "57504",
    "processInstanceName": null,
    "processDefinitionId": "testing:40:57503",
    "processDefinitionName": "testing",
    "processDefinitionDescription": null,
    "processDefinitionKey": "testing",
    "processDefinitionCategory": "http://www.activiti.org/processdef",
    "processDefinitionVersion": 40,
    "processDefinitionDeploymentId": "57501",
    "formKey": "1002",
    "processInstanceStartUserId": null,
    "initiatorCanCompleteTask": false,
    "deactivateUserTaskReassignment": false,
    "adhocTaskCanBeReassigned": false,
    "taskDefinitionKey": "sid-023E51B2-DAFA-40B3-8A3E-8438B12F5D60",
    "executionId": "57508",
    "memberOfCandidateUsers": false,
    "managerOfCandidateGroup": false,
    "memberOfCandidateGroup": false
  }
];
 //--------------------------------------------------------------------Divider to separate big jsons

//DISPLAYS THE RECENT DOCS USING STATIC INFO
  dataList = {
        "entries": [
          {
            "entry": {
              "isFile": true,
              "createdByUser": {
                "id": "admin",
                "displayName": "admin"
              },
              "modifiedAt": "2025-02-17T12:17:01.534+0000",
              "nodeType": "cm:content",
              "content": {
                "mimeType": "text/plain",
                "mimeTypeName": "Plain Text",
                "sizeInBytes": 19,
                "encoding": "ISO-8859-2"
              },
              "parentId": "ccfd4a8a-ccae-458b-994c-51da26789f15",
              "aspectNames": [
                "cm:versionable",
                "cm:auditable",
                "imap:flaggable"
              ],
              "createdAt": "2025-02-17T12:17:01.534+0000",
              "path": {
                "name": "/Company Home",
                "isComplete": true,
                "elements": [
                  {
                    "id": "ccfd4a8a-ccae-458b-994c-51da26789f15",
                    "name": "Company Home",
                    "nodeType": "cm:folder",
                    "aspectNames": [
                      "cm:titled",
                      "cm:auditable",
                      "imap:imapFolder",
                      "app:uifacets"
                    ]
                  }
                ]
              },
              "isFolder": false,
              "permissions": {
                "inherited": [
                  {
                    "authorityId": "GROUP_EVERYONE",
                    "name": "Consumer",
                    "accessStatus": "ALLOWED"
                  }
                ],
                "settable": [
                  "Contributor",
                  "Collaborator",
                  "Coordinator",
                  "Editor",
                  "Consumer"
                ],
                "isInheritanceEnabled": true
              },
              "modifiedByUser": {
                "id": "admin",
                "displayName": "admin"
              },
              "name": "test1.txt",
              "definition": {
                "properties": [
                  {
                    "id": "cm:autoVersionOnUpdateProps",
                    "title": "Auto Version - on update properties only",
                    "defaultValue": "false",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "cm:created",
                    "title": "Created Date",
                    "description": "Created Date",
                    "dataType": "d:datetime",
                    "isMultiValued": false,
                    "isMandatory": true,
                    "isMandatoryEnforced": true,
                    "isProtected": true
                  },
                  {
                    "id": "imap:flagDraft",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "imap:flagDeleted",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "imap:flagSeen",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "cm:creator",
                    "title": "Creator",
                    "description": "Who created this item",
                    "dataType": "d:text",
                    "isMultiValued": false,
                    "isMandatory": true,
                    "isMandatoryEnforced": true,
                    "isProtected": true
                  },
                  {
                    "id": "cm:name",
                    "title": "Name",
                    "description": "Name",
                    "dataType": "d:text",
                    "isMultiValued": false,
                    "isMandatory": true,
                    "isMandatoryEnforced": true,
                    "isProtected": false,
                    "constraints": [
                      {
                        "id": "cm:filename",
                        "type": "REGEX",
                        "parameters": {
                          "requiresMatch": false,
                          "expression": "(.*[\\\"\\*\\\\\\>\\<\\?\\/\\:\\|]+.*)|(.*[\\.]?.*[\\.]+$)|(.*[ ]+$)"
                        }
                      }
                    ]
                  },
                  {
                    "id": "imap:flagAnswered",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "imap:flagFlagged",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "cm:versionLabel",
                    "title": "Version Label",
                    "description": "Version Label",
                    "dataType": "d:text",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": true
                  },
                  {
                    "id": "imap:flagRecent",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "cm:modifier",
                    "title": "Modifier",
                    "description": "Who last modified this item",
                    "dataType": "d:text",
                    "isMultiValued": false,
                    "isMandatory": true,
                    "isMandatoryEnforced": true,
                    "isProtected": true
                  },
                  {
                    "id": "cm:modified",
                    "title": "Modified Date",
                    "description": "When this item was last modified",
                    "dataType": "d:datetime",
                    "isMultiValued": false,
                    "isMandatory": true,
                    "isMandatoryEnforced": true,
                    "isProtected": true
                  },
                  {
                    "id": "cm:autoVersion",
                    "title": "Auto Version",
                    "description": "Auto Version",
                    "defaultValue": "true",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "cm:versionType",
                    "title": "Version Type",
                    "dataType": "d:text",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": true
                  },
                  {
                    "id": "cm:initialVersion",
                    "title": "Initial Version",
                    "description": "Initial Version",
                    "defaultValue": "true",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "cm:accessed",
                    "title": "Last Accessed Date",
                    "description": "When this item was last accessed",
                    "dataType": "d:datetime",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": true
                  }
                ]
              },
              "id": "724aa9a7-1399-4b2e-978d-5d94531ecd87",
              "properties": {
                "cm:versionLabel": "1.0",
                "imap:flagRecent": true,
                "cm:versionType": "MAJOR"
              },
              "allowableOperations": [
                "delete",
                "update",
                "updatePermissions"
              ],
              "isFavorite": false
            }
          },
          {
            "entry": {
              "isFile": true,
              "createdByUser": {
                "id": "admin",
                "displayName": "admin"
              },
              "modifiedAt": "2025-02-13T09:24:40.598+0000",
              "nodeType": "cm:content",
              "content": {
                "mimeType": "text/csv",
                "mimeTypeName": "Comma Separated Values (CSV)",
                "sizeInBytes": 148,
                "encoding": "UTF-8"
              },
              "parentId": "ccfd4a8a-ccae-458b-994c-51da26789f15",
              "aspectNames": [
                "cm:versionable",
                "cm:auditable",
                "imap:flaggable"
              ],
              "createdAt": "2025-02-13T09:24:40.598+0000",
              "path": {
                "name": "/Company Home",
                "isComplete": true,
                "elements": [
                  {
                    "id": "ccfd4a8a-ccae-458b-994c-51da26789f15",
                    "name": "Company Home",
                    "nodeType": "cm:folder",
                    "aspectNames": [
                      "cm:titled",
                      "cm:auditable",
                      "imap:imapFolder",
                      "app:uifacets"
                    ]
                  }
                ]
              },
              "isFolder": false,
              "permissions": {
                "inherited": [
                  {
                    "authorityId": "GROUP_EVERYONE",
                    "name": "Consumer",
                    "accessStatus": "ALLOWED"
                  }
                ],
                "settable": [
                  "Contributor",
                  "Collaborator",
                  "Coordinator",
                  "Editor",
                  "Consumer"
                ],
                "isInheritanceEnabled": true
              },
              "modifiedByUser": {
                "id": "admin",
                "displayName": "admin"
              },
              "name": "pcis1.csv",
              "definition": {
                "properties": [
                  {
                    "id": "cm:autoVersionOnUpdateProps",
                    "title": "Auto Version - on update properties only",
                    "defaultValue": "false",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "cm:created",
                    "title": "Created Date",
                    "description": "Created Date",
                    "dataType": "d:datetime",
                    "isMultiValued": false,
                    "isMandatory": true,
                    "isMandatoryEnforced": true,
                    "isProtected": true
                  },
                  {
                    "id": "imap:flagDraft",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "imap:flagDeleted",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "imap:flagSeen",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "cm:creator",
                    "title": "Creator",
                    "description": "Who created this item",
                    "dataType": "d:text",
                    "isMultiValued": false,
                    "isMandatory": true,
                    "isMandatoryEnforced": true,
                    "isProtected": true
                  },
                  {
                    "id": "cm:name",
                    "title": "Name",
                    "description": "Name",
                    "dataType": "d:text",
                    "isMultiValued": false,
                    "isMandatory": true,
                    "isMandatoryEnforced": true,
                    "isProtected": false,
                    "constraints": [
                      {
                        "id": "cm:filename",
                        "type": "REGEX",
                        "parameters": {
                          "requiresMatch": false,
                          "expression": "(.*[\\\"\\*\\\\\\>\\<\\?\\/\\:\\|]+.*)|(.*[\\.]?.*[\\.]+$)|(.*[ ]+$)"
                        }
                      }
                    ]
                  },
                  {
                    "id": "imap:flagAnswered",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "imap:flagFlagged",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "cm:versionLabel",
                    "title": "Version Label",
                    "description": "Version Label",
                    "dataType": "d:text",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": true
                  },
                  {
                    "id": "imap:flagRecent",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "cm:modifier",
                    "title": "Modifier",
                    "description": "Who last modified this item",
                    "dataType": "d:text",
                    "isMultiValued": false,
                    "isMandatory": true,
                    "isMandatoryEnforced": true,
                    "isProtected": true
                  },
                  {
                    "id": "cm:modified",
                    "title": "Modified Date",
                    "description": "When this item was last modified",
                    "dataType": "d:datetime",
                    "isMultiValued": false,
                    "isMandatory": true,
                    "isMandatoryEnforced": true,
                    "isProtected": true
                  },
                  {
                    "id": "cm:autoVersion",
                    "title": "Auto Version",
                    "description": "Auto Version",
                    "defaultValue": "true",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "cm:versionType",
                    "title": "Version Type",
                    "dataType": "d:text",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": true
                  },
                  {
                    "id": "cm:initialVersion",
                    "title": "Initial Version",
                    "description": "Initial Version",
                    "defaultValue": "true",
                    "dataType": "d:boolean",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": false
                  },
                  {
                    "id": "cm:accessed",
                    "title": "Last Accessed Date",
                    "description": "When this item was last accessed",
                    "dataType": "d:datetime",
                    "isMultiValued": false,
                    "isMandatory": false,
                    "isMandatoryEnforced": false,
                    "isProtected": true
                  }
                ]
              },
              "id": "5007bee2-527a-4823-8fce-649014df02a8",
              "properties": {
                "cm:versionLabel": "1.0",
                "imap:flagRecent": true,
                "cm:versionType": "MAJOR"
              },
              "allowableOperations": [
                "delete",
                "update",
                "updatePermissions"
              ],
              "isFavorite": false
            }
          }
        ],
        
      }
  //--------------------------------------------------------------------variable declaration ends here



  //--------------------------------------------------------------------constructor starts here
  constructor(
    private sitesServices: SitesService,
    //private searchService: SearchService,
    private authService: AuthenticationService,
    private http: HttpClient,
    private taskListService: TaskListService,
  ){} 
  //--------------------------------------------------------------------constructor ends here




 //--------------------------------------------------------------------ngOnInit() starts here
ngOnInit() {
  // DISPLAYING LIST OF DOCUMENTS - STATIC INFO
  // Getting my static array list and displaying data on UI
  this.documents = this.dataList.entries.map(item => item.entry);

  // EXTRACTING & DISPLAYING LIST OF ACTIVITY TYPES
  this.activities.forEach(activity => {
    activity.activityTypeDescription = this.getActivityType(activity.activityType);
    activity.timeAgo = this.calculateTimeAgo(activity.postedAt);
  });

  // SITE INFO
  this.sitesServices.getSites().subscribe(
    (response) => {
      this.sites = response.list?.entries.map(entry => entry.entry);
      console.log('MY SITES INFO:', response);
    },
    (error) => {
      console.error('Error getting sites', error);
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
  //this.searchDocs();
} 
//--------------------------------------------------------------------ngOnInit() ends here 



//--------------------------------------------------------------------other methods start here
// To open and navigate a user to the selected task in the APS
openTask(taskId: string): void {
  const taskUrl = `http://localhost:4200/#/apps/0/task-details/${taskId}`;
  window.location.replace(taskUrl);
}



// Use the variables to create the document viewer URL dynamically
// i.e., http://localhost:4200/#/personal-files/(viewer:view/${documentId})?location=%2Fpersonal-files;
getDocumentUrl(documentId: string): string {
  return `http://192.168.82.62:8080/OpenAnnotate/viewer.htm?docId=workspace://SpacesStore/${documentId}`;
//return `${this.hostname}${this.personalFiles}/(viewer:view/${documentId})?location=${encodeURIComponent(this.personalFiles)}`;
}


// Get CSS class for icons based on MIME type
getIconClass(mimeTypeName: string): string {
  switch (mimeTypeName) {
    case 'PNG Image':
    case 'JPEG Image':
      return 'fas fa-file-image';

    case 'PDF Document':
      return 'fas fa-file-pdf';

    case 'Word Document':
      return 'fas fa-file-word';

    default:
      return 'fas fa-file';
  }
}

// Load activities for the current user
loadActivities() {
  const url = `http://localhost:8181/alfresco/api/-default-/public/alfresco/versions/1/people/${this.currentUser}/activities?maxItems=10&skipCount=0`;

  const headers = new HttpHeaders({
    Authorization: 'Basic ' + btoa('admin:admin')
  });

  this.http.get<any>(url, { headers }).subscribe({
    next: (response) => {
      // Extract and map activities
      this.activities = response.list?.entries?.map((item: any) => item.entry) || [];
      console.log('Activities:', this.activities);
    },
    error: (err) => {
      console.error('Error retrieving activities:', err);
    }
  });
}

// Get a list of tasks assigned to the current user
loadTasks(): void {
  const request = {
    assignee: 1,
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
  const request = {
    assignee: 1,
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
getActivityType(activityType: string): string {
  switch (activityType) {
    case 'org.alfresco.documentlibrary.file-added':
      return 'added file';

    case 'org.alfresco.documentlibrary.file-deleted':
      return 'deleted file';

    case 'org.alfresco.documentlibrary.file-downloaded':
      return 'downloaded file';

    case 'org.alfresco.site.user-left':
      return 'left';

    case 'org.alfresco.site.user-joined':
      return 'joined';

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


}