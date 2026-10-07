import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import Alert from '@mui/material/Alert';
import { useProfile, useUpdateProfile } from '../../Auth/hooks/profileHooks';
import { profileSchema } from '../../Auth/schemas/profile.schema';
import { getAuthErrorMessage, getAuthErrorSeverity } from '../../Auth/services/aurhServices';
import type { Profile } from '../../Auth/services/profileServices';
import { TextField } from '../../Auth/components/TextField';

const buttonClass = 'rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60';
const fields = [
  { name: 'name', label: 'Nombre', autoComplete: 'given-name' },
  { name: 'surname1', label: 'Primer apellido', autoComplete: 'family-name' },
  { name: 'surname2', label: 'Segundo apellido (opcional)' },
  { name: 'email', label: 'Correo electrónico', type: 'email' },
  { name: 'phoneNumber', label: 'Teléfono', type: 'tel' },
  { name: 'birthdate', label: 'Fecha de nacimiento', type: 'date' },
] as const;

function ProfileEditor({ profile, onSaved, onCancel }: { profile: Profile; onSaved: () => void; onCancel: () => void }) {
  const update = useUpdateProfile();
  const form = useForm({
    defaultValues: { name: profile.name, surname1: profile.surname1, surname2: profile.surname2, email: profile.email, phoneNumber: profile.phoneNumber, birthdate: profile.birthdate, currentPassword: '' },
    validators: { onBlur: profileSchema, onSubmit: profileSchema },
    onSubmit: async ({ value }) => {
      const parsed = profileSchema.parse(value);
      try { await update.mutateAsync({ ...parsed, ...(parsed.email === profile.email ? { currentPassword: undefined } : {}) }); } catch { return; }
      onSaved();
    },
  });
  return (
    <form noValidate className="space-y-4" onSubmit={event => { event.preventDefault(); if (!form.state.isSubmitting) void form.handleSubmit(); }}>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ name, label, ...props }) => <form.Field key={name} name={name}>
          {field => <TextField {...props} label={label} id={`profile-${name}`} name={name} value={field.state.value} onBlur={field.handleBlur} onChange={field.handleChange}
            error={field.state.meta.isTouched && !field.state.meta.isValid ? field.state.meta.errors[0]?.message : undefined} />}
        </form.Field>)}
      </div>
      <form.Subscribe selector={state => state.values.email}>
        {email => email !== profile.email && <form.Field name="currentPassword">
          {field => <TextField label="Contraseña actual para cambiar el correo" id="profile-current-password" name={field.name} type="password" autoComplete="current-password" value={field.state.value} onBlur={field.handleBlur} onChange={field.handleChange}
            hint="El nuevo correo se usará para iniciar sesión y recuperar tu contraseña." error={field.state.meta.isTouched && !field.state.meta.isValid ? field.state.meta.errors[0]?.message : undefined} />}
        </form.Field>}
      </form.Subscribe>
      {update.isError && <Alert severity={getAuthErrorSeverity(update.error)}>{getAuthErrorMessage(update.error)}</Alert>}
      <form.Subscribe selector={state => state.isSubmitting}>
        {pending => <div className="flex gap-3"><button type="submit" className={buttonClass} disabled={pending} aria-busy={pending}>{pending ? 'Guardando…' : 'Guardar cambios'}</button>
          <button type="button" onClick={onCancel} disabled={pending} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-primary">Cancelar</button></div>}
      </form.Subscribe>
    </form>
  );
}

export default function ProfilePanel() {
  const profile = useProfile();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  if (profile.isPending) return <p role="status" className="text-sm text-muted-ink">Cargando perfil…</p>;
  if (profile.isError) return <div className="space-y-3"><Alert severity="error">{getAuthErrorMessage(profile.error)}</Alert><button className={buttonClass} onClick={() => { void profile.refetch(); }}>Reintentar</button></div>;
  const user = profile.data;
  const details = [ ['Cédula', user.idCard], ['Nombre completo', [user.name, user.surname1, user.surname2].filter(Boolean).join(' ')], ['Correo', user.email], ['Teléfono', user.phoneNumber], ['Fecha de nacimiento', user.birthdate], ['Tipo de cuenta', user.roles.join(', ')], ['Miembro desde', new Date(user.createdAt).toLocaleDateString('es-CR')] ];
  return <div className="space-y-4">
    {saved && <Alert severity="success" onClose={() => setSaved(false)}>Tu perfil se actualizó correctamente.</Alert>}
    {editing ? <><p className="text-sm text-muted-ink">Cédula: {user.idCard} (solo lectura)</p><ProfileEditor profile={user} onCancel={() => setEditing(false)} onSaved={() => { setEditing(false); setSaved(true); }} /></> : <>
      <dl className="grid gap-4 sm:grid-cols-2">{details.map(([label, value]) => <div key={label}><dt className="text-xs font-semibold uppercase tracking-wide text-muted-ink">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-primary">{value || '—'}</dd></div>)}</dl>
      <button type="button" className={buttonClass} onClick={() => { setSaved(false); setEditing(true); }}>Editar perfil</button>
    </>}
  </div>;
}
