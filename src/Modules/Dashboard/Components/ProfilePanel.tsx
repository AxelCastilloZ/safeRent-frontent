import { useTranslation } from 'react-i18next';
import { displayName, formatDate } from '../../../i18n/formatters';
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
  { name: 'name', label: "settings:name", autoComplete: 'given-name' },
  { name: 'surname1', label: "settings:surname1", autoComplete: 'family-name' },
  { name: 'surname2', label: "settings:surname2" },
  { name: 'email', label: "settings:emailAddress", type: 'email' },
  { name: 'phoneNumber', label: "settings:phone", type: 'tel' },
  { name: 'birthdate', label: "settings:birthdate", type: 'date' },
] as const;

function ProfileEditor({ profile, options, onSaved, onCancel }: { profile: Profile; options: ProfileCurrencyOptions; onSaved: () => void; onCancel: () => void }) {
  const { t } = useTranslation();
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
          {field => <TextField {...props} label={t(label)} id={`profile-${name}`} name={name} value={field.state.value} onBlur={field.handleBlur} onChange={field.handleChange}
            error={field.state.meta.isTouched && !field.state.meta.isValid ? field.state.meta.errors[0]?.message : undefined} />}
        </form.Field>)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="countryCode">{field => <div className="space-y-1">
          <label htmlFor="profile-country" className="text-sm font-semibold text-primary">{t("settings:country")}</label>
          <select id="profile-country" name={field.name} autoComplete="country" value={field.state.value} onBlur={field.handleBlur} onChange={event => field.handleChange(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-primary" aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid} aria-describedby="profile-country-hint">
            <option value="">{t("settings:unspecified")}</option>
            {options.countries.map(country => <option key={country.code} value={country.code}>{displayName(country.code, 'region')}</option>)}
          </select>
          <p id="profile-country-hint" className="text-xs text-muted-ink">{t("settings:countryHint")}</p>
          {field.state.meta.isTouched && !field.state.meta.isValid && <p role="alert" className="text-xs text-red-700">{t(field.state.meta.errors[0]?.message ?? 'errors:unavailable')}</p>}
        </div>}</form.Field>
        <form.Field name="preferredCurrency">{field => <div className="space-y-1">
          <label htmlFor="profile-currency" className="text-sm font-semibold text-primary">{t("settings:preferredCurrency")}</label>
          <select id="profile-currency" name={field.name} value={field.state.value} onBlur={field.handleBlur} onChange={event => field.handleChange(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-primary" aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid} aria-describedby="profile-currency-hint">
            <option value="">{t("settings:automaticCurrency")}</option>
            {options.currencies.map(currency => <option key={currency.code} value={currency.code}>{currency.code} — {displayName(currency.code, 'currency')}</option>)}
          </select>
          <p id="profile-currency-hint" className="text-xs text-muted-ink">{t("settings:currencyHint")}</p>
          {field.state.meta.isTouched && !field.state.meta.isValid && <p role="alert" className="text-xs text-red-700">{t(field.state.meta.errors[0]?.message ?? 'errors:unavailable')}</p>}
        </div>}</form.Field>
      </div>
      <form.Subscribe selector={state => [state.values.countryCode, state.values.preferredCurrency]}>
        {([country, currency]) => <p className="text-sm text-muted-ink" aria-live="polite">{t('settings:currencySummary', { currency: currency || options.countries.find(option => option.code === country)?.currency || options.defaultCurrency, defaultCurrency: options.defaultCurrency })}</p>}
      </form.Subscribe>
      <form.Subscribe selector={state => state.values.email}>
        {email => email !== profile.email && <form.Field name="currentPassword">
          {field => <TextField label={t("settings:emailPassword")} id="profile-current-password" name={field.name} type="password" autoComplete="current-password" value={field.state.value} onBlur={field.handleBlur} onChange={field.handleChange}
            hint={t("settings:emailHint")} error={field.state.meta.isTouched && !field.state.meta.isValid ? field.state.meta.errors[0]?.message : undefined} />}
        </form.Field>}
      </form.Subscribe>
      {update.isError && <Alert severity={getAuthErrorSeverity(update.error)}>{getAuthErrorMessage(update.error)}</Alert>}
      <form.Subscribe selector={state => state.isSubmitting}>
        {pending => <div className="flex gap-3"><button type="submit" className={buttonClass} disabled={pending} aria-busy={pending}>{pending ? t("settings:saving") : t("common:save")}</button>
          <button type="button" onClick={onCancel} disabled={pending} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-primary">{t("common:cancel")}</button></div>}
      </form.Subscribe>
    </form>
  );
}

export default function ProfilePanel() {
  const { t } = useTranslation();
  const profile = useProfile();
  const options = useProfileCurrencyOptions();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  if (profile.isPending) return <p role="status" className="text-sm text-muted-ink">{t("settings:loadingProfile")}</p>;
  if (profile.isError) return <div className="space-y-3"><Alert severity="error">{getAuthErrorMessage(profile.error)}</Alert><button className={buttonClass} onClick={() => { void profile.refetch(); }}>{t("common:retry")}</button></div>;
  const user = profile.data;
  const details = [ [t("settings:idCard"), user.idCard], [t("settings:fullName"), [user.name, user.surname1, user.surname2].filter(Boolean).join(' ')], [t("settings:email"), user.email], [t("settings:phone"), user.phoneNumber], [t("settings:birthdate"), formatDate(user.birthdate)], [t("settings:accountType"), user.roles.map(role => t('common:' + role, { defaultValue: role })).join(', ')], [t("settings:memberSince"), formatDate(user.createdAt)], [t("settings:country"), displayName(user.countryCode, 'region')], [t("settings:preferredCurrency"), user.preferredCurrency || t("settings:automaticCurrency")], [t("settings:profileCurrency"), user.resolvedCurrency || 'CRC'] ];
  return <div className="space-y-4">
    {saved && <Alert severity="success" onClose={() => setSaved(false)}>{t("settings:profileSaved")}</Alert>}
    {options.isError && <Alert severity="error">{t("settings:optionsError")}{' '}<button type="button" className="underline" onClick={() => { void options.refetch(); }}>{t("common:retry")}</button></Alert>}
    {editing && options.data ? <><p className="text-sm text-muted-ink">{t('settings:readOnlyId', { id: user.idCard })}</p><ProfileEditor profile={user} options={options.data} onCancel={() => setEditing(false)} onSaved={() => { setEditing(false); setSaved(true); }} /></> : <>
      <dl className="grid gap-4 sm:grid-cols-2">{details.map(([label, value]) => <div key={label}><dt className="text-xs font-semibold uppercase tracking-wide text-muted-ink">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-primary">{value || '—'}</dd></div>)}</dl>
      <button type="button" className={buttonClass} disabled={!options.data} onClick={() => { setSaved(false); setEditing(true); }}>{options.isPending ? t("settings:loadingOptions") : t("settings:editProfile")}</button>
    </>}
  </div>;
}
