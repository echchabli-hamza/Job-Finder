import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { removeFavorite } from '../../../store/favorites/favorites.actions';
import { selectAllFavorites, selectFavoritesLoading, selectFavoritesError } from '../../../store/favorites/favorites.selectors';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { Favorite } from '../../../core/models/favorite.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-favorites-page',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent, RouterLink],
    template: `
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-8 mx-auto">
                <div class="d-flex align-items-center justify-content-between mb-4">
                    <h1 class="display-6 mb-0">
                        <i class="bi bi-heart-fill text-danger me-3"></i>
                        Mes Offres Favorites
                    </h1>
                    <span class="badge bg-primary rounded-pill fs-6" *ngIf="(favorites$ | async)?.length! > 0">
                        {{ (favorites$ | async)?.length }}
                    </span>
                </div>
                
                <app-loading-spinner *ngIf="loading$ | async"></app-loading-spinner>
                
                <div *ngIf="error$ | async as error" class="alert alert-danger">
                    <i class="bi bi-exclamation-circle me-2"></i>
                    {{ error }}
                </div>
                
                <div *ngIf="!(loading$ | async) && !(error$ | async)">
                    <!-- Empty State -->
                    <div *ngIf="(favorites$ | async)?.length === 0" class="text-center my-5 py-5">
                        <i class="bi bi-heart display-1 text-muted mb-3"></i>
                        <h3 class="text-muted mb-3">Aucune offre favorite</h3>
                        <p class="lead text-muted mb-4">Vous n'avez pas encore ajouté d'offres à vos favoris.</p>
                        <a routerLink="/jobs" class="btn btn-primary btn-lg">
                            <i class="bi bi-search me-2"></i>
                            Parcourir les offres
                        </a>
                    </div>
                    
                    <!-- Favorites List -->
                    <div class="row row-cols-1 g-4" *ngIf="(favorites$ | async)?.length! > 0">
                        <div *ngFor="let favorite of favorites$ | async" class="col">
                            <div class="card shadow-sm hover-card">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-md-8">
                                            <h5 class="card-title text-primary mb-2">{{ favorite.title }}</h5>
                                            
                                            <h6 class="card-subtitle text-muted mb-2">
                                                <i class="bi bi-building me-2"></i>
                                                {{ favorite.company }}
                                            </h6>
                                            
                                            <p class="card-text text-muted mb-2">
                                                <i class="bi bi-geo-alt me-2"></i>
                                                {{ favorite.location }}
                                            </p>
                                            
                                            <small class="text-muted">
                                                <i class="bi bi-calendar me-1"></i>
                                                Ajouté le {{ favorite.dateAdded | date:'dd MMMM yyyy':'':'fr' }}
                                            </small>
                                        </div>
                                        
                                        <div class="col-md-4 text-md-end">
                                            <div class="d-flex flex-column gap-2 d-md-block">
                                                <a 
                                                    [href]="getJobUrl(favorite.offerId)"
                                                    target="_blank"
                                                    class="btn btn-outline-primary btn-sm me-md-2">
                                                    <i class="bi bi-eye me-1"></i>
                                                    Voir l'offre
                                                </a>
                                                <button 
                                                    class="btn btn-outline-danger btn-sm"
                                                    (click)="removeFavorite(favorite)"
                                                    title="Retirer des favoris">
                                                    <i class="bi bi-trash me-1"></i>
                                                    Retirer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Back to Jobs Button -->
                    <div class="text-center mt-5" *ngIf="(favorites$ | async)?.length! > 0">
                        <a routerLink="/jobs" class="btn btn-outline-primary">
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
            transform: translateY(-5px);
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
export class FavoritesPageComponent implements OnInit {
    private store = inject(Store);

    favorites$ = this.store.select(selectAllFavorites);
    loading$ = this.store.select(selectFavoritesLoading);
    error$ = this.store.select(selectFavoritesError);
    user$ = this.store.select(selectCurrentUser);

    ngOnInit(): void {
        // Favorites are automatically loaded after login via AuthEffects
        // No need to dispatch loadFavorites here
    }

    removeFavorite(favorite: Favorite): void {
        if (confirm(`Êtes-vous sûr de vouloir retirer "${favorite.title}" de vos favoris ?`)) {
            this.store.dispatch(removeFavorite({ id: favorite.id }));
        }
    }

    getJobUrl(offerId: string): string {
        return `https://arbeitnow.com/view/${offerId}`;
    }
}