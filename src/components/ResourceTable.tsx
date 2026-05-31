type LegacyRow = {
  tema?: string
  gratuito?: string
  pago?: string
  deliverable?: string
}

type NewRow = {
  tipo?: string
  nombre?: string
  url?: string
  nota?: string
}

type Props = {
  rows: (LegacyRow | NewRow)[]
}

export default function ResourceTable({ rows }: Props) {
  const isNew = rows.length > 0 && 'tipo' in rows[0]

  if (isNew) {
    const typed = rows as NewRow[]
    return (
      <div className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-900">
              <th className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">Type</th>
              <th className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">Resource</th>
              <th className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">Why it fits</th>
            </tr>
          </thead>
          <tbody>
            {typed.map((row, i) => (
              <tr
                key={i}
                className="border-b border-slate-100 bg-white last:border-0 dark:border-slate-800 dark:bg-slate-950"
              >
                <td className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  {row.tipo}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {row.url ? (
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {row.nombre}
                    </a>
                  ) : (
                    row.nombre
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-500">{row.nota}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const typed = rows as LegacyRow[]
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-900">
            <th className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">Tema</th>
            <th className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">
              Recurso gratuito
            </th>
            <th className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">
              Recurso pago
            </th>
            <th className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">
              Deliverable
            </th>
          </tr>
        </thead>
        <tbody>
          {typed.map((row, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 bg-white last:border-0 dark:border-slate-800 dark:bg-slate-950"
            >
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                {row.tema}
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.gratuito}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-500">
                {row.pago ?? <span className="italic opacity-50">—</span>}
              </td>
              <td className="px-4 py-3 text-indigo-700 dark:text-indigo-400">{row.deliverable}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
