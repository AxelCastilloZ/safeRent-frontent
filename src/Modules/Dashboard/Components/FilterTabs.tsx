interface FilterTabsProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

/** Filtros en forma de pestañas (Todas / Activas / …) para las listas del panel. */
export default function FilterTabs<T extends string>({ label, options, value, onChange }: FilterTabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className="mb-5 flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              selected
                ? 'border-primary bg-primary text-white'
                : 'border-slate-200 bg-white text-primary hover:border-secondary'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
