import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from 'ngx-auth-firebaseui';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/kanban',
    pathMatch: 'full',
  },
  {
    path: 'kanban',
    canActivate: [LoggedInGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./kanban/kanban.module').then((m) => m.KanbanModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
