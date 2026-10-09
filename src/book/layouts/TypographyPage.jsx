import TextLines from './TextLines.jsx'

// Крупная типографская композиция: открытие главы с большим номером.
// Номер — технический (page.numeral), не содержание истории.
export default function TypographyPage({ page }) {
  return (
    <div className="layout-typography">
      <span className="layout-typography__numeral">{page.numeral ?? '01'}</span>
      <span className="layout-typography__rule" aria-hidden="true" />
      <TextLines lines={3} label={false} />
    </div>
  )
}
