import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PetSalesComponent } from './components/pet-sales.component';

const routes: Routes = [
  { path: '', component: PetSalesComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetSalesRoutingModule { }
