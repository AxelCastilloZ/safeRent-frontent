import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import logo from '../../../assets/saferent-logo.svg'
import { loginDefaultValues, loginSchema } from '../schemas/login.schema'
import { login } from '../services/auth.service'

export default function LoginForm() {
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm({
    defaultValues: loginDefaultValues,
    validators: { onBlur: loginSchema, onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      setError('')
      try {
        const payload = loginSchema.parse(value)
        await login(payload.email, payload.password)
        const next = new URLSearchParams(window.location.search).get('next')
        window.location.assign(next && /^\/property_detail\/\d+$/.test(next) ? next : '/')
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : 'No pudimos iniciar sesión.')
      }
    },
  })
  return <main className="flex min-h-svh flex-col items-center justify-center bg-surface px-4 py-12 text-primary">
    <a href="/"><img src={logo} alt="SafeRent, inicio" className="mb-8 w-60" /></a>
    <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
      <h1 className="text-center text-3xl font-bold">Bienvenido de nuevo</h1>
      <p className="mt-2 text-center text-neutral">Inicia sesión en tu cuenta de SafeRent</p>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <form className="mt-6 space-y-4" noValidate onSubmit={(event) => { event.preventDefault(); if (!form.state.isSubmitting) void form.handleSubmit() }}>
        <form.Field name="email">{(field) => <label className="block text-sm font-medium">Correo electrónico
          <input type="email" autoComplete="email" value={field.state.value} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" />
          {field.state.meta.errors[0] && <span className="mt-1 block text-xs text-red-700">{field.state.meta.errors[0].message}</span>}
        </label>}</form.Field>
        <form.Field name="password">{(field) => <div><label htmlFor="login-password" className="text-sm font-medium">Contraseña</label>
          <div className="relative mt-2"><input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={field.state.value} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} className="w-full rounded-lg border border-slate-300 py-3 pl-4 pr-12" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-3 top-3">{showPassword ? <EyeOff /> : <Eye />}</button></div>
          {field.state.meta.errors[0] && <span className="mt-1 block text-xs text-red-700">{field.state.meta.errors[0].message}</span>}
        </div>}</form.Field>
        <form.Subscribe selector={(state) => state.isSubmitting}>{(busy) => <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 font-bold text-white disabled:opacity-60">{busy ? 'Iniciando sesión...' : 'Iniciar sesión'}<ArrowRight size={18} /></button>}</form.Subscribe>
      </form>
      <p className="mt-6 text-center text-sm">¿No tienes cuenta? <a href="/register" className="font-bold text-secondary">Regístrate</a></p>
    </section>
  </main>
}
