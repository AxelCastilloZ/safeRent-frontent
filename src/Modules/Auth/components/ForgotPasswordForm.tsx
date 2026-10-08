import { useForm } from '@tanstack/react-form';
import Alert from '@mui/material/Alert';
import { useForgotPassword } from '../hooks/passwordRecoveryHooks';
import { forgotPasswordSchema } from '../schemas/password-recovery.schema';
import { getAuthErrorMessage, getAuthErrorSeverity } from '../services/aurhServices';
import { TextField } from './TextField';
import PasswordRecoveryLayout from './PasswordRecoveryLayout';
import { recoveryButtonClass } from './passwordRecoveryStyles';

export default function ForgotPasswordForm() {
  const recovery = useForgotPassword();
  const form = useForm({
    defaultValues: { identifier: '' },
    validators: { onBlur: forgotPasswordSchema, onSubmit: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      try { await recovery.mutateAsync(forgotPasswordSchema.parse(value)); } catch { return; }
    },
  });
  return (
    <PasswordRecoveryLayout title="¿Olvidaste tu contraseña?" description="Indica tu cédula o correo electrónico. Enviaremos un enlace al correo asociado a tu cuenta.">
      {recovery.isSuccess ? (
        <Alert severity="success">Si los datos corresponden a una cuenta activa, recibirás un enlace para cambiar tu contraseña. Revisa también la carpeta de spam.</Alert>
      ) : (
        <form noValidate className="flex flex-col gap-5" onSubmit={(event) => {
          event.preventDefault();
          if (!form.state.isSubmitting) void form.handleSubmit();
        }}>
          <form.Field name="identifier">
            {(field) => <TextField id="recovery-identifier" name={field.name} label="Cédula o correo electrónico"
              value={field.state.value} onChange={field.handleChange} onBlur={field.handleBlur} autoComplete="username"
              error={field.state.meta.isTouched && !field.state.meta.isValid ? field.state.meta.errors[0]?.message : undefined} />}
          </form.Field>
          {recovery.isError && <Alert severity={getAuthErrorSeverity(recovery.error)}>{getAuthErrorMessage(recovery.error)}</Alert>}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(pending) => <button type="submit" className={recoveryButtonClass} disabled={pending} aria-busy={pending}>{pending ? 'Solicitando enlace…' : 'Enviar enlace de recuperación'}</button>}
          </form.Subscribe>
        </form>
      )}
    </PasswordRecoveryLayout>
  );
}

