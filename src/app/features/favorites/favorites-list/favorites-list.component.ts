import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { removeFavorite } from '../../../store/favorites/favorites.actions';
import { selectAllFavorites, selectFavoritesLoading, selectFavoritesError } from '../../../store/favorites/favorites.selectors';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { Favorite } from '../../../core/models/favorite.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-favorites-list',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent],
    template: `
    <div class="mt-4">
        <h3 class="mb-3">
            <i class="bi bi-heart-fill text-danger me-2"></i>
            Mes Offres Favorites
        </h3>
        
        <app-loading-spinner *ngIf="loading$ | async"></app-loading-spinner>
        
        <div *ngIf="error$ | async as error" class="alert alert-danger">
            {{ error }}
        </div>
        
        <div *ngIf="!(loading$ | async) && !(error$ | async)">
            <div *ngIf="(favorites$ | async)?.length === 0" class="alert alert-info text-center">
                <i class="bi bi-heart display-4 text-muted"></i>
                <p class="mb-0 mt-2">Vous n'avez pas encore d'offres favorites.</p>
                <small class="text-muted">Parcourez les offres et cliquez sur le cœur pour les ajouter ici.</small>
            </div>
            
            <div class="row row-cols-1 row-cols-md-2 g-3" *ngIf="(favorites$ | async)?.length! > 0">
                <div *ngFor="let favorite of favorites$ | async" class="col">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title text-primary mb-0">{{ favorite.title }}</h5>
                                <button 
                                    class="btn btn-sm btn-outline-danger"
                                    (click)="removeFavorite(favorite)"
                                    title="Retirer des favoris">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                            
                            <h6 class="card-subtitle mb-2 text-muted">
                                <i class="bi bi-building me-1"></i> {{ favorite.company }}
                            </h6>
                            
                            <p class="card-text text-muted small mb-2">
                                <i class="bi bi-geo-alt me-1"></i> {{ favorite.location }}
                            </p>
                            
                            <div class="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                                <small class="text-muted">
                                    Ajouté le {{ favorite.dateAdded | date:'dd/MM/yyyy' }}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    styles: [`
        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 .25rem .75rem rgba(0,0,0,.15)!important;
            transition: all .3s ease-in-out;
        }
    `]
})
export class FavoritesListComponent implements OnInit {
    private store = inject(Store);

    favorites$ = this.store.select(selectAllFavorites);
    loading$ = this.store.select(selectFavoritesLoading);
    error$ = this.store.select(selectFavoritesError);
    user$ = this.store.select(selectCurrentUser);

    ngOnInit(): void {
       
       
    }

    removeFavorite(favorite: Favorite): void {
        if (confirm('Êtes-vous sûr de vouloir retirer cette offre de vos favoris ?')) {
            this.store.dispatch(removeFavorite({ id: favorite.id }));
        }
    }
}