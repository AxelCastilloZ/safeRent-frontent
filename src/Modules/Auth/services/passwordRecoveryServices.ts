import apiAxios from '../../../api/apiConfig';

export interface ForgotPasswordRequest { identifier: string }
export interface ResetPasswordRequest { token: string; password: string }
export interface PasswordRecoveryResponse { message: string }

export async function requestPasswordRecovery(payload: ForgotPasswordRequest): Promise<PasswordRecoveryResponse> {
  const response = await apiAxios.post<PasswordRecoveryResponse>('/auth/forgot-password', payload);
  return response.data;
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<PasswordRecoveryResponse> {
  const response = await apiAxios.post<PasswordRecoveryResponse>('/auth/reset-password', payload);
  return response.data;
}
