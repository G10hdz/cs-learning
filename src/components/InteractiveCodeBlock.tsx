import { useMemo, useState } from 'react'

type Props = {
  title: string
  description?: string
  code: string
}

export default function InteractiveCodeBlock({ title, description, code }: Props) {
  const [output, setOutput] = useState('')

  const runSnippet = useMemo(
    () => () => {
      try {
        const result = new Function(`"use strict";${code}`)()
        setOutput(result === undefined ? 'Executed successfully.' : String(result))
      } catch (error) {
        setOutput(error instanceof Error ? error.message : String(error))
      }
    },
    [code]
  )

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
        <button
          type="button"
          onClick={runSnippet}
          className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          Run
        </button>
      </div>
      <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
        <code>{code}</code>
      </pre>
      <div className="mt-2 rounded-md bg-slate-100 p-2 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        Output: {output || 'No output yet'}
      </div>
    </div>
  )
}
