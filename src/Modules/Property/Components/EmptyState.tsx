import { Inbox } from 'lucide-react'

type EmptyStateProps = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-slate-100 text-slate-400">
        <Inbox size={32} />
      </div>
      <h2 className="text-xl font-bold text-primary">{title}</h2>
      {description && <p className="mt-2 max-w-sm text-sm text-muted-ink">{description}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          className="mt-6 rounded-xl bg-secondary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-dark"
          onClick={onAction}
        >
          + {actionLabel}
        </button>
      )}
    </div>
  )
}
