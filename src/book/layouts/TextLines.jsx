// Заглушка будущего текста: несколько «строк» разной длины.
const WIDTHS = [100, 94, 98, 88, 96, 72, 100, 91, 97, 84, 99, 60]

export default function TextLines({ lines = 6, label = true, className = '' }) {
  return (
    <div className={`lb-lines ${className}`} aria-hidden="true">
      {label && <span className="lb-lines__label">text</span>}
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className="lb-lines__line" style={{ width: `${WIDTHS[i % WIDTHS.length]}%` }} />
      ))}
    </div>
  )
}
