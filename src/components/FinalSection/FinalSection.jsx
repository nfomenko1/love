import './FinalSection.css'

// «Я люблю тебя ❤️»: текст и сердце — отдельные части одной строки.
// У эмодзи широкие боковые поля шрифта, поэтому сердце стоит в боксе шириной
// в 1em: центрируется видимая связка «текст + сердце», а не текст с полями.
const HEART_AT_END = /^(.*?)\s*(\p{Extended_Pictographic}\uFE0F?)$/u

export default function FinalSection({ title, lines, signature }) {
  const [, text, heart] = signature.match(HEART_AT_END) ?? [null, signature, null]
  return (
    <section className="section final">
      <h2 className="final__title">{title}</h2>
      <p className="final__text">
        {lines.map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </p>
      <p className="final__signature">
        {heart ? (
          <>
            <span>{text}</span>
            <span className="final__heart">{heart}</span>
          </>
        ) : (
          signature
        )}
      </p>
    </section>
  )
}
