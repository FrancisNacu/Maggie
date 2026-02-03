import '../styles/floating-hearts.css'

import { useMemo } from 'react'

type Props = {
  count?: number
}

export default function FloatingHearts({ count = 20 }: Props) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 12 + Math.random() * 20,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 5,
        opacity: 0.4 + Math.random() * 0.6,
      })),
    [count]
  )

  return (
    <div className="floating-hearts">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  )
}
