import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProfileComponent } from './features/auth/profile/profile.component';
import { JobListComponent } from './features/jobs/job-list/job-list.component';
import { FavoritesPageComponent } from './features/favorites/favorites-page/favorites-page.component';
import { ApplicationsPageComponent } from './features/applications/applications-page/applications-page.component';
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
    {
        path: 'favorites',
        component: FavoritesPageComponent,
        canActivate: [authGuard]
    },
    {
        path: 'applications',
        component: ApplicationsPageComponent,
        canActivate: [authGuard]
    }
];
