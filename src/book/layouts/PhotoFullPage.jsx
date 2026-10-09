import PhotoFrame from './PhotoFrame.jsx'

// Фотография на всю страницу (внутри полей). Если фотографий несколько —
// они делят ту же область сеткой 2 × 2 с одинаковым промежутком.
export default function PhotoFullPage({ page }) {
  const photos = page.photos?.length ? page.photos : [{}]
  return (
    <div className={`layout-photo-full${photos.length > 1 ? ' layout-photo-full--grid' : ''}`}>
      {photos.map((photo, i) => (
        <PhotoFrame key={i} {...photo} />
      ))}
    </div>
  )
}
