export interface Favorite {
    id: number;
    userId: string; // Updated to match User.id type
    offerId: string; // Adzuna ID is string
    title: string;
    company: string;
    location: string;
    dateAdded?: string;
}
