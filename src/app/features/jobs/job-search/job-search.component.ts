import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobSearchParams } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <form (ngSubmit)="onSearch()">
          <div class="row g-3">
            <div class="col-md-5">
              <label for="what" class="form-label visually-hidden">Quoi ?</label>
              <input 
                type="text" 
                class="form-control" 
                id="what" 
                placeholder="Titre du poste, mots-clés..." 
                [(ngModel)]="searchParams.what"
                name="what"
              >
            </div>
            <div class="col-md-5">
              <label for="where" class="form-label visually-hidden">Où ?</label>
              <input 
                type="text" 
                class="form-control" 
                id="where" 
                placeholder="Ville, région..." 
                [(ngModel)]="searchParams.where"
                name="where"
              >
            </div>
            <div class="col-md-2">
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Rechercher</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})
export class JobSearchComponent {
  @Output() search = new EventEmitter<JobSearchParams>();

  searchParams: JobSearchParams = {
    what: '',
    where: '',
    page: 1
  };

  onSearch(): void {
    // Reset page to 1 on new search
    this.searchParams.page = 1;
    this.search.emit({ ...this.searchParams });
  }
}
