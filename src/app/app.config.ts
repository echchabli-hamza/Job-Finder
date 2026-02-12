import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { favoritesReducer } from './store/favorites/favorites.reducer';
import { FavoritesEffects } from './store/favorites/favorites.effects';
import { applicationsReducer } from './store/applications/applications.reducer';
import { ApplicationsEffects } from './store/applications/applications.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({ 
      auth: authReducer,
      favorites: favoritesReducer,
      applications: applicationsReducer
    }),
    provideEffects([AuthEffects, FavoritesEffects, ApplicationsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false })
  ]
};
