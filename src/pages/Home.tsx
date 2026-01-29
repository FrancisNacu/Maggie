import { useRef, useEffect, useState } from 'react'
import image from '../assets/image.jpg'
import Carousel from '../components/Carousel.tsx'

function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const pagesCount = 4

  const handleButtonClick = () => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    for (let i = 0; i < 12; i++) {
      const heart = document.createElement('div')
      heart.innerHTML = '❤️'
      heart.className = 'exploding-heart'

      const angle = (i / 12) * Math.PI * 2
      const velocity = 8 + Math.random() * 10

      heart.style.setProperty('--tx', `${Math.cos(angle) * velocity * 60}px`)
      heart.style.setProperty('--ty', `${Math.sin(angle) * velocity * 60}px`)
      heart.style.left = centerX + 'px'
      heart.style.top = centerY + 'px'

      document.body.appendChild(heart)
      setTimeout(() => heart.remove(), 4000)
    }
  }

  const scrollToPage = (page: number) => {
    const container = containerRef.current
    if (!container) return

    setIsScrolling(true)
    container.scrollTo({
      top: page * window.innerHeight,
      behavior: 'smooth',
    })

    // unblock after smooth scroll finishes (~600ms)
    setTimeout(() => setIsScrolling(false), 600)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ---------- DESKTOP ----------
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (isScrolling) return

      if (e.deltaY > 0 && currentPage < pagesCount - 1) {
        setCurrentPage((prev) => prev + 1)
        scrollToPage(currentPage + 1)
      } else if (e.deltaY < 0 && currentPage > 0) {
        setCurrentPage((prev) => prev - 1)
        scrollToPage(currentPage - 1)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    // ---------- MOBILE ----------
    let touchStartY: number | null = null
    let touchStartTime: number | null = null

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchStartTime = e.timeStamp
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null || touchStartTime === null) return
      if (isScrolling) return

      const touchEndY = e.changedTouches[0].clientY
      const touchEndTime = e.timeStamp

      const deltaY = touchStartY - touchEndY
      const deltaTime = touchEndTime - touchStartTime
      const velocity = deltaY / deltaTime

      const minDistance = 50
      const minVelocity = 0.3

      if ((deltaY > minDistance || velocity > minVelocity) && currentPage < pagesCount - 1) {
        setCurrentPage((prev) => prev + 1)
        scrollToPage(currentPage + 1)
      } else if ((deltaY < -minDistance || velocity < -minVelocity) && currentPage > 0) {
        setCurrentPage((prev) => prev - 1)
        scrollToPage(currentPage - 1)
      }

      touchStartY = null
      touchStartTime = null
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentPage, isScrolling])

  return (
    <div
      ref={containerRef}
      className='snap-y snap-mandatory overflow-y-hidden h-svh'
      style={{ touchAction: 'pan-y', overscrollBehaviorY: 'contain' }}
    >
      <div className='snap-center h-svh page-container page-one'>
        <div className='page-one-container'>
          <div className='page-one-image'>
            <img src={image} alt='Page One' />
          </div>
          <div className='page-one-card'>
            <div className='card-content'>
              <h1 className='card-title'>Maggie</h1>
              <p className='card-subtitle'>Your special Valentine</p>
              <p className='card-description'>
                Take a journey through these beautiful moments we've shared together.
              </p>
              <div className='card-features'>
                <div className='feature'>
                  <span className='feature-icon'>💕</span>
                  <span>Beautiful memories</span>
                </div>
                <div className='feature'>
                  <span className='feature-icon'>📸</span>
                  <span>Photo gallery</span>
                </div>
                <div className='feature'>
                  <span className='feature-icon'>🎉</span>
                  <span>Special message</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='snap-center h-svh page-container page-two bg-red-50'>
        <h1>Page Two</h1>
      </div>
      <div className='snap-center h-svh page-container page-three bg-blue-50'>
        <Carousel width='95dvw' height='90dvh' />
      </div>
      <div className='snap-center h-svh page-container page-four bg-purple-50'>
        <div className='flex flex-col items-center gap-8'>
          <h1 className='text-4xl font-bold text-purple-900'>Will you be my Valentine?</h1>
          <button ref={buttonRef} onClick={handleButtonClick} className='valentine-button'>
            Accept ❤️
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
