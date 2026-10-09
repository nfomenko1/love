// Превращает контент книги в плоский список сторон листов для page-flip:
//
//   [внутренняя сторона обложки, стр.1, стр.2, …, (чистый лист), последняя страница]
//
// Сторона 0 — «твёрдая» (кожаная крышка), остальные — бумага.
// В разворотном режиме страница с нечётным индексом лежит справа, с чётным — слева.
// Последняя страница всегда справа: если нужно, перед ней вставляется чистый лист.

export function buildBook({ pages }) {
  const faces = [{ key: '__inside-cover', kind: 'inside', hard: true }]

  pages.forEach((page, index) => {
    faces.push({
      key: page.id ?? `page-${index}`,
      kind: 'page',
      page,
      number: index + 1,
      showNumber: page.numbered ?? true,
    })
  })

  // page-flip собирает развороты парами — нужно чётное число сторон;
  // недостающий лист ставим перед последней страницей, чтобы она осталась справа.
  if (faces.length % 2 !== 0) {
    faces.splice(faces.length - 1, 0, { key: '__flyleaf', kind: 'flyleaf' })
  }

  return { faces }
}
