import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Login, Register } from "../services/aurhServices";

export const useLogin = () => {
    const qc = useQueryClient();
    const mutation = useMutation({
        mutationFn: Login,
        onSuccess: (res) =>{
            localStorage.setItem('token', res.access_token);
            qc.clear();
        }
    })
    return mutation;
}

export const useRegister = () => useMutation({ mutationFn: Register });
