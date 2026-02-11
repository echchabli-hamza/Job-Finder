import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly USER_KEY = 'auth-user';

    constructor() { }

    clean(): void {
        localStorage.clear();
    }

    public saveUser(user: User): void {
        localStorage.removeItem(this.USER_KEY);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    public getUser(): User | null {
        const user = localStorage.getItem(this.USER_KEY);
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }

    public isLoggedIn(): boolean {
        const user = localStorage.getItem(this.USER_KEY);
        return !!user;
    }
}
