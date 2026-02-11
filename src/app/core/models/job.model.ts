export interface Job {
    id: string; // "slug" from Arbeitnow
    title: string;
    company: string; // "company_name" from Arbeitnow
    location: string;
    description: string;
    url: string; // "url" from Arbeitnow
    date: number; // "created_at" timestamp
    remote: boolean;
    tags: string[];
    job_types: string[];
}

export interface JobSearchResponse {
    data: ArbeitnowJob[];
    links: any;
    meta: any;
}

export interface ArbeitnowJob {
    slug: string;
    company_name: string;
    title: string;
    description: string;
    remote: boolean;
    url: string;
    tags: string[];
    job_types: string[];
    location: string;
    created_at: number;
}

export interface JobSearchParams {
    what: string;
    where: string;
    page: number;
}
