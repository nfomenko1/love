import { Rule, HeartOutline } from '../Ornaments.jsx'

// Декоративная страница (первая в книге): тонкие линии, едва заметный контур
// сердца и мягкое пятно света — та же атмосфера, что и вокруг книги.
export default function OrnamentPage() {
  return (
    <div className="layout-ornament">
      <span className="layout-ornament__glow" aria-hidden="true" />
      <span className="layout-ornament__line layout-ornament__line--top" aria-hidden="true" />
      <HeartOutline className="layout-ornament__heart" />
      <Rule />
      <span className="layout-ornament__line layout-ornament__line--bottom" aria-hidden="true" />
    </div>
  )
}
