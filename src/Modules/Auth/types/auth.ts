export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
}

export interface AuthUser {
    id: number;
    name: string;
    surname1: string;
    roles: string[];
}

export interface RegisterRequest extends LoginRequest {
    accountType?: 'CLIENT' | 'OWNER';
    idCard: string;
    name: string;
    surname1: string;
    surname2?: string;
    phoneNumber: string;
    birthdate: string;
}

export interface RegisterResponse {
    id: number;
    email: string;
    name: string;
    roles: string[];
}
