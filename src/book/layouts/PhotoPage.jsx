import PhotoFrame from './PhotoFrame.jsx'

// Layout 3 — большая область под одну фотографию.
export default function PhotoPage({ page }) {
  const [photo] = page.photos ?? [{}]
  return (
    <div className="layout-photo">
      <PhotoFrame {...photo} className="lb-photo--mounted" />
    </div>
  )
}
