import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, changePassword } from '../services/profileServices';
import { useSessionToken } from '../services/authSession';
export function useProfile() {
  const token = useSessionToken();
  return useQuery({ queryKey: ['auth', 'profile', token], enabled: Boolean(token), queryFn: getProfile, retry: false });
}
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: updateProfile, onSuccess: async () => {
    await Promise.all([qc.invalidateQueries({ queryKey: ['auth', 'profile'] }), qc.invalidateQueries({ queryKey: ['auth', 'me'] })]);
  } });
}
export const useChangePassword = () => useMutation({ mutationFn: changePassword, retry: false });
