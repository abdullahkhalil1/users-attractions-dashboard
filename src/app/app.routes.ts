import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            },
            {
                path: 'users',
                loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule),
            },
            {
                path: 'attractions',
                loadChildren: () => import('./features/attractions/attractions.module').then(m => m.AttractionsModule)
            },
            {
                path: 'pet-sales',
                loadChildren: () => import('./features/pet-sales/pet-sales.module').then(m => m.PetSalesModule)
            }
        ]
    },
    { path: 'login', component: LoginComponent },

];