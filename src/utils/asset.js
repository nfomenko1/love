// Превращает путь к файлу из /public в корректный URL с учётом base из vite.config.
export function asset(path) {
  if (!path) return null
  if (/^(https?:|data:|blob:)/.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}
