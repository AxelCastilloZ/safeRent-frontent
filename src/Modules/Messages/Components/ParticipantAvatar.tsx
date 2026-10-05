/** Círculo con las iniciales del participante. */
export default function ParticipantAvatar({ initials }: { initials: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-primary"
    >
      {initials}
    </span>
  )
}
