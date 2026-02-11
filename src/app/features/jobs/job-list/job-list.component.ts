import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../../../core/services/job.service';
import { Job, JobSearchParams } from '../../../core/models/job.model';
import { JobSearchComponent } from '../job-search/job-search.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../../store/auth/auth.selectors';
// TODO: Import favorites actions
// import { addFavorite } from '../../../../store/favorites/favorites.actions';

@Component({
    selector: 'app-job-list',
    standalone: true,
    imports: [CommonModule, JobSearchComponent, LoadingSpinnerComponent, PaginationComponent],
    template: `
    <div class="container mt-4">
      <h1 class="mb-4">Trouver un emploi</h1>
      
      <app-job-search (search)="onSearch($event)"></app-job-search>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      
      <div *ngIf="!loading && jobs.length > 0">
        <h3 class="mb-3">{{ totalResults }} offres trouvées</h3>
        
        <div class="list-group mb-4">
          <div *ngFor="let job of jobs" class="list-group-item list-group-item-action flex-column align-items-start p-4 mb-3 border rounded shadow-sm">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1 text-primary">{{ job.title }}</h5>
              <small class="text-muted">{{ job.created | date:'dd/MM/yyyy' }}</small>
            </div>
            <p class="mb-1 fw-bold">{{ job.company.display_name }} - {{ job.location.display_name }}</p>
            <p class="mb-1">{{ job.description | slice:0:200 }}...</p>
            <div class="mt-3">
              <a [href]="job.redirect_url" target="_blank" class="btn btn-sm btn-outline-primary me-2">Voir l'offre</a>
              
              <ng-container *ngIf="isAuthenticated$ | async">
                <button class="btn btn-sm btn-outline-danger me-2" (click)="addToFavorites(job)">
                  <i class="bi bi-heart"></i> Favoris
                </button>
                <button class="btn btn-sm btn-outline-secondary" (click)="trackApplication(job)">
                  <i class="bi bi-briefcase"></i> Suivre
                </button>
              </ng-container>
            </div>
          </div>
        </div>

        <app-pagination 
          [currentPage]="currentParams.page" 
          [totalPages]="totalPages" 
          (pageChange)="onPageChange($event)">
        </app-pagination>
      </div>

      <div *ngIf="!loading && hasSearched && jobs.length === 0" class="alert alert-info text-center">
        Aucune offre ne correspond à vos critères. Essayez d'autres mots-clés.
      </div>
    </div>
  `
})
export class JobListComponent {
    private jobService = inject(JobService);
    private store = inject(Store);

    jobs: Job[] = [];
    loading = false;
    hasSearched = false;
    totalResults = 0;
    totalPages = 0;

    currentParams: JobSearchParams = {
        what: '',
        where: '',
        page: 1
    };

    isAuthenticated$ = this.store.select(selectIsAuthenticated);

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
            next: (response) => {
                this.jobs = response.results;
                // Adzuna API handling for total results might be tricky with client filter
                // We'll just assume there might be more pages if we got results
                this.totalResults = response.count || this.jobs.length;
                this.totalPages = Math.ceil(this.totalResults / 10); // Assuming 10 items per page
                this.loading = false;
                // Scroll to top
                window.scrollTo(0, 0);
            },
            error: (err) => {
                console.error('Error loading jobs', err);
                this.loading = false;
                this.jobs = [];
            }
        });
    }

    addToFavorites(job: Job): void {
        // TODO: Implement favorites logic
        console.log('Add to favorites', job);
    }

    trackApplication(job: Job): void {
        // TODO: Implement application tracking logic
        console.log('Track application', job);
    }
}
