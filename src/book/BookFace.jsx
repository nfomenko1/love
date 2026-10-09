import { getLayout } from './layouts/index.js'
import { InsideCover } from './BookCover.jsx'
import { FlyleafHeart } from './Ornaments.jsx'

const formatNumber = (n) => String(n).padStart(2, '0')

// Одна сторона листа внутри page-flip.
export default function BookFace({ face }) {
  // Сторона 0 — внутренняя сторона обложки: кожа и чистый форзац
  if (face.kind === 'inside') {
    return (
      <div className="lb-inside-face">
        <div className="lb-inside">
          <InsideCover />
        </div>
      </div>
    )
  }
  // Чистый лист перед последней страницей (финалом) — крупный контур сердца
  if (face.kind === 'flyleaf')
    return (
      <div className="lb-paper">
        <FlyleafHeart className="lb-flyleaf__heart" />
      </div>
    )

  const { page, number, showNumber } = face
  const Layout = getLayout(page.type)
  const label = page.numberLabel ?? (showNumber ? formatNumber(number) : null)

  return (
    <div className={`lb-paper lb-sheet lb-sheet--${page.type}${page.special ? ' lb-sheet--special' : ''}`}>
      <div className="lb-sheet__body">
        <Layout page={page} />
      </div>
      {label && <div className="lb-sheet__number">{label}</div>}
    </div>
  )
}
