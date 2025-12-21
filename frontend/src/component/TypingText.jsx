import React, { useEffect, useState } from 'react'

function TypingText({ phrases = [], typingSpeed = 80, pause = 1500, className = '' }) {
  const [index, setIndex] = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Respect user reduced-motion preference
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReduced(mq.matches)
      const handler = () => setReduced(mq.matches)
      mq.addEventListener?.('change', handler)
      return () => mq.removeEventListener?.('change', handler)
    } catch (e) { }
  }, [])

  useEffect(() => {
    if (!phrases || phrases.length === 0) return
    if (reduced) {
      // when reduced motion requested, show first phrase statically
      setDisplay(phrases[0])
      return
    }

    const current = phrases[index % phrases.length]
    let timer = null

    if (!deleting) {
      timer = setTimeout(() => {
        setDisplay(current.slice(0, display.length + 1))
        if (display.length + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause)
        }
      }, typingSpeed)
    } else {
      timer = setTimeout(() => {
        setDisplay(current.slice(0, display.length - 1))
        if (display.length - 1 === 0) {
          setDeleting(false)
          setIndex(prev => prev + 1)
        }
      }, typingSpeed / 2)
    }

    return () => clearTimeout(timer)
  }, [display, deleting, index, phrases, typingSpeed, pause, reduced])

  return (
    <div className={className} aria-live='polite' aria-atomic='true'>
      <span className='typing-line'>{display}</span>
      <span className='typing-cursor' aria-hidden>|</span>
    </div>
  )
}

export default TypingText
