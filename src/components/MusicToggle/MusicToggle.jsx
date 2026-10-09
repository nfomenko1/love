import './MusicToggle.css'

export default function MusicToggle({ playing, onToggle }) {
  return (
    <button
      type="button"
      className={`music-toggle ${playing ? 'is-playing' : ''}`}
      onClick={onToggle}
      aria-label={playing ? 'Выключить музыку' : 'Включить музыку'}
    >
      ♪
    </button>
  )
}
