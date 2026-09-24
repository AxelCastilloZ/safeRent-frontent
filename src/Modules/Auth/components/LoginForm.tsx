import { useForm } from '@tanstack/react-form';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

import logo from '../../../assets/saferent-logo.svg';
import { paths } from '../../../routes/paths';
import { loginDefaultValues, loginSchema } from '../schemas/login.schema';
import { Link } from '@tanstack/react-router';

const labelClass = 'text-sm leading-[16.8px] font-medium tracking-[0.7px] text-[#45474c]';
const inputClass =
  'h-14 w-full rounded-lg border border-[#c5c6cd]/40 bg-white pl-10 text-base text-[#191c1d] outline-none transition-colors placeholder:text-[#45474c]/50 hover:border-[#c5c6cd] focus:border-[#091426] focus:ring-2 focus:ring-[#091426]/15 aria-invalid:border-[#ba1a1a] aria-invalid:focus:ring-[#ba1a1a]/15';
const iconClass = 'pointer-events-none absolute top-1/2 left-3 size-[17px] -translate-y-1/2 text-[#45474c]';
const errorClass = 'text-xs leading-4 text-[#ba1a1a]';
const linkClass =
  'rounded-sm font-semibold text-[#091426] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#091426]';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: loginDefaultValues,
    validators: { onBlur: loginSchema, onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      const payload = loginSchema.parse(value);
      // TODO: conectar con el servicio/mutation de autenticación cuando exista el endpoint.
      void payload;
    },
  });

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[#f8f9fa] px-4 py-12 font-sans">
      <img src={logo} alt="SafeRent" width={298} height={143} className="mb-8 h-auto w-[240px] sm:w-[298px]" />

      <section className="flex w-full max-w-[448px] flex-col gap-[23px] rounded-xl bg-white px-5 py-6 shadow-xl sm:px-6">
        <header className="flex flex-col gap-[7px] text-center">
          <h1 className="text-[28px] leading-9 font-semibold tracking-[-0.32px] text-[#191c1d] sm:text-[32px] sm:leading-[38.4px]">
            Welcome back
          </h1>
          <p className="text-base leading-[25.6px] text-[#45474c]">Sign in to your SafeRent account</p>
        </header>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!form.state.isSubmitting) void form.handleSubmit();
          }}
          className="flex flex-col gap-3"
        >
          {/* Email */}
          <form.Field name="email">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-1">
                  <label htmlFor="login-email" className={labelClass}>Email address</label>
                  <div className="relative">
                    <Mail aria-hidden="true" className={iconClass} />
                    <input
                      id="login-email"
                      name={field.name}
                      type="email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid || undefined}
                      aria-describedby={isInvalid ? 'login-email-error' : undefined}
                      className={`${inputClass} pr-4`}
                    />
                  </div>
                  {isInvalid && (
                    <p id="login-email-error" className={errorClass}>{field.state.meta.errors[0]?.message}</p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Password */}
          <form.Field name="password">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-password" className={labelClass}>Password</label>
                    {/* <Link to={paths.forgotPassword} className={`${linkClass} text-xs leading-3`}> */}
                      Forgot Password?
                    {/* </Link> */}
                  </div>
                  <div className="relative">
                    <Lock aria-hidden="true" className={iconClass} />
                    <input
                      id="login-password"
                      name={field.name}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid || undefined}
                      aria-describedby={isInvalid ? 'login-password-error' : undefined}
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                      className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[#45474c] transition-colors hover:text-[#191c1d] focus-visible:outline-2 focus-visible:outline-[#091426]"
                    >
                      {showPassword ? <Eye className="size-[18px]" /> : <EyeOff className="size-[18px]" />}
                    </button>
                  </div>
                  {isInvalid && (
                    <p id="login-password-error" className={errorClass}>{field.state.meta.errors[0]?.message}</p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#091426] py-4 text-sm leading-[16.8px] font-medium tracking-[0.7px] text-white shadow-md transition-colors hover:bg-[#15243d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#091426] active:bg-[#050b16] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
                {!isSubmitting && <ArrowRight aria-hidden="true" className="size-3" />}
              </button>
            )}
          </form.Subscribe>
        </form>

        <p className="text-center text-base leading-[25.6px] text-[#45474c]">
          Don't have an account?{' '}
          {/* <Link to={paths.createAccount} className={`${linkClass} text-sm tracking-[0.7px]`}> */}
            Sign up
          {/* </Link> */}
        </p>
      </section>
    </main>
  );
};

export default LoginForm;
