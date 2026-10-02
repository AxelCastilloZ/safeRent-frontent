import axios from 'axios';
import apiAxios from '../../../api/apiConfig';
import type { AuthUser, AuthResponse, LoginRequest, RegisterRequest, RegisterResponse } from '../types/auth';

const BASE = '/auth';

export async function GetCurrentUser(): Promise<AuthUser> {
  const response = await apiAxios.get<AuthUser>(`${BASE}/me`);
  return response.data;
}

export function getAuthErrorSeverity(error: unknown): 'warning' | 'error' {
  return axios.isAxiosError(error) && [400, 401, 409].includes(error.response?.status ?? 0)
    ? 'warning' : 'error';
}

export async function Login(payload: LoginRequest): Promise<AuthResponse> {
  const response = await apiAxios.post<AuthResponse>(`${BASE}/login`, payload);
  return response.data;
}

export async function Register(payload: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiAxios.post<RegisterResponse>(`${BASE}/register`, payload);
  return response.data;
}

export function getAuthErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message: unknown = error.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message) && message.every((item) => typeof item === 'string')) {
      return message.join(' ');
    }
    if (!error.response) return 'Unable to connect to the server. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}
