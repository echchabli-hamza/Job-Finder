import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Job, JobSearchParams, JobSearchResponse } from '../models/job.model';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private http = inject(HttpClient);
    // Using Adzuna API
    private appId = '236d2673';
    private appKey = 'c7e8417c800877a5ea759e6c107293b2';
    private apiUrl = 'https://api.adzuna.com/v1/api/jobs/fr/search';

    searchJobs(params: JobSearchParams): Observable<JobSearchResponse> {
        const page = params.page || 1;
        const what = encodeURIComponent(params.what);
        const where = encodeURIComponent(params.where);

        const url = `${this.apiUrl}/${page}?app_id=${this.appId}&app_key=${this.appKey}&what=${what}&where=${where}&content-type=application/json`;

        return this.http.get<JobSearchResponse>(url).pipe(
            map(response => {
                // Filter results where title strictly contains the keywords (case insensitive)
                // Adzuna search is broader, so we refine it as per requirements
                const keywords = params.what.toLowerCase().split(' ');
                const filteredResults = response.results.filter(job => {
                    const title = job.title.toLowerCase();
                    return keywords.every(keyword => title.includes(keyword));
                });

                // Return filtered results but keep total count from API (or adjust if needed)
                // Adjusting count might be misleading if pagination relies on API count
                // For strict requirement, we serve filtered list. 
                // Note: Pagination with client-side filtering on server-side pages is tricky.
                // We will return the filtered subset.
                return {
                    ...response,
                    results: filteredResults
                };
            })
        );
    }
}
