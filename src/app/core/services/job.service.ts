import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Job, JobSearchParams, JobSearchResponse } from '../models/job.model';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private http = inject(HttpClient);
   
    private apiUrl = 'https://www.arbeitnow.com/api/job-board-api';

    searchJobs(params: JobSearchParams): Observable<Job[]> {
        const page = params.page || 1;

        return this.http.get<JobSearchResponse>(`${this.apiUrl}?page=${page}`).pipe(
            map(response => {
               
                const jobs: Job[] = response.data.map(item => ({
                    id: item.slug,
                    title: item.title,
                    company: item.company_name,
                    location: item.location,
                    description: item.description,
                    url: item.url,
                    date: item.created_at * 1000,
                    remote: item.remote,
                    tags: item.tags,
                    job_types: item.job_types
                }));

               
                const whatLower = params.what.toLowerCase();
                const whereLower = params.where.toLowerCase();

                return jobs.filter(job => {
                    const matchesWhat = !whatLower || job.title.toLowerCase().includes(whatLower);
                    const matchesWhere = !whereLower || job.location.toLowerCase().includes(whereLower);
                    return matchesWhat && matchesWhere;
                });
            })
        );
    }
}
