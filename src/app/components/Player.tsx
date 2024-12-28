'use client'

import React, { useEffect, useState } from 'react'

interface PlayerProps {
  position: number
  isMoving: boolean
}

export default function Player({ position, isMoving }: PlayerProps) {
  const [frame, setFrame] = useState(0)
  
  useEffect(() => {
    if (!isMoving) {
      setFrame(0)
      return
    }

    const animation = setInterval(() => {
      setFrame(prev => (prev + 1) % 19) // 8 frames total
    }, 50) // 100ms per frame

    return () => clearInterval(animation)
  }, [isMoving])

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2"
      style={{ bottom: position }}
    >
      <div
        style={{
          width: '37px',
          height: '80px',
          backgroundImage: 'url("/assets/person-1-back-walk-spritesheet.png")',
          backgroundPosition: `-${frame * 37}px 0px`,
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  )
}
