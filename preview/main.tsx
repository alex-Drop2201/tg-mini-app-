import { createRoot } from 'react-dom/client'
import { Chibi, type ChibiStyle, type Expression } from '../src/pet/chibi/Chibi.tsx'
import { Doodle, type DoodleStyle } from '../src/pet/doodle/Doodle.tsx'
import { FURS, SPECIES, type FurId, type SpeciesId } from '../src/pet/look.ts'

const params = new URLSearchParams(location.search)
const mode = params.get('mode') ?? 'styles'
const style = (params.get('style') as ChibiStyle) ?? 'gloss'
const species = Object.keys(SPECIES) as SpeciesId[]
const faces: Expression[] = ['ok', 'happy', 'joy', 'sad', 'sleep']
const box = { background: 'linear-gradient(#fdebd8,#f6d9bf)', borderRadius: 18 }

const STYLES: [ChibiStyle, string, string][] = [
  ['gloss', 'A. Глянцевый', 'объём, тонкий контур, большие глаза-бусины'],
  ['flat', 'B. Мультяшный', 'плоские цвета, жирный контур, как стикеры'],
  ['plush', 'C. Плюшевый', 'мягкий объём, пушок, глаза с цветной радужкой'],
]

const DOODLES: [DoodleStyle, string, string, Record<string, string>][] = [
  ['line', '1. Чистая линия', 'как колли и утёнок: ровный контур, глаза-точки', { dachshund: '#ffffff', cat: '#ffffff', fox: '#ffffff' }],
  ['googly', '2. Глаза-пуговицы', 'тот же контур, большие белые глаза с зрачками', { dachshund: '#ffe3ec', cat: '#fff3c4', fox: '#e3f4d9' }],
  ['painted', '3. Рисованный', 'как ослик и бобёр: шершавый контур, фактура, яркий фон', { dachshund: '#ff8fb1', cat: '#ffd84d', fox: '#8fd17a' }],
]

function App() {
  if (mode === 'doodle') {
    return (
      <div style={{ padding: 12, width: 800 }}>
        {DOODLES.map(([st, title, sub, bg]) => (
          <div key={st} style={{ marginBottom: 14 }}>
            <div style={{ font: '700 26px -apple-system,Roboto,sans-serif', margin: '0 4px 2px' }}>{title}</div>
            <div style={{ font: '18px -apple-system,Roboto,sans-serif', color: '#666', margin: '0 4px 8px' }}>{sub}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {(['dachshund', 'cat', 'fox'] as SpeciesId[]).map((s) => (
                <svg key={s} viewBox="-6 -10 212 212" style={{ width: 252, height: 252, background: bg[s], borderRadius: 18, border: st === 'line' ? '1px solid #e5e5ea' : 'none' }}>
                  <Doodle species={s} fur={FURS[SPECIES[s].defaultFur]} style={st} />
                </svg>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
  if (mode === 'styles') {
    return (
      <div style={{ padding: 12, width: 800 }}>
        {STYLES.map(([st, title, sub]) => (
          <div key={st} style={{ marginBottom: 14 }}>
            <div style={{ font: '700 26px -apple-system,Roboto,sans-serif', margin: '0 4px 2px' }}>{title}</div>
            <div style={{ font: '18px -apple-system,Roboto,sans-serif', color: '#666', margin: '0 4px 8px' }}>{sub}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {(['dachshund', 'cat', 'fox'] as SpeciesId[]).map((s) => (
                <svg key={s} viewBox="0 -4 200 200" style={{ width: 252, height: 252, ...box }}>
                  <Chibi species={s} fur={FURS[SPECIES[s].defaultFur]} expression="happy" style={st} />
                </svg>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
  if (mode === 'furs') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 10, width: 820 }}>
        {(Object.keys(FURS) as FurId[]).map((f) => (
          <svg key={f} viewBox="0 -4 200 200" style={{ width: 150, height: 150, background: '#fff', borderRadius: 16 }}>
            <Chibi species={(params.get('s') as SpeciesId) ?? 'cat'} fur={FURS[f]} expression="ok" style={style} />
          </svg>
        ))}
      </div>
    )
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 150px)', gap: 8, padding: 10 }}>
      {species.flatMap((s) => faces.map((e) => (
        <svg key={s + e} viewBox="0 -4 200 200" style={{ width: 150, height: 150, background: '#fff', borderRadius: 16 }}>
          <Chibi species={s} fur={FURS[SPECIES[s].defaultFur]} expression={e} style={style} />
        </svg>
      )))}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
