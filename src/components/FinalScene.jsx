import { useRef } from 'react'
import FinalSection from './FinalSection/FinalSection.jsx'
import { useScrollStyle, clamp01, smooth } from '../hooks/useScrollStyle.js'

// Сцена финала. Начинается вместе с растворением закрытой книги (см. .final-scene),
// а её содержимое закреплено (sticky) — поэтому финал проявляется на том же месте:
// opacity 0 → 1, blur 8px → 0, лёгкий подъём. Проявление начинается, пока книга
// ещё тает, — пустого экрана между ними нет.
function enterStyle(rect, vh) {
  const t = clamp01(-rect.top / vh)
  const p = smooth(clamp01((t - 0.3) / 0.65))
  const k = 1 - p
  return {
    opacity: p.toFixed(4),
    filter: k > 0.001 ? `blur(${(k * 8).toFixed(2)}px)` : '',
    transform: k > 0.001 ? `translateY(${(k * 18).toFixed(1)}px)` : '',
    visibility: p <= 0 ? 'hidden' : '',
  }
}

export default function FinalScene(props) {
  const sceneRef = useRef(null)
  const contentRef = useRef(null)
  useScrollStyle(contentRef, enterStyle, sceneRef)

  return (
    <div ref={sceneRef} className="final-scene">
      <div className="final-scene__stage">
        <div ref={contentRef} className="final-scene__content">
          <FinalSection {...props} />
        </div>
      </div>
    </div>
  )
}
