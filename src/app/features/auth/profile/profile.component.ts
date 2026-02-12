import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { updateProfile } from '../../../store/auth/auth.actions';
import { selectCurrentUser, selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';
import { User } from '../../../core/models/user.model';
import { take } from 'rxjs/operators';
import { FavoritesListComponent } from '../../favorites/favorites-list/favorites-list.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FavoritesListComponent],
    template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 class="text-center mb-4">Mon Profil</h2>
              
              <div *ngIf="message" class="alert alert-success">
                {{ message }}
              </div>
              
              <div *ngIf="error$ | async as error" class="alert alert-danger">
                {{ error }}
              </div>

              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
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

                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary" 
                    [disabled]="profileForm.invalid || (loading$ | async)"
                  >
                    <span *ngIf="loading$ | async" class="spinner-border spinner-border-sm me-2"></span>
                    Mettre à jour
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <app-favorites-list></app-favorites-list>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
    private fb = inject(FormBuilder);
    private store = inject(Store);

    profileForm: FormGroup = this.fb.group({
        id: [null],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
    });

    loading$ = this.store.select(selectAuthLoading);
    error$ = this.store.select(selectAuthError);
    currentUser$ = this.store.select(selectCurrentUser);
    message = '';

    get f() { return this.profileForm.controls; }

    ngOnInit() {
        this.currentUser$.pipe(take(1)).subscribe(user => {
            if (user) {
                this.profileForm.patchValue(user);
            }
        });
    }

    onSubmit() {
        if (this.profileForm.valid) {
            this.store.dispatch(updateProfile({ user: this.profileForm.value }));
            this.message = 'Profil mis à jour avec succès';
            setTimeout(() => this.message = '', 3000);
        }
    }
}
