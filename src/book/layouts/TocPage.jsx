import { Rule } from '../Ornaments.jsx'

// Оглавление: заголовок, тонкий орнамент и номера разделов.
// entries: [{ num, title? } | null] — null даёт паузу между группами.
export default function TocPage({ page }) {
  const entries = page.entries ?? []
  return (
    <div className="layout-toc">
      <Rule className="layout-toc__ornament" />
      <h3 className="layout-toc__title">{page.title ?? 'Оглавление'}</h3>
      <ol className="layout-toc__list">
        {entries.map((entry, i) =>
          entry ? (
            <li key={i} className={`layout-toc__item${entry.title ? '' : ' is-future'}`}>
              <span className="layout-toc__num">{entry.num}</span>
              {entry.title && <span className="layout-toc__name">{entry.title}</span>}
              <span className="layout-toc__line" aria-hidden="true" />
            </li>
          ) : (
            <li key={i} className="layout-toc__gap" aria-hidden="true" />
          ),
        )}
      </ol>
    </div>
  )
}
