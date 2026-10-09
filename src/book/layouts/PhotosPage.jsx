import PhotoFrame from './PhotoFrame.jsx'

// Две фотографии на странице — с лёгкой асимметрией, не стандартной сеткой.
// variant: 'stack'   — крупная сверху, вторая ниже со сдвигом вправо (глава 03)
//          'stagger' — две вертикальные рядом, вторая ниже первой (глава 04)
//          'duo'     — крупная и маленькая разного размера, внахлёст (глава 07)
export default function PhotosPage({ page }) {
  const photos = page.photos ?? [{}, {}]
  return (
    <div className={`layout-photos layout-photos--${page.variant ?? 'stack'}`}>
      {[0, 1].map((i) => (
        <PhotoFrame key={i} {...(photos[i] ?? {})} className={`layout-photos__item layout-photos__item--${i + 1}`} />
      ))}
    </div>
  )
}
