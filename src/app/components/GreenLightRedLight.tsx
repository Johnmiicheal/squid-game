"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import TrafficLight from "./TrafficLight";
import Player from "./Player";

const GAME_WIDTH = 500;
const GAME_HEIGHT = window.innerHeight * 0.8; // 80% of the device screen height
const PLAYER_STEP = 1;
const FINISH_LINE = GAME_HEIGHT - 50;
const MIN_PAUSE = 2000; // 2 seconds
const MAX_PAUSE = 6000; // 6 seconds

export default function GreenLightRedLight() {
  const [isGreenLight, setIsGreenLight] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);



  const playAudioWithDelay = useCallback(() => {
    if (audioRef.current) {
      const randomDelay = Math.random() * (MAX_PAUSE - MIN_PAUSE) + MIN_PAUSE;
      timeoutRef.current = setTimeout(() => {
        audioRef.current?.play();
        setIsGreenLight(true);
      }, randomDelay);
    }
  }, []);


  const handleAudioEnd = useCallback(() => {
    setIsGreenLight(false);
    playAudioWithDelay();
  }, [playAudioWithDelay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleAudioEnd);
    }

    // Start the initial audio play
    playAudioWithDelay();

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnd);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleAudioEnd, playAudioWithDelay]);

  const startMoving = () => {
    if (!isGameOver) {
      setIsMoving(true);
    }
  };

  const stopMoving = () => {
    setIsMoving(false);
  };

  useEffect(() => {
    if (isMoving && !isGameOver) {
      const moveInterval = setInterval(() => {
        if (isGreenLight) {
          setPlayerPosition((prev) => {
            const newPosition = prev + PLAYER_STEP;
            if (newPosition >= FINISH_LINE) {
              setIsWinner(true);
              setIsGameOver(true);
              setIsMoving(false);
              return FINISH_LINE;
            }
            return newPosition;
          });
        } else {
          setIsGameOver(true);
          setIsMoving(false);
        }
      }, 50);
      return () => clearInterval(moveInterval);
    }
  }, [isMoving, isGreenLight, isGameOver]);

  const resetGame = () => {
    window.location.reload()
    setPlayerPosition(0);
    setIsGameOver(false);
    setIsWinner(false);
    setIsGreenLight(false);
    setIsMoving(false);

    // Reset audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    playAudioWithDelay();
  };

  return (
    <div
      className="relative"
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
    >
      <audio ref={audioRef} src="/assets/green-light.mp3" />
      <div className="absolute top-0 left-0 w-full h-full bg-gray-800 overflow-hidden">
        {/* Race track */}
        <div className="absolute top-0 left-1/2 w-40 h-full -translate-x-1/2 bg-gray-600">
          {/* Lane markings */}
          <div className="absolute left-0 w-1 h-full bg-white opacity-50"></div>
          <div className="absolute right-0 w-1 h-full bg-white opacity-50"></div>
          {/* Dashed center line */}
          <div className="absolute left-1/2 w-1 h-full -translate-x-1/2">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-full h-8 bg-white mt-8"></div>
            ))}
          </div>
        </div>
        {/* Finish line */}
        <div className="absolute top-12 left-0 right-0 h-1 bg-white flex flex-wrap ">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-1/10 h-1/2 bg-black"></div>
          ))}
        </div>
        <TrafficLight isGreen={isGreenLight} />
        <Player position={playerPosition} isMoving={isMoving} />
        <div className="absolute bottom-4 flex gap-4 justify-center w-full">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={startMoving}
            disabled={isGameOver || isMoving}
          >
            Move
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={stopMoving}
            disabled={isGameOver || !isMoving}
          >
            Stop
          </button>
        </div>
      </div>
      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded text-center">
            <h2 className="text-2xl font-bold mb-4">
              {isWinner ? "You Win!" : "Game Over"}
            </h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={resetGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
