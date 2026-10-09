import PhotoFrame from './PhotoFrame.jsx'

// Страница фотоальбома: свободная композиция из нескольких отпечатков.
// photos: [{ src, ratio, x, y, w }]
//   ratio   — ширина / высота снимка: рамка повторяет его пропорции, без обрезки;
//   x, y, w — левый верхний угол и ширина отпечатка в cqw (ширина страницы = 100cqw)
//             внутри поля страницы 84 × 122cqw. Положения подобраны так,
//             чтобы отпечатки не накладывались друг на друга.
export default function AlbumPage({ page }) {
  return (
    <div className="layout-album">
      {(page.photos ?? []).map((photo, i) => (
        <PhotoFrame
          key={i}
          src={photo.src}
          alt={photo.alt}
          className="layout-album__item"
          style={{ left: `${photo.x}cqw`, top: `${photo.y}cqw`, width: `${photo.w}cqw`, '--r': photo.ratio }}
        />
      ))}
    </div>
  )
}
