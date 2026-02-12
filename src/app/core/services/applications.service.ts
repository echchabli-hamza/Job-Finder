import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/application.model';
import { Job } from '../models/job.model';

@Injectable({
    providedIn: 'root'
})
export class ApplicationsService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3001/applications';

    getApplications(userId: string): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}`);
    }

    addApplication(job: Job, userId: string): Observable<Application> {
        const application: Omit<Application, 'id'> = {
            userId,
            offerId: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            appliedDate: new Date().toISOString(),
            status: 'applied'
        };
        return this.http.post<Application>(this.apiUrl, application);
    }

    updateApplicationStatus(id: number, status: Application['status']): Observable<Application> {
        return this.http.patch<Application>(`${this.apiUrl}/${id}`, { status });
    }

    removeApplication(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    checkIfApplied(userId: string, offerId: string): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}&offerId=${offerId}`);
    }
}