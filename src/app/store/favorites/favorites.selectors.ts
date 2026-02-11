import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState, selectAll } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
    selectFavoritesState,
    selectAll
);

export const selectFavoritesLoading = createSelector(
    selectFavoritesState,
    (state) => state.loading
);

export const selectFavoritesError = createSelector(
    selectFavoritesState,
    (state) => state.error
);

export const selectIsFavorite = (offerId: string) => createSelector(
    selectAllFavorites,
    (favorites) => favorites.some(f => f.offerId === offerId)
);
