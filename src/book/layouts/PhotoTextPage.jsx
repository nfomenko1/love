import PhotoFrame from './PhotoFrame.jsx'
import TextLines from './TextLines.jsx'

// Layout 4 — большая фотография + область будущего текста.
export default function PhotoTextPage({ page }) {
  const [photo] = page.photos ?? [{}]
  return (
    <div className="layout-photo-text">
      <PhotoFrame {...photo} />
      <TextLines lines={4} />
    </div>
  )
}
