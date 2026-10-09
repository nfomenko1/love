import TextLines from './TextLines.jsx'

// Layout 6 — большой текстовый блок.
export default function TextPage() {
  return (
    <div className="layout-text">
      <span className="layout-text__heading" aria-hidden="true" />
      <TextLines lines={12} />
    </div>
  )
}
