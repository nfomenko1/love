// Финальная страница книги. Внизу на месте номера страницы — знак ∞
// (page.numberLabel, см. BookFace): «история продолжается».
export default function FinalPage({ page }) {
  return (
    <div className="layout-final">
      <span className="layout-final__rule" aria-hidden="true" />
      <h4 className="layout-final__title">{page.title}</h4>
      {page.subtitle && <p className="layout-final__subtitle">{page.subtitle}</p>}
      {/* Пауза вместо точки в конце фразы */}
      <span className="layout-final__pause" aria-hidden="true" />
    </div>
  )
}
