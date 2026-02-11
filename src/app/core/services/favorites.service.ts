import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import { Job } from '../models/job.model';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3001/favoritesOffers';

    getFavorites(userId: number): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`);
    }

    addFavorite(job: Job, userId: number): Observable<Favorite> {
        const favorite: Omit<Favorite, 'id'> = {
            userId,
            offerId: job.id,
            title: job.title,
            company: job.company.display_name,
            location: job.location.display_name,
            dateAdded: new Date().toISOString()
        };
        return this.http.post<Favorite>(this.apiUrl, favorite);
    }

    removeFavorite(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    checkIfFavorite(userId: number, offerId: string): Observable<boolean> {
        return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`).pipe(
            map(favorites => favorites.length > 0)
        );
    }
}
