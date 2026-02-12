export interface Application {
    id: number;
    userId: string;
    offerId: string;
    title: string;
    company: string;
    location: string;
    appliedDate: string;
    status: 'applied' | 'in_review' | 'interview' | 'rejected' | 'accepted';
}