import { useCallback, useEffect, useRef, useState } from 'react'
import { asset } from '../utils/asset.js'

// Фоновая музыка. Запускается только по действию пользователя (play()).
// Если файл не найден — тихо работает без звука (available = false).
export function useBackgroundMusic({ src, volume = 0.6, loop = true }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(Boolean(src))

  useEffect(() => {
    if (!src) return
    const audio = new Audio(asset(src))
    audio.loop = loop
    audio.volume = volume
    audio.preload = 'auto'
    const onError = () => setAvailable(false)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('error', onError)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.removeEventListener('error', onError)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audioRef.current = null
    }
  }, [src, volume, loop])

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {})
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }, [])

  return { play, toggle, playing, available }
}
