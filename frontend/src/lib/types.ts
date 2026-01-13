export interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ContactsResponse {
    success: boolean;
    data: Contact[];
    pagination: PaginationInfo;
}

export interface ContactResponse {
    success: boolean;
    data: Contact;
}

export interface AuthResponse {
    token: string;
    user: User;
}
