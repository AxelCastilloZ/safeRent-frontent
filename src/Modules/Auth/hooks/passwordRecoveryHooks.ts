import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setSessionToken } from '../services/authSession';
import { requestPasswordRecovery, resetPassword } from '../services/passwordRecoveryServices';

export const useForgotPassword = () => useMutation({ mutationFn: requestPasswordRecovery, retry: false });
export const useResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetPassword,
    retry: false,
    onSuccess: () => {
      setSessionToken(null);
      queryClient.removeQueries({ queryKey: ['auth'] });
    },
  });
};
