import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-update-sad500-action',
  template: ''
})
export class UpdateSad500ActionLauncherComponent {
  constructor(private router: Router) {}

  execute(context: { node: any }) {
  const nodeId = context?.node?.id;
  if (nodeId) {
   
    this.router.navigate([`/update-sad500/${context.node.id}`]);
     console.log('✅ Received nodeId:', nodeId);

  }
}
}