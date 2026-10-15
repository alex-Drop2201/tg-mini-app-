import { MAX_LABEL_LENGTH, MAX_OPTIONS, MIN_OPTIONS } from './options.ts'

type Props = {
  options: string[]
  disabled: boolean
  onChange: (options: string[]) => void
}

export function OptionsEditor({ options, disabled, onChange }: Props) {
  const canRemove = !disabled && options.length > MIN_OPTIONS
  const canAdd = options.length < MAX_OPTIONS

  return (
    <section className="editor">
      <h2 className="section-title">
        Варианты · {options.length} из {MAX_OPTIONS}
      </h2>
      <div className="card">
        {options.map((option, i) => (
          <div className="option" key={i}>
            <input
              value={option}
              placeholder={`Вариант ${i + 1}`}
              maxLength={MAX_LABEL_LENGTH}
              disabled={disabled}
              onChange={(e) => onChange(options.map((o, j) => (j === i ? e.target.value : o)))}
            />
            <button
              className="icon-button"
              aria-label={`Удалить вариант ${i + 1}`}
              disabled={!canRemove}
              onClick={() => onChange(options.filter((_, j) => j !== i))}
            >
              ✕
            </button>
          </div>
        ))}
        {canAdd && (
          <button
            className="add-button"
            disabled={disabled}
            onClick={() => onChange([...options, ''])}
          >
            + Добавить вариант
          </button>
        )}
      </div>
    </section>
  )
}
