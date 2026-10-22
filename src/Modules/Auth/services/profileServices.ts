import apiAxios from '../../../api/apiConfig';
export interface Profile {
  profilePhotoUrl?: string | null;
  id: number; idCard: string; name: string; surname1: string; surname2: string;
  email: string; phoneNumber: string; birthdate: string; roles: string[]; createdAt: string;
  countryCode: string | null; preferredCurrency: string | null;
  resolvedCurrency: string; currencySource: 'preference' | 'country' | 'default';
}
export type UpdateProfileRequest = Pick<Profile, 'name' | 'surname1' | 'surname2' | 'email' | 'phoneNumber' | 'birthdate'> & { currentPassword?: string; countryCode?: string | null; preferredCurrency?: string | null };
export interface ProfileCurrencyOptions {
  countries: { code: string; name: string; currency: string }[];
  currencies: { code: string; name: string }[];
  defaultCurrency: string;
}
export async function getProfileCurrencyOptions() { return (await apiAxios.get<ProfileCurrencyOptions>('/auth/profile-options')).data; }
export interface ChangePasswordRequest { currentPassword: string; password: string }
export async function getProfile() { return (await apiAxios.get<Profile>('/auth/profile')).data; }
export async function updateProfile(payload: UpdateProfileRequest) { return (await apiAxios.patch<Profile>('/auth/profile', payload)).data; }
export async function changePassword(payload: ChangePasswordRequest) { return (await apiAxios.post<{ message: string }>('/auth/change-password', payload)).data; }

export async function uploadProfilePhoto(file: File) {
  const body = new FormData(); body.append('file', file);
  return (await apiAxios.post<Profile>('/auth/profile/photo', body, { timeout: 120000 })).data;
}
export async function deleteProfilePhoto() { return (await apiAxios.delete<Profile>('/auth/profile/photo')).data; }
