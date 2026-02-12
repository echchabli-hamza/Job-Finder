import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState, adapter } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const {
    selectIds: selectFavoriteIds,
    selectEntities: selectFavoriteEntities,
    selectAll: selectAllFavorites,
    selectTotal: selectFavoritesTotal,
} = adapter.getSelectors(selectFavoritesState);

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
