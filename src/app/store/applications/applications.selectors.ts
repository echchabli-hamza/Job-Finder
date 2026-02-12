import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationsState, adapter } from './applications.reducer';

export const selectApplicationsState = createFeatureSelector<ApplicationsState>('applications');

export const {
    selectIds: selectApplicationIds,
    selectEntities: selectApplicationEntities,
    selectAll: selectAllApplications,
    selectTotal: selectApplicationsTotal,
} = adapter.getSelectors(selectApplicationsState);

export const selectApplicationsLoading = createSelector(
    selectApplicationsState,
    (state) => state.loading
);

export const selectApplicationsError = createSelector(
    selectApplicationsState,
    (state) => state.error
);

export const selectIsAlreadyApplied = (offerId: string) => createSelector(
    selectAllApplications,
    (applications) => applications.some(app => app.offerId === offerId)
);

export const selectApplicationsByStatus = (status: string) => createSelector(
    selectAllApplications,
    (applications) => applications.filter(app => app.status === status)
);