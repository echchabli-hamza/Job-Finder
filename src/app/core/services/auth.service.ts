import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { LoginRequest, User, UserRegistration } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3001/users';

    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) { }

    register(user: UserRegistration): Observable<User> {
       
        return this.http.get<User[]>(`${this.apiUrl}?email=${user.email}`).pipe(
            switchMap(users => {
                if (users.length > 0) {
                    return throwError(() => new Error('Email already exists'));
                }
               
                return this.http.post<User>(this.apiUrl, user);
            })
        );
    }

    login(loginRequest: LoginRequest): Observable<User> {
        return this.http.get<any[]>(`${this.apiUrl}?email=${loginRequest.email}`).pipe(
            map(users => {
                if (users.length === 0) {
                    throw new Error('User not found');
                }
                const user = users[0];
                if (user.password !== loginRequest.password) {
                    throw new Error('Invalid password');
                }
               
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword as User;
            }),
            tap(user => {
                this.storageService.saveUser(user);
            })
        );
    }

    logout(): void {
        this.storageService.clean();
    }

    getCurrentUser(): User | null {
        return this.storageService.getUser();
    }

    updateProfile(user: User): Observable<User> {
       
        return this.http.patch<User>(`${this.apiUrl}/${user.id}`, user).pipe(
            tap(updatedUser => {
                this.storageService.saveUser(updatedUser);
            })
        );
    }

    deleteAccount(userId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${userId}`).pipe(
            tap(() => this.logout())
        );
    }
}
