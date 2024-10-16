import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../authGuard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'catalog',
        loadChildren: () => import('../dashboard/catalog/catalog.routes').then(m => m.routes),
        canActivate: [AuthGuard]
      },
      {
        path: 'orders',
        loadChildren: () => import('../dashboard/order/order.routes').then(m => m.routes),
        canActivate: [AuthGuard]
      }
    ]
  }
];
