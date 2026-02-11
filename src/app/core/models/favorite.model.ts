export interface Favorite {
    id: number;
    userId: number;
    offerId: string; // Adzuna ID is string
    title: string;
    company: string;
    location: string;
    dateAdded?: string;
}
