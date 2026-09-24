import type { ChangeEvent, HTMLInputTypeAttribute } from 'react'

type TextFieldProps = {
  id: string
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  type?: HTMLInputTypeAttribute
  autoComplete?: string
  error?: string
  hint?: string
  className?: string
}

export function TextField({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  autoComplete,
  error,
  hint,
  className = '',
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm leading-5 font-semibold tracking-[0.7px] text-[#111c2d]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={handleChange}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="h-[38px] w-full rounded-lg border border-[#e2e8f0] bg-white px-3 text-sm text-[#111c2d] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-colors outline-none hover:border-[#cbd5e1] focus:border-[#0a2540] focus:ring-2 focus:ring-[#0a2540]/15 aria-invalid:border-[#ba1a1a] aria-invalid:focus:ring-[#ba1a1a]/15"
      />
      {hint && (
        <p id={hintId} className="pt-1 text-xs leading-4 text-[#43474d]">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs leading-4 text-[#ba1a1a]">
          {error}
        </p>
      )}
    </div>
  )
}
