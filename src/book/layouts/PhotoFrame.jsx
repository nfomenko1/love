import { useEffect, useRef } from 'react'
import { asset } from '../../utils/asset.js'

// Фото внутри книги. Пока src не задан — нейтральная заглушка с подписью PHOTO.
//
// Загрузка — обычная (не lazy): страницы книги существуют с самого начала, но
// скрыты до своего разворота, и при lazy-загрузке фото начинало качаться и
// декодироваться прямо во время перелистывания. Здесь же сразу после загрузки
// изображение заранее декодируется (img.decode()) — без блокировки страницы;
// если фото не загрузилось, ошибка просто игнорируется.
export default function PhotoFrame({ src, alt = '', className = '', style }) {
  const imgRef = useRef(null)

  useEffect(() => {
    const img = imgRef.current
    if (!img?.decode) return
    img.decode().catch(() => {})
  }, [src])

  return (
    <figure className={`lb-photo ${className}`} style={style}>
      {src ? (
        <img
          ref={imgRef}
          className="lb-photo__img"
          src={asset(src)}
          alt={alt}
          decoding="async"
          draggable="false"
        />
      ) : (
        <div className="lb-photo__placeholder" aria-hidden="true">
          <span>photo</span>
        </div>
      )}
    </figure>
  )
}
