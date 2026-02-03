import { useState } from 'react'
import '../styles/flipcard.css'

interface ValentineFlipCardProps {
  title: string
  frontText: string
  backText: string
  width?: string
  height?: string
}

export default function ValentineFlipCard({
  title,
  frontText,
  backText,
  width = '320px',
  height = '420px',
}: ValentineFlipCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="val-card-wrapper">
      <div className="val-card-float">
        <div
          className={`val-card ${flipped ? 'flipped' : ''}`}
          style={
            {
              '--card-width': width,
              '--card-height': height,
            } as React.CSSProperties
          }
          onClick={() => setFlipped(!flipped)}
        >
          <div className="val-card-face val-card-front">
            <h3>{title}</h3>
            <p className="val-card-text">{frontText}</p>
          </div>

          <div className="val-card-face val-card-back">
            <p className="val-card-text">{backText}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
