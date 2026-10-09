import { Mark } from '../Ornaments.jsx'
import TextLines from './TextLines.jsx'

// Минималистичная страница под особенный момент.
export default function MomentPage() {
  return (
    <div className="layout-moment">
      <Mark />
      <TextLines lines={2} className="lb-lines--center" />
    </div>
  )
}
