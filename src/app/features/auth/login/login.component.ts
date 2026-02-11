import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { login } from '../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 class="text-center mb-4">Connexion</h2>
              
              <div *ngIf="error$ | async as error" class="alert alert-danger">
                {{ error }}
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    formControlName="email"
                    [class.is-invalid]="f['email'].touched && f['email'].invalid"
                  >
                  <div class="invalid-feedback" *ngIf="f['email'].errors?.['required']">
                    L'email est requis
                  </div>
                  <div class="invalid-feedback" *ngIf="f['email'].errors?.['email']">
                    Format d'email invalide
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Mot de passe</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    formControlName="password"
                    [class.is-invalid]="f['password'].touched && f['password'].invalid"
                  >
                  <div class="invalid-feedback">
                    Le mot de passe est requis
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary" 
                    [disabled]="loginForm.invalid || (loading$ | async)"
                  >
                    <span *ngIf="loading$ | async" class="spinner-border spinner-border-sm me-2"></span>
                    Se connecter
                  </button>
                </div>

                <div class="text-center mt-3">
                  <p class="mb-0">Pas encore de compte ? <a routerLink="/register">S'inscrire</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private store = inject(Store);

    loginForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

    loading$ = this.store.select(selectAuthLoading);
    error$ = this.store.select(selectAuthError);

    get f() { return this.loginForm.controls; }

    onSubmit() {
        if (this.loginForm.valid) {
            this.store.dispatch(login({ request: this.loginForm.value }));
        }
    }
}
