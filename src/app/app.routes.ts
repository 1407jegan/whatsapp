import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CatalogComponent } from './dashboard/catalog/catalog.component';
import { AuthGuard } from './authGuard/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderComponent } from './dashboard/order/order.component';
import { EditProductComponent } from './edit-product/edit-product.component';

export const routes: Routes = [
  {path : '', redirectTo: '/login', pathMatch:"full"},
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.routes),
    canActivate: [AuthGuard]
  },
  { path: 'edit', component: EditProductComponent },
  
];
