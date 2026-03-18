import { Routes } from '@angular/router';
import { DashboardViewComponent } from './features/dashboard/dashboard-view/dashboard-view.component';
import { DashboardBuilderComponent } from './features/dashboard/dashboard-builder/dashboard-builder.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardViewComponent
  },
  {
    path: 'configure-dashboard',
    component: DashboardBuilderComponent
  },
  {
    path: 'orders',
    component: OrdersPageComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
