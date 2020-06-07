import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../core/auth.guard';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserListResolver } from './user/_resolvers/user-list.resolver';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserEditResolver } from './user/_resolvers/user-edit.resolver';
import { PreventUnsavedchanges } from './user/_guards/prevent-unsaved-changes.guard';

const routes: Routes = [
    {
        path: 'pages',
        component: PagesComponent,
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'users',
                component: UserListComponent,
                resolve: { users: UserListResolver }
            },
            {
                path: 'user/edit',
                component: UserEditComponent,
                resolve: { user: UserEditResolver },
                canDeactivate: [PreventUnsavedchanges]
            },
            {
                path: 'admin',
                component: AdminComponent,
                data: { roles: ['Admin'] }
            },
            {
                path: '**',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class PagesRoutingModule { }
