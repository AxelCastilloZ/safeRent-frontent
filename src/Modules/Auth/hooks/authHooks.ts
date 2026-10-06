import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';
import { GetCurrentUser, Login, Register } from "../services/aurhServices";
import { setSessionToken, useSessionToken } from '../services/authSession';

export const useLogin = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: Login,
        onSuccess: (res) =>{
            qc.clear();
            setSessionToken(res.access_token);
        }
    })
    return mutation;
}

export const useRegister = () => useMutation({ mutationFn: Register });

export const useAuth = () => {
    const token = useSessionToken();
    const qc = useQueryClient();
    const user = useQuery({
        queryKey: ['auth', 'me', token],
        enabled: Boolean(token),
        retry: false,
        refetchInterval: 30000,
        queryFn: async () => {
            try {
                return await GetCurrentUser();
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401
                    && localStorage.getItem('token') === token) {
                    setSessionToken(null);
                }
                throw error;
            }
        },
    });
    return {
        user: token ? user.data : undefined,
        hasSession: Boolean(token),
        logout: () => {
            setSessionToken(null);
            qc.clear();
        },
    };
};
