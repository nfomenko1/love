import { useId } from 'react'
import { INFINITY } from './Ornaments.jsx'

// Обложка книги:
//   InsideCover — внутренняя сторона передней крышки (левая страница первого
//     разворота): кожаный загиб по краям и чистый тёмный форзац.
//     Рисуется на стороне 0 в page-flip (см. BookFace) и на обороте раскрывающейся
//     крышки (см. LoveBook).
//   CoverFront — лицевая сторона закрытой книги: кожа, слепая рамка, название,
//     знак бесконечности и имена приглушённым золотом.

const FONT = "'Cormorant Garamond', 'Cormorant', Georgia, 'Times New Roman', serif"

function Foil({ id }) {
  return (
    <defs>
      <linearGradient id={`foil-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7f6440" />
        <stop offset="0.45" stopColor="#b89c68" />
        <stop offset="0.6" stopColor="#97794a" />
        <stop offset="1" stopColor="#a88d5c" />
      </linearGradient>
      <filter id={`deboss-${id}`} x="-5%" y="-20%" width="110%" height="140%">
        <feDropShadow dx="0" dy="-0.4" stdDeviation="0.2" floodColor="#12030a" floodOpacity="0.85" />
        <feDropShadow dx="0" dy="0.5" stdDeviation="0.25" floodColor="#f0d8a4" floodOpacity="0.1" />
      </filter>
    </defs>
  )
}

export function InsideCover() {
  return (
    <>
      <div className="lb-leather" />
      <div className="lb-endpaper" />
    </>
  )
}

// Лицевая сторона крышки: двойная слепая рамка и тиснение фольгой —
// «ИСТОРИЯ ЛЮБВИ», крупный знак бесконечности между волосяными линиями
// и имена — светлым курсивом, заметно тише заголовка.
export function CoverFront({ title = '', names = '' }) {
  const id = useId().replace(/:/g, '')
  const foil = `url(#foil-${id})`
  return (
    <svg className="lb-cover-front" viewBox="0 0 400 560" aria-label={[title, names].filter(Boolean).join('. ')}>
      <Foil id={id} />
      <g opacity="0.92">
        {/* Тонкая рамка вокруг композиции: углы-уголки */}
        <g fill="none" stroke={foil} strokeWidth="0.45" opacity="0.7">
          <path d="M92 168V156H104M308 168V156H296M92 392V404H104M308 392V404H296" />
          <path d="M200 150.6L202.6 153.2 200 155.8 197.4 153.2Z" />
          <path d="M200 404.2L202.6 406.8 200 409.4 197.4 406.8Z" />
        </g>
        {/* Текст без фильтра тиснения — фольга остаётся, а буквы резкие */}
        <g fill={foil} textAnchor="middle" fontFamily={FONT} textRendering="geometricPrecision">
          <text x="200" y="232" fontSize="24" fontWeight="500" letterSpacing="5.6">
            {title.toUpperCase()}
          </text>
          <text x="200" y="355" fontSize="21.5" fontWeight="300" fontStyle="italic" letterSpacing="1.8">
            {names}
          </text>
        </g>
        {/* Бесконечность: двойной контур (основной и волосяной) и линии с ромбами */}
        <g fill="none" stroke={foil}>
          <path d={INFINITY} transform="translate(200 290) scale(3.2)" strokeWidth="0.26" />
          <path d={INFINITY} transform="translate(200 290) scale(3.2 2.8)" strokeWidth="0.1" opacity="0.6" />
          <path d="M118 290H144M256 290H282" strokeWidth="0.45" />
          <path d="M114 287.6L116.4 290 114 292.4 111.6 290ZM286 287.6L288.4 290 286 292.4 283.6 290Z" strokeWidth="0.45" />
        </g>
      </g>
    </svg>
  )
}
