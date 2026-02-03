import { useRef, useEffect, useState } from 'react'
import image from '../assets/image.jpg'
import Carousel from '../components/Carousel.tsx'
import ValentineFlipCard from '../components/FlipCard.tsx'

function Home() {
    const containerRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const [isScrolling, setIsScrolling] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const pagesCount = 4

    // ---------- VALENTINE TEASE STATE ----------
    const [showAccept, setShowAccept] = useState(true)
    const [teaseStage, setTeaseStage] = useState<
        'idle' | 'tease' | 'retry' | 'countdown'
    >('idle')
    const [countdown, setCountdown] = useState(3)
    const [teaseCycle, setTeaseCycle] = useState(0)

    const hasAcceptedRef = useRef(false)

    // ---------- ACCEPT BUTTON POSITION ----------
    const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 })

    // ---------- PLAYFUL PREFIX POOL ----------
    const prefixPool = [
        'Soooo…',
        'Hmm.',
        'Okay but like…',
        'Be honest.',
        'Not you',
        'Girl.',
        'Bestie.',
        'Alright now.',
        'I mean…',
        'Listen.',
        'Respectfully,',
        'No pressure but',
        'Take your time but also',
        'I’m just saying,',
    ]

    const randomPrefixRef = useRef<string>('')

    // ---------- TEXT GENERATORS ----------
    const getTeaseText = () =>
        teaseCycle === 0
            ? 'You have to think about it huh 🙄'
            : `${randomPrefixRef.current} still thinking about it 🤨`

    const getRetryText = () =>
        teaseCycle === 0
            ? 'Okay… one more time 😌'
            : `Last time ${'fr '.repeat(teaseCycle).trim()}`

    // ---------- RANDOM POSITION GENERATOR ----------
    const getRandomButtonPosition = () => {
        const padding = 80

        return {
            x: Math.random() * (window.innerWidth - padding * 2) + padding,
            y: Math.random() * (window.innerHeight - padding * 2) + padding,
        }
    }

    // ---------- ACCEPT CLICK ----------
    const handleButtonClick = () => {
        hasAcceptedRef.current = true

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

    // ---------- SCROLL ----------
    const scrollToPage = (page: number) => {
        const container = containerRef.current
        if (!container) return

        setIsScrolling(true)
        container.scrollTo({
            top: page * window.innerHeight,
            behavior: 'smooth',
        })

        setTimeout(() => setIsScrolling(false), 600)
    }

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()
            if (isScrolling) return

            if (e.deltaY > 0 && currentPage < pagesCount - 1) {
                setCurrentPage((p) => p + 1)
                scrollToPage(currentPage + 1)
            } else if (e.deltaY < 0 && currentPage > 0) {
                setCurrentPage((p) => p - 1)
                scrollToPage(currentPage - 1)
            }
        }

        let touchStartY: number | null = null
        let touchStartTime: number | null = null

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY
            touchStartTime = e.timeStamp
        }

        const handleTouchEnd = (e: TouchEvent) => {
            if (touchStartY === null || touchStartTime === null) return
            if (isScrolling) return

            const deltaY = touchStartY - e.changedTouches[0].clientY
            const deltaTime = e.timeStamp - touchStartTime
            const velocity = deltaY / deltaTime

            if ((deltaY > 50 || velocity > 0.3) && currentPage < pagesCount - 1) {
                setCurrentPage((p) => p + 1)
                scrollToPage(currentPage + 1)
            } else if ((deltaY < -50 || velocity < -0.3) && currentPage > 0) {
                setCurrentPage((p) => p - 1)
                scrollToPage(currentPage - 1)
            }

            touchStartY = null
            touchStartTime = null
        }

        container.addEventListener('wheel', handleWheel, { passive: false })
        container.addEventListener('touchstart', handleTouchStart, { passive: true })
        container.addEventListener('touchend', handleTouchEnd, { passive: false })

        return () => {
            container.removeEventListener('wheel', handleWheel)
            container.removeEventListener('touchstart', handleTouchStart)
            container.removeEventListener('touchend', handleTouchEnd)
        }
    }, [currentPage, isScrolling])

    // ---------- TEASE CYCLE ----------
    useEffect(() => {
        if (currentPage !== 3) return
        if (!showAccept) return

        hasAcceptedRef.current = false

        randomPrefixRef.current =
            prefixPool[Math.floor(Math.random() * prefixPool.length)]

        const isFirstCycle = teaseCycle === 0
        const teaseDelay = isFirstCycle ? 1000 : 400
        const retryDelay = isFirstCycle ? 1500 : 700
        const countdownDelay = isFirstCycle ? 3000 : 1400

        const teaseTimer = setTimeout(() => {
            if (hasAcceptedRef.current) return

            setShowAccept(false)
            setTeaseStage('tease')

            setTimeout(() => setTeaseStage('retry'), retryDelay)

            setTimeout(() => {
                setCountdown(3)
                setTeaseStage('countdown')
            }, countdownDelay)
        }, teaseDelay)

        return () => clearTimeout(teaseTimer)
    }, [currentPage, showAccept, teaseCycle])

    // ---------- COUNTDOWN ----------
    useEffect(() => {
        if (teaseStage !== 'countdown') return

        if (countdown <= 0) {
            setTeaseStage('idle')

            // 👇 teleport while hidden
            if (teaseCycle >= 0) {
                setButtonPos(getRandomButtonPosition())
            }

            setShowAccept(true)
            setTeaseCycle((c) => c + 1)
            return
        }

        const countdownInterval = teaseCycle === 0 ? 1000 : 500
        const timer = setTimeout(() => {
            setCountdown((c) => c - 1)
        }, countdownInterval)

        return () => clearTimeout(timer)
    }, [teaseStage, countdown, teaseCycle])

    return (
        <div
            ref={containerRef}
            className='snap-y snap-mandatory overflow-y-hidden h-svh'
            style={{ touchAction: 'pan-y', overscrollBehaviorY: 'contain' }}
        >
            {/* PAGE 1 */}
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
                        </div>
                    </div>
                </div>
            </div>

            {/* PAGE 2 */}
            <div className='snap-center h-svh page-container page-two bg-red-50'>
                <ValentineFlipCard
                    title='Why I Love You'
                    frontText='Tap to reveal 💕'
                    backText='You make my world feel like home.'
                    width='30svh'
                    height='50svh'
                />
            </div>

            {/* PAGE 3 */}
            <div className='snap-center h-svh page-container page-three bg-blue-50'>
                <Carousel width='95dvw' height='90dvh' />
            </div>

            {/* PAGE 4 */}
            <div className='snap-center h-svh page-container page-four bg-purple-50 relative'>
                <div className='flex flex-col items-center gap-6 text-center'>
                    <h1 className='text-4xl font-bold text-purple-900'>
                        Will you be my Valentine?
                    </h1>

                    {showAccept && (
                        <button
                            ref={buttonRef}
                            onClick={handleButtonClick}
                            className='valentine-button'
                            style={
                                teaseCycle > 0
                                    ? {
                                          position: 'absolute',
                                          left: `${buttonPos.x}px`,
                                          top: `${buttonPos.y}px`,
                                      }
                                    : {}
                            }
                        >
                            Accept ❤️
                        </button>
                    )}

                    {teaseStage === 'tease' && (
                        <p className='tease-text'>{getTeaseText()}</p>
                    )}

                    {teaseStage === 'retry' && (
                        <p className='retry-text'>{getRetryText()}</p>
                    )}

                    {teaseStage === 'countdown' && (
                        <p className='countdown-text'>{countdown}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home
