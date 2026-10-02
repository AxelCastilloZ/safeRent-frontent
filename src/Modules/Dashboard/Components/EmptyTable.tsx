interface EmptyTableProps {
  caption: string;
  columns: string[];
  emptyMessage: string;
}

/** Tabla con sus columnas ya definidas pero sin filas (la pantalla está lista y falta el backend). */
export default function EmptyTable({ caption, columns, emptyMessage }: EmptyTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-muted-ink">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-ink">
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
