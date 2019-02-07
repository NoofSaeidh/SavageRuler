import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PowersComponent } from './views/powers/powers.component';
import { readonlyScreenRouteWithRedirect } from './ui/screens/readonly-screen/readonly-screen-route';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  ...readonlyScreenRouteWithRedirect('powers', PowersComponent),
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
