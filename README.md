# Introduction

This is an Angular wrapper for the FullStory JavaScript SDK.

Initial version of code is originally from https://github.com/CaliStyle/ng-fullstory, created just to get something up and running that can identify my users.

I will continuously update the library and might introduce breaking changes in the next version.

# Usage

1. Import FullstoryModule

   ```typescript
   import { FullstoryModule } from 'ngx-fullstory';

   @NgModule({
     imports: [
       ...
       FullstoryModule.forRoot({
         fsOrg: <your_fs_org>, // from your Fullstory config
       })
       ...
     ]
   })
   export class AppModule { }
   ```

2. Use in your component

  ```typescript
  import { Component, OnInit } from '@angular/core';
  import { Fullstory } from 'ngx-fullstory';

  @Component({
    selector: 'app',
    template: `...`
  })
  export class AppComponent implements OnInit, OnDestroy {
    constructor(
    public fullstory: Fullstory
    ){}

    ngOnInit() {
      this.fullstory.login(<user id>, {
                           displayName: <user display name>,
                           email: <user email>,
                           other: <properties>
                           });
    }

    ngOnDestroy() {
      this.fullstory.logout();
    }
  }
  ```