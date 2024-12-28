import React, { useEffect, useState } from 'react';

interface TrafficLightProps {
  isGreen: boolean;
}
export default function TrafficLight({ isGreen }: TrafficLightProps) {
  const [frame, setFrame] = useState(13); // Start at the last frame
  useEffect(() => {
    const totalFrames = 13; // Total frames for the animation
    let animationFrameCount = !isGreen ? 12 : 0; // Start from the last frame if green

    const interval = setInterval(() => {
      if (!isGreen && animationFrameCount < totalFrames) {
        setFrame(animationFrameCount);
        animationFrameCount++;
      } else if (isGreen && animationFrameCount > 0) {
        setFrame(animationFrameCount);
        animationFrameCount--;
      }
    }, 200); // Change frame every 200ms

    return () => clearInterval(interval);
  }, [isGreen]);

  return (
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          backgroundImage: 'url("/assets/younghee-turn-back-spritesheet.png")',
          backgroundPosition: `-${frame * 252}px 0px`, // Use the current frame for background position
          backgroundRepeat: 'no-repeat',
          width: '252px', // Adjust width based on your sprite size
          height: '240px', // Adjust height based on your sprite size
        }}
      />
  );
}
