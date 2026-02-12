import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../../../core/services/job.service';
import { Job, JobSearchParams } from '../../../core/models/job.model';
import { JobSearchComponent } from '../job-search/job-search.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated, selectCurrentUser } from '../../../store/auth/auth.selectors';
import { addFavorite } from '../../../store/favorites/favorites.actions';
import { selectAllFavorites } from '../../../store/favorites/favorites.selectors';
import { addApplication } from '../../../store/applications/applications.actions';
import { selectAllApplications } from '../../../store/applications/applications.selectors';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-job-list',
    standalone: true,
    imports: [CommonModule, JobSearchComponent, LoadingSpinnerComponent, PaginationComponent],
    template: `
    <div class="container mt-4">
      <h1 class="mb-4 text-center">Trouvez votre prochain emploi</h1>
      
      <app-job-search (search)="onSearch($event)"></app-job-search>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      
      <div *ngIf="!loading && hasSearched">
        <h3 class="mb-4">{{ jobs.length }} offres trouvées</h3>
        
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div *ngFor="let job of jobs" class="col">
            <div class="card h-100 shadow-sm hover-shadow transition-all">
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title text-primary mb-0">{{ job.title }}</h5>
                  <span *ngIf="job.remote" class="badge bg-success rounded-pill">Remote</span>
                </div>
                
                <h6 class="card-subtitle mb-2 text-muted">
                  <i class="bi bi-building me-1"></i> {{ job.company }}
                </h6>
                <p class="card-text text-muted small mb-2">
                  <i class="bi bi-geo-alt me-1"></i> {{ job.location }}
                </p>
                <div class="mb-3">
                  <span *ngFor="let tag of job.tags.slice(0, 3)" class="badge bg-light text-dark me-1 border">{{ tag }}</span>
                </div>
                
                <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                   <small class="text-muted">{{ job.date | date:'dd/MM/yyyy' }}</small>
                   <div class="d-flex gap-2">
                      <a [href]="job.url" target="_blank" class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-eye me-1"></i>Voir
                      </a>
                      <ng-container *ngIf="isAuthenticated$ | async">
                        <button 
                          class="btn btn-sm" 
                          [class.btn-danger]="isJobFavorite(job.id)"
                          [class.btn-outline-danger]="!isJobFavorite(job.id)"
                          (click)="toggleFavorite(job)" 
                          title="Ajouter aux favoris">
                          <i class="bi" [class.bi-heart-fill]="isJobFavorite(job.id)" [class.bi-heart]="!isJobFavorite(job.id)"></i>
                        </button>
                        <button 
                          class="btn btn-sm" 
                          [class.btn-success]="hasApplied(job.id)"
                          [class.btn-outline-success]="!hasApplied(job.id)"
                          [disabled]="hasApplied(job.id)"
                          (click)="applyToJob(job)" 
                          title="Postuler">
                          <i class="bi bi-briefcase me-1"></i>
                          {{ hasApplied(job.id) ? 'Postulé' : 'Postule' }}
                        </button>
                      </ng-container>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="jobs.length > 0" class="mt-5">
           <div class="d-flex justify-content-center gap-2">
              <button class="btn btn-outline-secondary" [disabled]="currentParams.page <= 1" (click)="onPageChange(currentParams.page - 1)">Précédent</button>
              <span class="align-self-center">Page {{ currentParams.page }}</span>
              <button class="btn btn-outline-secondary" (click)="onPageChange(currentParams.page + 1)">Suivant</button>
           </div>
        </div>
      </div>

      <div *ngIf="!loading && hasSearched && jobs.length === 0" class="alert alert-info text-center mt-4">
        Aucune offre ne correspond à vos critères sur cette page. Essayez d'autres mots-clés ou naviguez vers d'autres pages.
      </div>
       
       <div *ngIf="!hasSearched && !loading" class="text-center mt-5 text-muted">
          <i class="bi bi-search display-1"></i>
          <p class="lead mt-3">Lancez une recherche pour voir les offres d'emploi.</p>
       </div>
    </div>
  `,
    styles: [`
    .hover-shadow:hover {
      transform: translateY(-5px);
      box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
      transition: all .3s ease-in-out;
    }
    .transition-all {
       transition: all .3s ease-in-out;
    }
  `]
})
export class JobListComponent implements OnInit {
    private jobService = inject(JobService);
    private store = inject(Store);

    jobs: Job[] = [];
    loading = false;
    hasSearched = false;

    currentParams: JobSearchParams = {
        what: '',
        where: '',
        page: 1
    };

    isAuthenticated$ = this.store.select(selectIsAuthenticated);
    currentUser$ = this.store.select(selectCurrentUser);
    favorites$ = this.store.select(selectAllFavorites);
    applications$ = this.store.select(selectAllApplications);

    ngOnInit(): void {
        // Load jobs on component initialization
        this.loadJobs();
        
        // Note: Favorites are loaded automatically after login via AuthEffects
        // No need to load them here for anonymous users
    }

    isJobFavorite(jobId: string): boolean {
        let isFavorite = false;
        this.favorites$.subscribe(favorites => {
            isFavorite = favorites.some(fav => fav.offerId === jobId);
        }).unsubscribe();
        return isFavorite;
    }

    hasApplied(jobId: string): boolean {
        let hasApplied = false;
        this.applications$.subscribe(applications => {
            hasApplied = applications.some(app => app.offerId === jobId);
        }).unsubscribe();
        return hasApplied;
    }

    toggleFavorite(job: Job): void {
        this.currentUser$.subscribe(user => {
            if (user) {
                // First add to NgRx store, then it will sync to JSON server via effects
                this.store.dispatch(addFavorite({ job, userId: user.id }));
            }
        }).unsubscribe();
    }

    applyToJob(job: Job): void {
        this.currentUser$.subscribe(user => {
            if (user && !this.hasApplied(job.id)) {
                // First add to NgRx store, then it will sync to JSON server via effects
                this.store.dispatch(addApplication({ job, userId: user.id }));
            }
        }).unsubscribe();
    }

    onSearch(params: JobSearchParams): void {
        this.currentParams = params;
        this.loadJobs();
    }

    onPageChange(page: number): void {
        this.currentParams.page = page;
        this.loadJobs();
    }

    private loadJobs(): void {
        this.loading = true;
        this.hasSearched = true;

        this.jobService.searchJobs(this.currentParams).subscribe({
            next: (jobs) => {
                this.jobs = jobs;
                this.loading = false;
                window.scrollTo(0, 0);
            },
            error: (err) => {
                console.error('Error loading jobs', err);
                this.loading = false;
                this.jobs = [];
            }
        });
    }
}
