export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
}

export interface RegisterRequest extends LoginRequest {
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
