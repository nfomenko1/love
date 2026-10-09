import BlankPage from './BlankPage.jsx'
import OrnamentPage from './OrnamentPage.jsx'
import PhotoPage from './PhotoPage.jsx'
import PhotoTextPage from './PhotoTextPage.jsx'
import PhotoPairPage from './PhotoPairPage.jsx'
import TextPage from './TextPage.jsx'
import TypographyPage from './TypographyPage.jsx'
import SpreadPage from './SpreadPage.jsx'
import MomentPage from './MomentPage.jsx'
import TocPage from './TocPage.jsx'
import ChapterPage from './ChapterPage.jsx'
import PhotoFullPage from './PhotoFullPage.jsx'
import FinalPage from './FinalPage.jsx'
import PhotosPage from './PhotosPage.jsx'
import PhrasesPage from './PhrasesPage.jsx'
import AlbumPage from './AlbumPage.jsx'
import UnknownPage from './UnknownPage.jsx'

// Реестр шаблонов: type страницы → компонент.
// Новый вид страницы = новый компонент + одна строка здесь.
const layouts = {
  blank: BlankPage, // чистая страница
  text: TextPage, // clean editorial page
  ornament: OrnamentPage, // decorative page
  photo: PhotoPage, // large photo
  'photo-text': PhotoTextPage, // photo + text
  'photo-pair': PhotoPairPage, // two photos
  typography: TypographyPage, // large typography composition
  spread: SpreadPage, // transition / decorative spread (half: left | right)
  moment: MomentPage, // особенный момент
  toc: TocPage,
  chapter: ChapterPage, // текст раздела
  'photo-full': PhotoFullPage, // фото на всю страницу
  final: FinalPage,
  photos: PhotosPage, // две фотографии с асимметрией
  phrases: PhrasesPage, // короткие фразы
  album: AlbumPage, // фотоальбом: свободная композиция отпечатков
}

export function getLayout(type) {
  return layouts[type] ?? UnknownPage
}
