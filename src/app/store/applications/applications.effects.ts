import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ApplicationsService } from '../../core/services/applications.service';
import { selectCurrentUser } from '../auth/auth.selectors';
import * as ApplicationsActions from './applications.actions';

@Injectable()
export class ApplicationsEffects {
    private actions$ = inject(Actions);
    private applicationsService = inject(ApplicationsService);
    private store = inject(Store);

    loadApplications$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationsActions.loadApplications),
            withLatestFrom(this.store.select(selectCurrentUser)),
            switchMap(([action, user]) => {
                if (!user?.id) {
                    return of(ApplicationsActions.loadApplicationsFailure({ error: 'User not authenticated' }));
                }
                return this.applicationsService.getApplications(user.id).pipe(
                    map((applications) => ApplicationsActions.loadApplicationsSuccess({ applications })),
                    catchError((error) => of(ApplicationsActions.loadApplicationsFailure({ error: error.message })))
                );
            })
        )
    );

    addApplication$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationsActions.addApplication),
            switchMap(({ job, userId }) =>
                this.applicationsService.addApplication(job, userId).pipe(
                    map((application) => ApplicationsActions.addApplicationSuccess({ application })),
                    catchError((error) => of(ApplicationsActions.addApplicationFailure({ error: error.message })))
                )
            )
        )
    );

    updateApplicationStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationsActions.updateApplicationStatus),
            switchMap(({ id, status }) =>
                this.applicationsService.updateApplicationStatus(id, status).pipe(
                    map((application) => ApplicationsActions.updateApplicationStatusSuccess({ application })),
                    catchError((error) => of(ApplicationsActions.updateApplicationStatusFailure({ error: error.message })))
                )
            )
        )
    );

    removeApplication$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplicationsActions.removeApplication),
            switchMap(({ id }) =>
                this.applicationsService.removeApplication(id).pipe(
                    map(() => ApplicationsActions.removeApplicationSuccess({ id })),
                    catchError((error) => of(ApplicationsActions.removeApplicationFailure({ error: error.message })))
                )
            )
        )
    );
}