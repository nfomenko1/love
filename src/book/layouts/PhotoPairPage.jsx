import PhotoFrame from './PhotoFrame.jsx'
import TextLines from './TextLines.jsx'

// Layout 5 — две фотографии рядом.
export default function PhotoPairPage({ page }) {
  const photos = page.photos ?? [{}, {}]
  return (
    <div className="layout-photo-pair">
      <div className="layout-photo-pair__row">
        {photos.slice(0, 2).map((photo, i) => (
          <PhotoFrame key={i} {...photo} />
        ))}
      </div>
      <TextLines lines={2} label={false} />
    </div>
  )
}
