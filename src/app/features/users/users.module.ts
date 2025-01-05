import { NgModule } from '@angular/core';

import { UsersRoutingModule } from './users-routing.module';
import { UsersService } from './services/users.service';
import { UsersFacade } from './services/users.facade';


@NgModule({
  declarations: [],
  imports: [
    UsersRoutingModule,
  ],
  providers: [UsersService, UsersFacade]
})
export class UsersModule { }
