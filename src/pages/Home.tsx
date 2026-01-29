import '../styles/App.css'
import { useRef } from 'react'
import image from '../assets/image.jpg'
import Carousel from '../components/Carousel.tsx';

function Home() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleButtonClick = () => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Create multiple hearts
    for (let i = 0; i < 12; i++) {
      const heart = document.createElement('div')
      heart.innerHTML = '❤️'
      heart.className = 'exploding-heart'
      
      // Random angle for explosion
      const angle = (i / 12) * Math.PI * 2
      const velocity = 8 + Math.random() * 10
      
      heart.style.setProperty('--tx', `${Math.cos(angle) * velocity * 60}px`)
      heart.style.setProperty('--ty', `${Math.sin(angle) * velocity * 60}px`)
      heart.style.left = centerX + 'px'
      heart.style.top = centerY + 'px'
      
      document.body.appendChild(heart)
      
      // Remove after animation completes
      setTimeout(() => heart.remove(), 4000)
    }
  }

  return (
    <div className='snap-y snap-mandatory overflow-y-scroll h-svh'>
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
            <Carousel width='95dvw' height='90dvh'></Carousel>
        </div>
        <div className='snap-center h-svh page-container page-four bg-purple-50'>
            <div className='flex flex-col items-center gap-8'>
                <h1 className='text-4xl font-bold text-purple-900'>Will you be my Valentine?</h1>
                <button 
                  ref={buttonRef}
                  onClick={handleButtonClick}
                  className='valentine-button'
                >
                    Accept ❤️
                </button>
            </div>
        </div>
    </div>
  )
}

export default Home
