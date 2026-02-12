import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { removeApplication, updateApplicationStatus } from '../../../store/applications/applications.actions';
import { selectAllApplications, selectApplicationsLoading, selectApplicationsError } from '../../../store/applications/applications.selectors';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { Application } from '../../../core/models/application.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-applications-page',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent, RouterLink],
    template: `
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-10 mx-auto">
                <div class="d-flex align-items-center justify-content-between mb-4">
                    <h1 class="display-6 mb-0">
                        <i class="bi bi-briefcase-fill text-success me-3"></i>
                        Mes Candidatures
                    </h1>
                    <span class="badge bg-success rounded-pill fs-6" *ngIf="(applications$ | async)?.length! > 0">
                        {{ (applications$ | async)?.length }}
                    </span>
                </div>
                
                <app-loading-spinner *ngIf="loading$ | async"></app-loading-spinner>
                
                <div *ngIf="error$ | async as error" class="alert alert-danger">
                    <i class="bi bi-exclamation-circle me-2"></i>
                    {{ error }}
                </div>
                
                <div *ngIf="!(loading$ | async) && !(error$ | async)">
                    <!-- Empty State -->
                    <div *ngIf="(applications$ | async)?.length === 0" class="text-center my-5 py-5">
                        <i class="bi bi-briefcase display-1 text-muted mb-3"></i>
                        <h3 class="text-muted mb-3">Aucune candidature</h3>
                        <p class="lead text-muted mb-4">Vous n'avez pas encore postulé à des offres d'emploi.</p>
                        <a routerLink="/jobs" class="btn btn-success btn-lg">
                            <i class="bi bi-search me-2"></i>
                            Parcourir les offres
                        </a>
                    </div>
                    
                    <!-- Applications List -->
                    <div class="row row-cols-1 g-4" *ngIf="(applications$ | async)?.length! > 0">
                        <div *ngFor="let application of applications$ | async" class="col">
                            <div class="card shadow-sm hover-card">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-md-7">
                                            <h5 class="card-title text-primary mb-2">{{ application.title }}</h5>
                                            
                                            <h6 class="card-subtitle text-muted mb-2">
                                                <i class="bi bi-building me-2"></i>
                                                {{ application.company }}
                                            </h6>
                                            
                                            <p class="card-text text-muted mb-2">
                                                <i class="bi bi-geo-alt me-2"></i>
                                                {{ application.location }}
                                            </p>
                                            
                                            <small class="text-muted">
                                                <i class="bi bi-calendar me-1"></i>
                                                Postulé le {{ application.appliedDate | date:'dd MMMM yyyy':'':'fr' }}
                                            </small>
                                        </div>
                                        
                                        <div class="col-md-3 text-center">
                                            <span class="badge fs-6 p-2" [ngClass]="getStatusBadgeClass(application.status)">
                                                <i class="bi" [ngClass]="getStatusIcon(application.status)"></i>
                                                {{ getStatusLabel(application.status) }}
                                            </span>
                                        </div>
                                        
                                        <div class="col-md-2 text-end">
                                            <div class="dropdown">
                                                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                                                        type="button" data-bs-toggle="dropdown">
                                                    Actions
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li>
                                                        <a [href]="getJobUrl(application.offerId)" target="_blank" class="dropdown-item">
                                                            <i class="bi bi-eye me-2"></i>Voir l'offre
                                                        </a>
                                                    </li>
                                                    <li><hr class="dropdown-divider"></li>
                                                    <li>
                                                        <button class="dropdown-item text-danger" (click)="removeApplication(application)">
                                                            <i class="bi bi-trash me-2"></i>Supprimer
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Back to Jobs Button -->
                    <div class="text-center mt-5" *ngIf="(applications$ | async)?.length! > 0">
                        <a routerLink="/jobs" class="btn btn-outline-success">
                            <i class="bi bi-arrow-left me-2"></i>
                            Retour aux offres d'emploi
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    styles: [`
        .hover-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
            transition: all .3s ease-in-out;
        }
        
        .hover-card {
            transition: all .3s ease-in-out;
        }
        
        .display-6 i {
            font-size: 0.8em;
        }
        
        .badge {
            min-width: 2.5rem;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `]
})
export class ApplicationsPageComponent implements OnInit {
    private store = inject(Store);

    applications$ = this.store.select(selectAllApplications);
    loading$ = this.store.select(selectApplicationsLoading);
    error$ = this.store.select(selectApplicationsError);
    user$ = this.store.select(selectCurrentUser);

    ngOnInit(): void {
        // Applications are automatically loaded after login via AuthEffects
    }

    removeApplication(application: Application): void {
        if (confirm(`Êtes-vous sûr de vouloir supprimer votre candidature pour "${application.title}" ?`)) {
            this.store.dispatch(removeApplication({ id: application.id }));
        }
    }

    getStatusBadgeClass(status: Application['status']): string {
        const classes = {
            'applied': 'bg-primary',
            'in_review': 'bg-warning', 
            'interview': 'bg-info',
            'accepted': 'bg-success',
            'rejected': 'bg-danger'
        };
        return classes[status] || 'bg-secondary';
    }

    getStatusIcon(status: Application['status']): string {
        const icons = {
            'applied': 'bi-hourglass-split',
            'in_review': 'bi-eye-fill',
            'interview': 'bi-people-fill',
            'accepted': 'bi-check-circle-fill',
            'rejected': 'bi-x-circle-fill'
        };
        return icons[status] || 'bi-question-circle';
    }

    getStatusLabel(status: Application['status']): string {
        const labels = {
            'applied': 'Postulé',
            'in_review': 'En examen',
            'interview': 'Entretien',
            'accepted': 'Accepté',
            'rejected': 'Refusé'
        };
        return labels[status] || status;
    }

    getJobUrl(offerId: string): string {
        return `https://arbeitnow.com/view/${offerId}`;
    }
}