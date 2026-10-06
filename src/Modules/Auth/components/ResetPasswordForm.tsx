import { useForm } from '@tanstack/react-form';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import Alert from '@mui/material/Alert';
import { useEffect } from 'react';
import { useResetPassword } from '../hooks/passwordRecoveryHooks';
import { resetPasswordSchema } from '../schemas/password-recovery.schema';
import { getAuthErrorMessage, getAuthErrorSeverity } from '../services/aurhServices';
import { TextField } from './TextField';
import PasswordRecoveryLayout from './PasswordRecoveryLayout';
import { recoveryButtonClass } from './passwordRecoveryStyles';

export default function ResetPasswordForm() {
  const { token } = useSearch({ from: '/reset-password' });
  const reset = useResetPassword();
  const navigate = useNavigate();
  useEffect(() => {
    if (!reset.isSuccess) return;
    const timer = window.setTimeout(() => { void navigate({ to: '/login', replace: true }); }, 2500);
    return () => window.clearTimeout(timer);
  }, [reset.isSuccess, navigate]);
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'referrer';
    meta.content = 'no-referrer';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
  const form = useForm({
    defaultValues: { password: '', confirmPassword: '' },
    validators: { onChange: resetPasswordSchema, onSubmit: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      if (!token || reset.isSuccess) return;
      const { password } = resetPasswordSchema.parse(value);
      try { await reset.mutateAsync({ token, password }); } catch { return; }
    },
  });
  return (
    <PasswordRecoveryLayout title="Cambia tu contraseña" description="Crea una contraseña segura y confírmala para recuperar el acceso a tu cuenta.">
      {!token ? <Alert severity="warning">El enlace no contiene un token válido. Solicita un nuevo enlace de recuperación.</Alert> : reset.isSuccess ? (
        <Alert severity="success">Contraseña actualizada correctamente. Te llevaremos al login para iniciar sesión.</Alert>
      ) : (
        <form noValidate className="flex flex-col gap-5" onSubmit={(event) => {
          event.preventDefault();
          if (!form.state.isSubmitting) void form.handleSubmit();
        }}>
          {(['password', 'confirmPassword'] as const).map((name) => (
            <form.Field key={name} name={name}>
              {(field) => <TextField id={`reset-${name}`} name={field.name} label={name === 'password' ? 'Nueva contraseña' : 'Confirmar contraseña'}
                type="password" autoComplete="new-password" value={field.state.value} onChange={field.handleChange} onBlur={field.handleBlur}
                hint={name === 'password' ? 'De 8 a 72 caracteres, con mayúscula, minúscula, número y símbolo. Máximo 72 bytes UTF-8.' : undefined}
                error={field.state.meta.isTouched && !field.state.meta.isValid ? field.state.meta.errors[0]?.message : undefined} />}
            </form.Field>
          ))}
          {reset.isError && <Alert severity={getAuthErrorSeverity(reset.error)}>{getAuthErrorMessage(reset.error)}</Alert>}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(pending) => <button type="submit" className={recoveryButtonClass} disabled={pending} aria-busy={pending}>{pending ? 'Actualizando contraseña…' : 'Guardar nueva contraseña'}</button>}
          </form.Subscribe>
        </form>
      )}
      {!reset.isSuccess && <Link to="/forgot-password" className="text-center text-sm text-[#0a2540] underline">Solicitar un nuevo enlace</Link>}
    </PasswordRecoveryLayout>
  );
}

