export interface Job {
    id: string; // Adzuna uses string IDs
    title: string;
    company: {
        display_name: string;
    };
    location: {
        display_name: string;
    };
    description: string;
    created: string; // ISO date string
    redirect_url: string;
    salary_min?: number;
    salary_max?: number;
    contract_type?: string;
    __seen?: boolean; // For tracking
}

export interface JobSearchResponse {
    results: Job[];
    count: number;
    mean_salary?: number;
}

export interface JobSearchParams {
    what: string;
    where: string;
    page: number;
}
