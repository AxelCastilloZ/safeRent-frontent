import apiAxios from '../../../api/apiConfig';
export interface Profile {
  id: number; idCard: string; name: string; surname1: string; surname2: string;
  email: string; phoneNumber: string; birthdate: string; roles: string[]; createdAt: string;
}
export type UpdateProfileRequest = Pick<Profile, 'name' | 'surname1' | 'surname2' | 'email' | 'phoneNumber' | 'birthdate'> & { currentPassword?: string };
export interface ChangePasswordRequest { currentPassword: string; password: string }
export async function getProfile() { return (await apiAxios.get<Profile>('/auth/profile')).data; }
export async function updateProfile(payload: UpdateProfileRequest) { return (await apiAxios.patch<Profile>('/auth/profile', payload)).data; }
export async function changePassword(payload: ChangePasswordRequest) { return (await apiAxios.post<{ message: string }>('/auth/change-password', payload)).data; }
