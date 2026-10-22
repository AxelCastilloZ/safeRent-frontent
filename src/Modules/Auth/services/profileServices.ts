import apiAxios from '../../../api/apiConfig';
import type { Language } from '../../../i18n/languages';
export interface Profile {
  id: number; idCard: string; name: string; surname1: string; surname2: string;
  email: string; phoneNumber: string; birthdate: string; roles: string[]; createdAt: string;
  countryCode: string | null; preferredCurrency: string | null;
  preferredLanguage: Language | null;
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
export async function updateLanguage(preferredLanguage: Language) { return (await apiAxios.patch('/auth/language', { preferredLanguage })).data; }
export async function updateProfile(payload: UpdateProfileRequest) { return (await apiAxios.patch<Profile>('/auth/profile', payload)).data; }
export async function changePassword(payload: ChangePasswordRequest) { return (await apiAxios.post<{ message: string }>('/auth/change-password', payload)).data; }
