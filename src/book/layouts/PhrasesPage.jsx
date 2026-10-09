import { Rule, HeartOutline } from '../Ornaments.jsx'

// Типографская страница: несколько коротких фраз курсивом, между ними —
// маленькие контуры сердца. null — заготовка фразы (тонкая строка).
// numeral/title — необязательный заголовок главы над фразами.
// hearts: false — без сердечек между фразами (длинный список, глава 05).
export default function PhrasesPage({ page }) {
  const phrases = page.phrases ?? []
  return (
    <div className={`layout-phrases${page.hearts === false ? ' layout-phrases--plain' : ''}`}>
      {(page.numeral || page.title) && (
        <header className="layout-phrases__head">
          {page.numeral && <span className="layout-chapter__numeral">{page.numeral}</span>}
          <Rule className="layout-phrases__rule" />
          {page.title && <h3 className="layout-chapter__title">{page.title}</h3>}
        </header>
      )}
      <ul className="layout-phrases__list">
        {phrases.map((phrase, i) => (
          <li key={i} className="layout-phrases__item">
            {i > 0 && page.hearts !== false && <HeartOutline className="layout-phrases__heart" />}
            {phrase ? (
              <p className="layout-phrases__text">{phrase}</p>
            ) : (
              <span className="layout-phrases__placeholder" aria-hidden="true">
                <span />
                <span />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
