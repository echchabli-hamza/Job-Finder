import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Favorite } from '../../core/models/favorite.model';
import * as FavoritesActions from './favorites.actions';

export interface FavoritesState extends EntityState<Favorite> {
    loading: boolean;
    error: string | null;
}

export const adapter: EntityAdapter<Favorite> = createEntityAdapter<Favorite>();

export const initialState: FavoritesState = adapter.getInitialState({
    loading: false,
    error: null
});

export const favoritesReducer = createReducer(
    initialState,

    on(FavoritesActions.loadFavorites, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) =>
        adapter.setAll(favorites, { ...state, loading: false })
    ),
    on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(FavoritesActions.addFavorite, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) =>
        adapter.addOne(favorite, { ...state, loading: false })
    ),
    on(FavoritesActions.addFavoriteFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(FavoritesActions.removeFavorite, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(FavoritesActions.removeFavoriteSuccess, (state, { id }) =>
        adapter.removeOne(id, { ...state, loading: false })
    ),
    on(FavoritesActions.removeFavoriteFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = adapter.getSelectors();
