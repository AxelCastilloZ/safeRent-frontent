import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import Alert from '@mui/material/Alert';
import { useProfile, useUpdateProfile, useProfileCurrencyOptions } from '../../Auth/hooks/profileHooks';
import { profileSchema } from '../../Auth/schemas/profile.schema';
import { getAuthErrorMessage, getAuthErrorSeverity } from '../../Auth/services/aurhServices';
import type { Profile, ProfileCurrencyOptions } from '../../Auth/services/profileServices';
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

function ProfileEditor({ profile, options, onSaved, onCancel }: { profile: Profile; options: ProfileCurrencyOptions; onSaved: () => void; onCancel: () => void }) {
  const update = useUpdateProfile();
  const form = useForm({
    defaultValues: { name: profile.name, surname1: profile.surname1, surname2: profile.surname2, email: profile.email, phoneNumber: profile.phoneNumber, birthdate: profile.birthdate, currentPassword: '', countryCode: profile.countryCode ?? '', preferredCurrency: profile.preferredCurrency ?? '' },
    validators: { onBlur: profileSchema, onSubmit: profileSchema },
    onSubmit: async ({ value }) => {
      const parsed = profileSchema.parse(value);
      try { await update.mutateAsync({ ...parsed, countryCode: parsed.countryCode || null, preferredCurrency: parsed.preferredCurrency || null, ...(parsed.email === profile.email ? { currentPassword: undefined } : {}) }); } catch { return; }
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
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="countryCode">{field => <div className="space-y-1">
          <label htmlFor="profile-country" className="text-sm font-semibold text-primary">País o territorio</label>
          <select id="profile-country" name={field.name} autoComplete="country" value={field.state.value} onBlur={field.handleBlur} onChange={event => field.handleChange(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-primary" aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid} aria-describedby="profile-country-hint">
            <option value="">Sin indicar</option>
            {options.countries.map(country => <option key={country.code} value={country.code}>{country.name}</option>)}
          </select>
          <p id="profile-country-hint" className="text-xs text-muted-ink">Se usa para elegir tu moneda automática.</p>
          {field.state.meta.isTouched && !field.state.meta.isValid && <p role="alert" className="text-xs text-red-700">{field.state.meta.errors[0]?.message}</p>}
        </div>}</form.Field>
        <form.Field name="preferredCurrency">{field => <div className="space-y-1">
          <label htmlFor="profile-currency" className="text-sm font-semibold text-primary">Moneda preferida</label>
          <select id="profile-currency" name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={event => field.handleChange(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-primary" aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid} aria-describedby="profile-currency-hint">
            <option value="">Automática según el país</option>
            {options.currencies.map(currency => <option key={currency.code} value={currency.code}>{currency.code} — {currency.name}</option>)}
          </select>
          <p id="profile-currency-hint" className="text-xs text-muted-ink">Una moneda elegida se conserva aunque cambies de país.</p>
          {field.state.meta.isTouched && !field.state.meta.isValid && <p role="alert" className="text-xs text-red-700">{field.state.meta.errors[0]?.message}</p>}
        </div>}</form.Field>
      </div>
      <form.Subscribe selector={state => [state.values.countryCode, state.values.preferredCurrency]}>
        {([country, currency]) => <p className="text-sm text-muted-ink" aria-live="polite">Moneda del perfil: <strong>{currency || options.countries.find(option => option.code === country)?.currency || options.defaultCurrency}</strong>. Sin país ni preferencia se usa {options.defaultCurrency}.</p>}
      </form.Subscribe>
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
  const options = useProfileCurrencyOptions();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  if (profile.isPending) return <p role="status" className="text-sm text-muted-ink">Cargando perfil…</p>;
  if (profile.isError) return <div className="space-y-3"><Alert severity="error">{getAuthErrorMessage(profile.error)}</Alert><button className={buttonClass} onClick={() => { void profile.refetch(); }}>Reintentar</button></div>;
  const user = profile.data;
  const details = [ ['Cédula', user.idCard], ['Nombre completo', [user.name, user.surname1, user.surname2].filter(Boolean).join(' ')], ['Correo', user.email], ['Teléfono', user.phoneNumber], ['Fecha de nacimiento', user.birthdate], ['Tipo de cuenta', user.roles.join(', ')], ['Miembro desde', new Date(user.createdAt).toLocaleDateString('es-CR')], ['País o territorio', options.data?.countries.find(country => country.code === user.countryCode)?.name || user.countryCode || 'Sin indicar'], ['Moneda preferida', user.preferredCurrency || 'Automática según el país'], ['Moneda del perfil', user.resolvedCurrency || 'CRC'] ];
  return <div className="space-y-4">
    {saved && <Alert severity="success" onClose={() => setSaved(false)}>Tu perfil se actualizó correctamente.</Alert>}
    {options.isError && <Alert severity="error">No se pudieron cargar los países y monedas. <button type="button" className="underline" onClick={() => { void options.refetch(); }}>Reintentar</button></Alert>}
    {editing && options.data ? <><p className="text-sm text-muted-ink">Cédula: {user.idCard} (solo lectura)</p><ProfileEditor profile={user} options={options.data} onCancel={() => setEditing(false)} onSaved={() => { setEditing(false); setSaved(true); }} /></> : <>
      <dl className="grid gap-4 sm:grid-cols-2">{details.map(([label, value]) => <div key={label}><dt className="text-xs font-semibold uppercase tracking-wide text-muted-ink">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-primary">{value || '—'}</dd></div>)}</dl>
      <button type="button" className={buttonClass} disabled={!options.data} onClick={() => { setSaved(false); setEditing(true); }}>{options.isPending ? 'Cargando opciones…' : 'Editar perfil'}</button>
    </>}
  </div>;
}
