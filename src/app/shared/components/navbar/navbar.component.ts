import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser, selectIsAuthenticated } from '../../../store/auth/auth.selectors';
import { logout } from '../../../store/auth/auth.actions';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">JobFinder</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/jobs" routerLinkActive="active">Offres</a>
            </li>
            <ng-container *ngIf="isAuthenticated$ | async">
              <li class="nav-item">
                <a class="nav-link" routerLink="/favorites" routerLinkActive="active">Favoris</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/applications" routerLinkActive="active">Candidatures</a>
              </li>
            </ng-container>
          </ul>
          <ul class="navbar-nav">
            <ng-container *ngIf="!(isAuthenticated$ | async)">
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">Connexion</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/register" routerLinkActive="active">Inscription</a>
              </li>
            </ng-container>
            <ng-container *ngIf="user$ | async as user">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  {{ user.firstName }} {{ user.lastName }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" routerLink="/profile">Mon profil</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><button class="dropdown-item" (click)="onLogout()">Déconnexion</button></li>
                </ul>
              </li>
            </ng-container>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
    private store = inject(Store);

    user$ = this.store.select(selectCurrentUser);
    isAuthenticated$ = this.store.select(selectIsAuthenticated);

    onLogout() {
        this.store.dispatch(logout());
    }
}
