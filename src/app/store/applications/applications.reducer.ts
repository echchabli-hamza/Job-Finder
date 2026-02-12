import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Application } from '../../core/models/application.model';
import * as ApplicationsActions from './applications.actions';

export interface ApplicationsState extends EntityState<Application> {
    loading: boolean;
    error: string | null;
}

export const adapter: EntityAdapter<Application> = createEntityAdapter<Application>();

export const initialState: ApplicationsState = adapter.getInitialState({
    loading: false,
    error: null
});

export const applicationsReducer = createReducer(
    initialState,

    on(ApplicationsActions.loadApplications, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ApplicationsActions.loadApplicationsSuccess, (state, { applications }) =>
        adapter.setAll(applications, { ...state, loading: false })
    ),
    on(ApplicationsActions.loadApplicationsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(ApplicationsActions.addApplication, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ApplicationsActions.addApplicationSuccess, (state, { application }) =>
        adapter.addOne(application, { ...state, loading: false })
    ),
    on(ApplicationsActions.addApplicationFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(ApplicationsActions.updateApplicationStatus, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ApplicationsActions.updateApplicationStatusSuccess, (state, { application }) =>
        adapter.upsertOne(application, { ...state, loading: false })
    ),
    on(ApplicationsActions.updateApplicationStatusFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(ApplicationsActions.removeApplication, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ApplicationsActions.removeApplicationSuccess, (state, { id }) =>
        adapter.removeOne(id, { ...state, loading: false })
    ),
    on(ApplicationsActions.removeApplicationFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(ApplicationsActions.clearApplications, (state) =>
        adapter.removeAll({ ...state, loading: false, error: null })
    )
);

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = adapter.getSelectors();