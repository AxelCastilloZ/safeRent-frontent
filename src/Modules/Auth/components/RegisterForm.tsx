import { useForm } from '@tanstack/react-form';

import logo from '../../../assets/saferent-logo.svg';
import { paths } from '../../../routes/paths';
import {
  createAccountDefaultValues,
  createAccountSchema,
  PASSWORD_MIN_LENGTH,
} from '../schemas/create-account.schema';
import { Link } from '@tanstack/react-router';

const labelClass = 'text-sm leading-5 font-semibold tracking-[0.7px] text-[#111c2d]';
const inputClass =
  'h-[38px] w-full rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm text-[#111c2d] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] outline-none transition-colors hover:border-[#cbd5e1] focus:border-[#0a2540] focus:ring-2 focus:ring-[#0a2540]/15 aria-invalid:border-[#ba1a1a] aria-invalid:focus:ring-[#ba1a1a]/15';
const errorClass = 'text-xs leading-4 text-[#ba1a1a]';
const legalLinkClass =
  'rounded-sm text-[#000f22] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a2540]';

const RegisterForm = () => {
  const form = useForm({
    defaultValues: createAccountDefaultValues,
    validators: { onBlur: createAccountSchema, onSubmit: createAccountSchema },
    onSubmit: async ({ value }) => {
      const payload = createAccountSchema.parse(value);
      // TODO: conectar con el servicio/mutation de registro cuando exista el endpoint.
      void payload;
    },
  });

  return (
    <main className="flex min-h-svh flex-col justify-center bg-[#f9f9ff] px-4 py-12 font-sans sm:px-8">
      <header className="mx-auto flex w-full max-w-[448px] flex-col items-center gap-2 text-center">
        <img src={logo} alt="SafeRent" width={298} height={143} className="h-auto w-[240px] sm:w-[298px]" />
        <h1 className="pt-2 text-[28px] leading-9 font-semibold tracking-[-0.8px] text-[#111c2d] sm:text-[32px] sm:leading-10">
          Create your account
        </h1>
        <p className="text-base leading-6 text-[#43474d]">
          Join our verified community of renters and landlords.
        </p>
      </header>

      <section className="mx-auto mt-8 flex w-full max-w-[600px] flex-col gap-6 rounded-xl border border-[#e2e8f0] bg-white px-5 py-6 sm:px-10 sm:py-8">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!form.state.isSubmitting) void form.handleSubmit();
          }}
          className="flex flex-col gap-6"
        >
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {/* Full Name */}
            <form.Field name="fullName">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label htmlFor="full-name" className={labelClass}>Full Name</label>
                    <input
                      id="full-name"
                      name={field.name}
                      autoComplete="name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid || undefined}
                      aria-describedby={isInvalid ? 'full-name-error' : undefined}
                      className={inputClass}
                    />
                    {isInvalid && (
                      <p id="full-name-error" className={errorClass}>{field.state.meta.errors[0]?.message}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* Username */}
            <form.Field name="username">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="flex flex-col gap-1">
                    <label htmlFor="username" className={labelClass}>Username</label>
                    <input
                      id="username"
                      name={field.name}
                      autoComplete="username"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid || undefined}
                      aria-describedby={isInvalid ? 'username-error' : undefined}
                      className={inputClass}
                    />
                    {isInvalid && (
                      <p id="username-error" className={errorClass}>{field.state.meta.errors[0]?.message}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* Phone Number */}
            <form.Field name="phoneNumber">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="flex flex-col gap-1">
                    <label htmlFor="phone-number" className={labelClass}>Phone Number</label>
                    <input
                      id="phone-number"
                      name={field.name}
                      type="tel"
                      autoComplete="tel"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid || undefined}
                      aria-describedby={isInvalid ? 'phone-number-error' : undefined}
                      className={inputClass}
                    />
                    {isInvalid && (
                      <p id="phone-number-error" className={errorClass}>{field.state.meta.errors[0]?.message}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            {/* Email */}
            <form.Field name="email">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label htmlFor="email" className={labelClass}>Email address</label>
                    <input
                      id="email"
                      name={field.name}
                      type="email"
                      autoComplete="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid || undefined}
                      aria-describedby={isInvalid ? 'email-error' : undefined}
                      className={inputClass}
                    />
                    {isInvalid && (
                      <p id="email-error" className={errorClass}>{field.state.meta.errors[0]?.message}</p>
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
                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label htmlFor="password" className={labelClass}>Password</label>
                    <input
                      id="password"
                      name={field.name}
                      type="password"
                      autoComplete="new-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid || undefined}
                      aria-describedby={isInvalid ? 'password-hint password-error' : 'password-hint'}
                      className={inputClass}
                    />
                    <p id="password-hint" className="pt-1 text-xs leading-4 text-[#43474d]">
                      Must be at least {PASSWORD_MIN_LENGTH} characters long.
                    </p>
                    {isInvalid && (
                      <p id="password-error" className={errorClass}>{field.state.meta.errors[0]?.message}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>
          </div>

          {/* Terms */}
          <form.Field name="acceptTerms">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="flex flex-col gap-1">
                  <div className="flex items-start">
                    <input
                      id="accept-terms"
                      name={field.name}
                      type="checkbox"
                      checked={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      aria-invalid={isInvalid || undefined}
                      aria-describedby={isInvalid ? 'accept-terms-error' : undefined}
                      className="size-4 shrink-0 cursor-pointer rounded-[4px] border border-[#e2e8f0] accent-[#0a2540] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a2540]"
                    />
                    <label htmlFor="accept-terms" className="pl-2 text-xs leading-4 text-[#43474d]">
                      I agree to the{' '}
                      {/* <Link to={paths.termsOfService} className={legalLinkClass}>Terms of Service</Link>{' '} */}
                      and{' '}
                      {/* <Link to={paths.privacyPolicy} className={legalLinkClass}>Privacy Policy</Link> */}
                    </label>
                  </div>
                  {isInvalid && (
                    <p id="accept-terms-error" className={errorClass}>{field.state.meta.errors[0]?.message}</p>
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
                className="w-full rounded-lg bg-[#0a2540] px-4 py-3 text-center text-sm leading-5 font-semibold tracking-[0.7px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#12345a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a2540] active:bg-[#061a2e] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </button>
            )}
          </form.Subscribe>
        </form>

        <div className="relative flex justify-center">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="h-px w-full border-t border-[#e2e8f0]" />
          </div>
          <span className="relative bg-white px-2 text-xs leading-4 text-[#43474d]">Already have an account?</span>
        </div>

        {/* <Link
          to={paths.signIn}
          className="w-full rounded-lg border border-[#e2e8f0] bg-white px-[17px] py-[13px] text-center text-sm leading-5 font-semibold tracking-[0.7px] text-[#0a2540] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#f9f9ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a2540] active:bg-[#f1f3fb]"
        >
          Sign In
        </Link> */}
      </section>
    </main>
  );
};

export default RegisterForm;
