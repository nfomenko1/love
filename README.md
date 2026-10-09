# Вместе 1 год

Личный сайт-сюрприз к годовщине (09.11.2026 — 09.11.2027): интро → hero → интерактивная
3D-книга «Наша история любви» → финал.

## Запуск

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production-сборка в dist/
npm run preview   # просмотр сборки
```

Стек: React 19 + Vite, чистый CSS (3D-трансформации), без сторонних анимационных библиотек.

## Где что менять

| Что                                     | Где                        |
| --------------------------------------- | -------------------------- |
| Страницы книги (тексты, фото, порядок)  | `src/content/book.js`      |
| Тексты интро / hero / финала, музыка    | `src/config/site.js`       |
| Цвета и шрифты                          | `src/styles/tokens.css`    |
| Фотографии                              | `public/photos/`           |
| Музыка                                  | `public/audio/`            |

## Структура

```
src/
  config/site.js          тексты секций + настройки музыки
  content/book.js         КОНТЕНТ книги (обложка + массив страниц)
  book/                   ДВИЖОК книги (ничего не знает о контенте)
    LoveBook.jsx          корневой компонент: сцена, листы, управление, клавиатура, свайпы
    buildBook.js          контент → физическая модель (стороны, листы, развороты)
    useBookNavigation.js  состояние: текущий разворот, next / prev / goTo
    BookContext.js        доступ к навигации для шаблонов страниц
    BookSheet.jsx         один лист (лицо + оборот), анимация переворота
    BookFace.jsx          одна сторона листа: обложка / форзац / страница
    BookCover.jsx         обложка
    PageIndicator.jsx     «3–4 / 9», на финале — «9 / ∞»
    LoveBook.css          3D-механика и стили книги
    layouts/              шаблоны страниц по type (text, photo, toc, final, blank)
  components/             Intro, Hero, BookSection, FinalSection, MusicToggle
  hooks/useBackgroundMusic.js
```

## Добавить страницу

Добавьте объект в `pages` в `src/content/book.js` — движок менять не нужно:

```js
{ id: 'sea', type: 'photo', layout: 'top', inToc: true,
  title: 'Море', text: 'Подпись', photos: [{ src: 'photos/sea.jpg', alt: 'Море' }] }
```

Нечётные страницы — справа, чётные — слева. Чтобы финал был справа, держите число
страниц нечётным (при необходимости вставьте `{ id: 'b1', type: 'blank' }`).

Новый *вид* страницы: компонент в `src/book/layouts/` + одна строка в `layouts/index.js`.
