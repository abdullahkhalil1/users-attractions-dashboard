import { NgModule } from '@angular/core';

import { AttractionsRoutingModule } from './attractions-routing.module';
import { AttractionsService } from './services/attractions.service';
import { AttractionsFacade } from './services/attractions.facade';


@NgModule({
  declarations: [],
  imports: [
    AttractionsRoutingModule,
  ],
  providers: [AttractionsService, AttractionsFacade]
})
export class AttractionsModule { }
