import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { register } from '../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 class="text-center mb-4">Inscription</h2>
              
              <div *ngIf="error$ | async as error" class="alert alert-danger">
                {{ error }}
              </div>

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="row mb-3">
                  <div class="col">
                    <label for="firstName" class="form-label">Prénom</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="firstName" 
                      formControlName="firstName"
                      [class.is-invalid]="f['firstName'].touched && f['firstName'].invalid"
                    >
                    <div class="invalid-feedback">
                      Le prénom est requis
                    </div>
                  </div>
                  <div class="col">
                    <label for="lastName" class="form-label">Nom</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="lastName" 
                      formControlName="lastName"
                      [class.is-invalid]="f['lastName'].touched && f['lastName'].invalid"
                    >
                    <div class="invalid-feedback">
                      Le nom est requis
                    </div>
                  </div>
                </div>

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
                  <div class="invalid-feedback" *ngIf="f['password'].errors?.['required']">
                    Le mot de passe est requis
                  </div>
                  <div class="invalid-feedback" *ngIf="f['password'].errors?.['minlength']">
                    Le mot de passe doit contenir au moins 6 caractères
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary" 
                    [disabled]="registerForm.invalid || (loading$ | async)"
                  >
                    <span *ngIf="loading$ | async" class="spinner-border spinner-border-sm me-2"></span>
                    S'inscrire
                  </button>
                </div>

                <div class="text-center mt-3">
                  <p class="mb-0">Déjà un compte ? <a routerLink="/login">Se connecter</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private store = inject(Store);

    registerForm: FormGroup = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    loading$ = this.store.select(selectAuthLoading);
    error$ = this.store.select(selectAuthError);

    get f() { return this.registerForm.controls; }

    onSubmit() {
        if (this.registerForm.valid) {
            this.store.dispatch(register({ request: this.registerForm.value }));
        }
    }
}
