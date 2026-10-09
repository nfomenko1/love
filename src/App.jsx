import { useEffect, useState } from 'react'
import { site } from './config/site.js'
import { useBackgroundMusic } from './hooks/useBackgroundMusic.js'
import Intro from './components/Intro/Intro.jsx'
import Hero from './components/Hero/Hero.jsx'
import BookSection from './components/BookSection.jsx'
import FinalScene from './components/FinalScene.jsx'
import Ambient from './components/Ambient/Ambient.jsx'

export default function App() {
  // 'intro' → 'leaving' (затухание интро) → 'done'
  const [stage, setStage] = useState('intro')
  const music = useBackgroundMusic(site.music)

  // Скролл заблокирован на время интро и перехода в Hero.
  useEffect(() => {
    document.body.classList.toggle('is-locked', stage !== 'done')
  }, [stage])

  const handleStart = () => {
    music.play()
    window.scrollTo(0, 0)
    setStage('leaving')
  }

  return (
    <>
      {stage !== 'done' && (
        <Intro {...site.intro} onStart={handleStart} onDone={() => setStage('done')} />
      )}

      {/* Одна общая атмосфера для Hero, книги и финала: закреплена за всеми
          секциями и не перезапускается при переходах между ними */}
      <Ambient variant="light" className="site-ambient" />

      <main aria-hidden={stage === 'intro'}>
        {/* Hero начинает проявляться, пока интро ещё растворяется поверх него */}
        <Hero {...site.hero} revealed={stage !== 'intro'} />
        <BookSection />
        <FinalScene {...site.final} />
      </main>
    </>
  )
}
