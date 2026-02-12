import { createAction, props } from '@ngrx/store';
import { Application } from '../../core/models/application.model';
import { Job } from '../../core/models/job.model';

export const loadApplications = createAction('[Applications] Load Applications');

export const loadApplicationsSuccess = createAction(
    '[Applications] Load Applications Success',
    props<{ applications: Application[] }>()
);

export const loadApplicationsFailure = createAction(
    '[Applications] Load Applications Failure',
    props<{ error: string }>()
);

export const addApplication = createAction(
    '[Applications] Add Application',
    props<{ job: Job; userId: string }>()
);

export const addApplicationSuccess = createAction(
    '[Applications] Add Application Success',
    props<{ application: Application }>()
);

export const addApplicationFailure = createAction(
    '[Applications] Add Application Failure',
    props<{ error: string }>()
);

export const updateApplicationStatus = createAction(
    '[Applications] Update Application Status',
    props<{ id: number; status: Application['status'] }>()
);

export const updateApplicationStatusSuccess = createAction(
    '[Applications] Update Application Status Success',
    props<{ application: Application }>()
);

export const updateApplicationStatusFailure = createAction(
    '[Applications] Update Application Status Failure',
    props<{ error: string }>()
);

export const removeApplication = createAction(
    '[Applications] Remove Application',
    props<{ id: number }>()
);

export const removeApplicationSuccess = createAction(
    '[Applications] Remove Application Success',
    props<{ id: number }>()
);

export const removeApplicationFailure = createAction(
    '[Applications] Remove Application Failure',
    props<{ error: string }>()
);

export const clearApplications = createAction('[Applications] Clear Applications');