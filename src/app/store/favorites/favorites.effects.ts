import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { FavoritesService } from '../../core/services/favorites.service';
import { selectCurrentUser } from '../auth/auth.selectors';
import * as FavoritesActions from './favorites.actions';

@Injectable()
export class FavoritesEffects {
    private actions$ = inject(Actions);
    private favoritesService = inject(FavoritesService);
    private store = inject(Store);

    loadFavorites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.loadFavorites),
            withLatestFrom(this.store.select(selectCurrentUser)),
            switchMap(([action, user]) => {
                if (!user?.id) {
                    return of(FavoritesActions.loadFavoritesFailure({ error: 'User not authenticated' }));
                }
                return this.favoritesService.getFavorites(user.id).pipe(
                    map((favorites) => FavoritesActions.loadFavoritesSuccess({ favorites })),
                    catchError((error) => of(FavoritesActions.loadFavoritesFailure({ error: error.message })))
                );
            })
        )
    );

    addFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.addFavorite),
            switchMap(({ job, userId }) =>
                this.favoritesService.addFavorite(job, userId).pipe(
                    map((favorite) => FavoritesActions.addFavoriteSuccess({ favorite })),
                    catchError((error) => of(FavoritesActions.addFavoriteFailure({ error: error.message })))
                )
            )
        )
    );

    removeFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.removeFavorite),
            switchMap(({ id }) =>
                this.favoritesService.removeFavorite(id).pipe(
                    map(() => FavoritesActions.removeFavoriteSuccess({ id })),
                    catchError((error) => of(FavoritesActions.removeFavoriteFailure({ error: error.message })))
                )
            )
        )
    );
}