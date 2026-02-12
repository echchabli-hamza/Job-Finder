import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';
import * as FavoritesActions from '../favorites/favorites.actions';

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private router = inject(Router);

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            switchMap(({ request }) =>
                this.authService.login(request).pipe(
                    map((user) => AuthActions.loginSuccess({ user })),
                    catchError((error) => of(AuthActions.loginFailure({ error: error.message })))
                )
            )
        )
    );

    loginSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loginSuccess),
            tap(() => this.router.navigate(['/jobs'])),
            switchMap(() => [
                FavoritesActions.loadFavorites()
            ])
        )
    );

    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.register),
            switchMap(({ request }) =>
                this.authService.register(request).pipe(
                    map((user) => AuthActions.registerSuccess({ user })),
                    catchError((error) => of(AuthActions.registerFailure({ error: error.message })))
                )
            )
        )
    );

    registerSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.registerSuccess),
            tap(() => this.router.navigate(['/jobs'])),
            switchMap(() => [
                FavoritesActions.loadFavorites()
            ])
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            switchMap(() => [
                FavoritesActions.clearFavorites()
            ]),
            tap(() => {
                this.authService.logout();
                this.router.navigate(['/login']);
            })
        )
    );

    updateProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.updateProfile),
            switchMap(({ user }) =>
                this.authService.updateProfile(user).pipe(
                    map((updatedUser) => AuthActions.updateProfileSuccess({ user: updatedUser })),
                    catchError((error) => of(AuthActions.updateProfileFailure({ error: error.message })))
                )
            )
        )
    );
}
