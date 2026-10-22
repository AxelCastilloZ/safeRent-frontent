import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { useChangePassword } from '../../Auth/hooks/profileHooks';
import { changePasswordSchema } from '../../Auth/schemas/profile.schema';
import { getAuthErrorMessage, getAuthErrorSeverity } from '../../Auth/services/aurhServices';
import { setSessionToken } from '../../Auth/services/authSession';
import { TextField } from '../../Auth/components/TextField';

export default function ChangePasswordDialog({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const change = useChangePassword();
  const navigate = useNavigate();
  const qc = useQueryClient();
  useEffect(() => {
    if (!change.isSuccess) return;
    const timer = window.setTimeout(() => { setSessionToken(null); qc.clear(); void navigate({ to: '/login', replace: true }); }, 2500);
    return () => window.clearTimeout(timer);
  }, [change.isSuccess, navigate, qc]);
  const form = useForm({
    defaultValues: { currentPassword: '', password: '', confirmPassword: '' },
    validators: { onChange: changePasswordSchema, onSubmit: changePasswordSchema },
    onSubmit: async ({ value }) => {
      const { currentPassword, password } = changePasswordSchema.parse(value);
      try { await change.mutateAsync({ currentPassword, password }); } catch { return; }
    },
  });
  return <Dialog open fullWidth maxWidth="sm" aria-labelledby="change-password-title" onClose={() => { if (!form.state.isSubmitting && !change.isSuccess) onClose(); }}>
    <DialogTitle id="change-password-title">{t("settings:changePassword")}</DialogTitle>
    <DialogContent>
      {change.isSuccess ? <Alert severity="success">{t("settings:passwordUpdated")}</Alert> : <form noValidate className="space-y-4 pt-2" onSubmit={event => { event.preventDefault(); if (!form.state.isSubmitting) void form.handleSubmit(); }}>
        <p className="text-sm text-muted-ink">{t("settings:passwordWarning")}</p>
        {(['currentPassword', 'password', 'confirmPassword'] as const).map(name => <form.Field key={name} name={name}>
          {field => <TextField id={`security-${name}`} name={name} label={name === 'currentPassword' ? t("settings:currentPassword") : name === 'password' ? t("settings:newPassword") : t("settings:confirmPassword")} type="password" autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
            value={field.state.value} onBlur={field.handleBlur} onChange={field.handleChange} hint={name === 'password' ? t("settings:passwordHint") : undefined}
            error={field.state.meta.isTouched && !field.state.meta.isValid ? field.state.meta.errors[0]?.message : undefined} />}
        </form.Field>)}
        {change.isError && <Alert severity={getAuthErrorSeverity(change.error)}>{getAuthErrorMessage(change.error)}</Alert>}
        <form.Subscribe selector={state => state.isSubmitting}>{pending => <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} disabled={pending} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-primary">{t("common:cancel")}</button>
          <button type="submit" disabled={pending} aria-busy={pending} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? t("settings:saving") : t("settings:changePassword")}</button>
        </div>}</form.Subscribe>
      </form>}
    </DialogContent>
  </Dialog>;
}
