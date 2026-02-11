import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProfileComponent } from './features/auth/profile/profile.component';
import { JobListComponent } from './features/jobs/job-list/job-list.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/jobs', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'jobs', component: JobListComponent },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    },
    // {
    //     path: 'favorites',
    //     loadComponent: () => import('./features/favorites/favorites-list/favorites-list.component').then(m => m.FavoritesListComponent),
    //     canActivate: [authGuard]
    // },
    // {
    //     path: 'applications',
    //     loadComponent: () => import('./features/applications/applications-list/applications-list.component').then(m => m.ApplicationsListComponent),
    //     canActivate: [authGuard]
    // }
];
