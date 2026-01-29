import '../styles/carousel.css'
import { useRef, useState, useEffect } from 'react'

// Automatically import all images from the carousel folder
const carouselImages = import.meta.glob<{ default: string }>(
    '../assets/carousel/*.{jpg,jpeg,png,gif,webp}',
    { eager: true }
)

const images = Object.values(carouselImages).map((module) => module.default).sort()

export function Carousel({
    width = '100vw',
    height = '100vh',
}) {
    const carouselRef = useRef<HTMLDivElement>(null)
    const [currentSlide, setCurrentSlide] = useState(0)

    // Auto-scroll effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length)
        }, 8000) // Change image every 8 seconds
        return () => clearInterval(interval)
    }, [images.length])

    // Update carousel position when slide changes
    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.style.transform = `translateX(-${currentSlide * 100}%)`
        }
    }, [currentSlide])

    const handleSlideChange = (direction: number) => {
        setCurrentSlide((prev) => (prev + direction + images.length) % images.length)
    }

    return (
        <div className='carousel-container' style={{ width, height }}>
            <button
                className='carousel-button carousel-button-left'
                onClick={() => handleSlideChange(-1)}
            >
                ❮
            </button>
            <div
                className='carousel-track'
            >
                <div ref={carouselRef}
                    className='carousel-slide-container'>

                    {images.map((image, index) => (
                        <div key={index} className='carousel-slide'>
                            <img src={image} alt={`Slide ${index + 1}`} draggable={false} />
                        </div>
                    ))}
                </div>
                <div className='carousel-dots'>
                    {images.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </div>
            <button
                className='carousel-button carousel-button-right'
                onClick={() => handleSlideChange(1)}
            >
                ❯
            </button>

        </div>
    )
}

export default Carousel