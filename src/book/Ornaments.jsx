// Тонкие орнаменты страниц книги. Линии — волосяные, как у дорогого переплёта.

// Монолинейное сердце: две дуги и сходящиеся линии, без «мультяшной» пухлости
const HEART = 'M0 9L-9.5-1.2A5.4 5.4 0 0 1 0-7.4A5.4 5.4 0 0 1 9.5-1.2Z'

// Тонкая линейка с ромбом — для декоративных страниц
export function Rule({ className = '' }) {
  return (
    <svg className={`lb-rule ${className}`} viewBox="-60 -6 120 12" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M-58 0H-9M9 0H58" />
        <path d="M0-4.5L5 0 0 4.5-5 0Z" />
      </g>
    </svg>
  )
}

// Тонкий контур сердца — для атмосферы книги и первой страницы
export function HeartOutline({ className = '' }) {
  return (
    <svg className={className} viewBox="-12 -10 24 21" aria-hidden="true">
      <path d={HEART} fill="none" stroke="currentColor" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

// Крупное сердце для чистого листа напротив финала: тонкий двойной контур,
// пунктир по форме внутри и несколько маленьких сердец вокруг (не внутри)
const SMALL_HEARTS = [
  [-40, -38, 0.55, -14],
  [37, -45, 0.4, 12],
  [2, -51, 0.3, 0],
  [-44, 8, 0.38, -8],
  [43, -2, 0.6, 10],
  [-30, 37, 0.45, -16],
  [29, 34, 0.32, 14],
  [1, 41, 0.42, 4],
]
export function FlyleafHeart({ className = '' }) {
  return (
    <svg className={className} viewBox="-50 -56 100 104" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
        <path d={HEART} transform="translate(0 -6) scale(3)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path
          d={HEART}
          transform="translate(0 -7) scale(2.7)"
          strokeWidth="0.6"
          opacity="0.75"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={HEART}
          transform="translate(0 -8.6) scale(2.2)"
          strokeWidth="0.8"
          strokeDasharray="1 2.4"
          strokeLinecap="round"
          opacity="0.8"
          vectorEffect="non-scaling-stroke"
        />
        {SMALL_HEARTS.map(([x, y, s, r]) => (
          <path
            key={`${x},${y}`}
            d={HEART}
            transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
            strokeWidth="0.7"
            opacity="0.8"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  )
}

// Малый знак (ромб с сердцем) — для страницы «особенный момент»
export function Mark({ className = '' }) {
  return (
    <svg className={`lb-mark ${className}`} viewBox="-34 -34 68 68" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinejoin="round">
        <path d="M0-30L20 0 0 30-20 0Z" strokeWidth="0.5" />
        <path d={HEART} transform="translate(0 1)" strokeWidth="0.7" />
      </g>
    </svg>
  )
}

// Знак бесконечности — одна непрерывная линия
export const INFINITY = 'M0 0C-4.5-6.2-15-6.2-15 0S-4.5 6.2 0 0 15-6.2 15 0 4.5 6.2 0 0Z'

// Декоративный разворот: тонкий контур сердца со знаком бесконечности внутри,
// едва заметная окружность и несколько точек-штрихов. Центр — на корешке,
// каждая страница показывает свою половину.
export function SpreadEmblem() {
  const dots = [-150, -120, -60, -30, 30, 60, 120, 150]
  return (
    <svg className="lb-spread__emblem" viewBox="-100 -100 200 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke">
        <circle r="62" strokeWidth="0.5" opacity="0.55" vectorEffect="non-scaling-stroke" />
        <path d="M-96 0H-74M74 0H96" strokeWidth="0.6" opacity="0.7" vectorEffect="non-scaling-stroke" />
        <path
          d={HEART}
          transform="translate(0 -2) scale(3.4)"
          strokeWidth="0.9"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path d={INFINITY} transform="translate(0 0) scale(0.95)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      </g>
      <g fill="currentColor">
        {dots.map((a) => (
          <circle
            key={a}
            cx={(Math.cos((a * Math.PI) / 180) * 70).toFixed(2)}
            cy={(Math.sin((a * Math.PI) / 180) * 70).toFixed(2)}
            r={Math.abs(a) === 90 || Math.abs(a) % 60 === 0 ? 0.9 : 0.6}
            opacity="0.6"
          />
        ))}
        <path d="M0-74.5L1.6-72 0-69.5-1.6-72Z" opacity="0.7" />
        <path d="M0 74.5L1.6 72 0 69.5-1.6 72Z" opacity="0.7" />
      </g>
    </svg>
  )
}
