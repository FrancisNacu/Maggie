import { useRef, useEffect, useState } from 'react'
import image from '../assets/image.jpg'
import Carousel from '../components/Carousel.tsx'
import ValentineFlipCard from '../components/FlipCard.tsx'
import FloatingHearts from '../components/FloatingHearts'

const KISS_GIF =
    'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3N2gycG82MDM5MXU2djExYnB2czcwYm0xaXR2cjFlZDJmdzJtZXY0dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/vX1C2TejT6OCOz2kLd/giphy.gif'

// const SIDEEYE_GIF =
//     'https://media.tenor.com/ABSZdgcclq0AAAAj/side-eye-muzabo.gif'

import SIDEEYE_GIF from '../assets/image2.jpg'

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
    const [hasAccepted, setHasAccepted] = useState(false) // 👈 NEW

    // ---------- ACCEPT BUTTON POSITION ----------
    const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 })

    // ---------- PLAYFUL PREFIX POOL ----------
    const prefixPool = [
        'Soooo…',
        'Hmm.',
        'Okay but like…',
        'Be honest.',
        'Not you',
        'Alright now.',
        'I mean…',
        'Listen.',
        'Respectfully,',
        'No pressure but...',
        'I’m just saying.',
    ]

    const randomPrefixRef = useRef<string>('')

    // ---------- TEXT GENERATORS ----------
    const getTeaseText = () =>
        teaseCycle === 0
            ? 'You have to think about it huh 🙄'
            : `${randomPrefixRef.current} Still thinking about it? 🤨`

    const getRetryText = () =>
        teaseCycle === 0
            ? 'Okay… one more time 🙄'
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
        setHasAccepted(true)        // 👈 mark accepted
        setShowAccept(false)        // 👈 never show button again

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
        if (!showAccept || hasAccepted) return // 👈 stop teasing after accept

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
    }, [currentPage, showAccept, teaseCycle, hasAccepted])

    // ---------- COUNTDOWN ----------
    useEffect(() => {
        if (teaseStage !== 'countdown') return

        if (countdown <= 0) {
            setTeaseStage('idle')

            if (!hasAccepted) {
                setButtonPos(getRandomButtonPosition())
                setShowAccept(true)
                setTeaseCycle((c) => c + 1)
            }

            return
        }

        const countdownInterval = teaseCycle === 0 ? 1000 : 500
        const timer = setTimeout(() => {
            setCountdown((c) => c - 1)
        }, countdownInterval)

        return () => clearTimeout(timer)
    }, [teaseStage, countdown, teaseCycle, hasAccepted])

    return (
        <div
            ref={containerRef}
            className='snap-y snap-mandatory overflow-y-hidden h-svh'
            style={{ touchAction: 'pan-y', overscrollBehaviorY: 'contain' }}
        >
            {/* PAGE 1 */}
            <div className="snap-center h-svh page-container page-one relative bg-[url(../assets/hearts-bg.jpg)] bg-cover bg-center">

                {/* floating hearts layer */}
                <FloatingHearts count={24} />

                {/* content layer */}
                <div className="page-one-container relative z-10">
                    <div className="page-one-image">
                        <img src={image} alt="Page One" />
                    </div>

                    <div className="page-one-card">
                        <div className="card-content">
                            <h1 className="card-title">Magpie</h1>
                            <p className="card-subtitle">Hi cuuutie pieee</p>
                            <p className="card-description">
                                Uhmmm sooo you probably already know what this is foooor buuut . . . 
                            </p>

                            <div className="card-features">
                                <div className="feature">
                                    <div>No pressure</div>
                                    <img src={SIDEEYE_GIF} alt="Side eye" className="w-25 h-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAGE 3 */}
            <div className="snap-center h-svh page-container page-three bg-blue-50">
                <div className="flex flex-col items-center justify-center gap-6 h-full text-center px-4">
                    <h1 className="text-3xl font-semibold text-blue-900">
                        Memories 💕
                    </h1>
                    <Carousel
                        width="90dvw"
                        height="80dvh"
                    />
                    <p className="text-sm text-gray-500 font-mono tracking-wide">
                        Pictures together loaded. More incoming…
                    </p>
                </div>
            </div>

                        {/* PAGE 2 */}
            <div className='snap-center h-svh page-container page-two bg-red-50'>
                <ValentineFlipCard
                    title='To Maggie'
                    frontText='Tap to reveal 💌'
                    backText={`Maggie, I’m so happy and grateful to have you in my life! From the first time we met, to our fated 3 AM conversation three years later, it really feels like a dumbishly cute situation 🤣. 
                        Since then, we’ve made so many fun memories together from DEGEN VCT watchparties, funny/embarassing dares, brain-numbing escaperooms, and so much more ❤️.
                        \n I love you and I'm looking forward to making more memories together, especially with your upcoming trip 😚. 
                        \n\n With that being said . . .`}
                    width='80dvw'
                    height='80dvh'
                />
            </div>


            {/* PAGE 4 */}
            <div className='snap-center h-svh page-container page-four bg-[#fcfcfb] relative'>
                <div className='flex flex-col items-center gap-6 text-center'>
                    <h1 className='text-4xl font-bold text-purple-900'>
                        {hasAccepted
                            ? 'I looooveee yooou!! Mwaaah 😚'
                            : 'Will you be my Valentine?'}
                    </h1>

                    {hasAccepted && (
                        <img
                            src={KISS_GIF}
                            alt="Kiss"
                            className="w-48 h-auto animate-pop"
                        />
                    )}


                    {showAccept && !hasAccepted && (
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
