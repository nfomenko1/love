import { Rule } from '../Ornaments.jsx'
import PhotoFrame from './PhotoFrame.jsx'
import TextLines from './TextLines.jsx'

// Текст раздела: номер, название и короткие смысловые блоки с воздухом между ними.
// blocks: строка — обычный абзац, { text, accent: true } — курсивная «пауза».
// Пока текст не написан — lines строк-заготовок.
// numeral/title необязательны: без них страница — продолжение главы.
// photo: 'top' | 'bottom' — фотография над / под текстом, забирает оставшуюся высоту.
// ending — тонкий орнамент в конце текста.
// compact — более мелкий и узкий текст (короткие блоки над фотографией).
// tight — плотнее межстрочный интервал и отступы (фото под текстом поднимается выше,
//         длинный текст не прижимается к низу страницы).
// bullets — абзацы как пункты списка с точкой-маркером.
export default function ChapterPage({ page }) {
  const blocks = page.blocks ?? []
  const hasHead = page.numeral || page.title
  const photo = page.photo && <PhotoFrame {...(page.photos?.[0] ?? {})} className="layout-chapter__photo" />
  const classes = [
    'layout-chapter',
    page.photo && `layout-chapter--photo-${page.photo}`,
    page.photoSize && `layout-chapter--photo-${page.photoSize}`,
    !page.photo && 'layout-chapter--text',
    page.compact && 'layout-chapter--compact',
    page.tight && 'layout-chapter--tight',
    page.bullets && 'layout-chapter--bullets',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {page.photo === 'top' && photo}
      {hasHead && (
        <header className="layout-chapter__head">
          {page.numeral && <span className="layout-chapter__numeral">{page.numeral}</span>}
          <Rule className="layout-chapter__rule" />
          {page.title && <h3 className="layout-chapter__title">{page.title}</h3>}
        </header>
      )}
      <div className="layout-chapter__body">
        {blocks.length
          ? blocks.map((block, i) => {
              const { text, accent } = typeof block === 'string' ? { text: block } : block
              return (
                <p key={i} className={`layout-chapter__block${accent ? ' is-accent' : ''}`}>
                  {text}
                </p>
              )
            })
          : page.lines > 0 && <TextLines lines={page.lines} />}
      </div>
      {page.ending && <Rule className="layout-chapter__ending" />}
      {page.photo === 'bottom' && photo}
    </div>
  )
}
