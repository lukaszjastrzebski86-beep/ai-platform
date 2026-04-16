"use client";

import { useEffect, useRef, useState } from "react";

const GRID = 20;
const CELL = 18;
const SIZE = GRID * CELL;

type Point = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

function randomFood(snake: Point[]) {
  while (true) {
    const point = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };

    if (!snake.some((s) => s.x === point.x && s.y === point.y)) {
      return point;
    }
  }
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [food, setFood] = useState<Point>({ x: 14, y: 10 });
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowUp" && dir !== "DOWN") setDir("UP");
      if (e.key === "ArrowDown" && dir !== "UP") setDir("DOWN");
      if (e.key === "ArrowLeft" && dir !== "RIGHT") setDir("LEFT");
      if (e.key === "ArrowRight" && dir !== "LEFT") setDir("RIGHT");
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dir]);

  useEffect(() => {
    if (!running || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        let nextHead = { ...head };

        if (dir === "UP") nextHead.y -= 1;
        if (dir === "DOWN") nextHead.y += 1;
        if (dir === "LEFT") nextHead.x -= 1;
        if (dir === "RIGHT") nextHead.x += 1;

        const hitWall =
          nextHead.x < 0 ||
          nextHead.y < 0 ||
          nextHead.x >= GRID ||
          nextHead.y >= GRID;

        const hitSelf = prev.some(
          (p) => p.x === nextHead.x && p.y === nextHead.y
        );

        if (hitWall || hitSelf) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }

        const ate = nextHead.x === food.x && nextHead.y === food.y;
        const newSnake = [nextHead, ...prev];

        if (!ate) {
          newSnake.pop();
        } else {
          setScore((s) => s + 1);
          setFood(randomFood(newSnake));
        }

        return newSnake;
      });
    }, 130);

    return () => clearInterval(interval);
  }, [running, dir, food, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);

    const bg = ctx.createLinearGradient(0, 0, 0, SIZE);
    bg.addColorStop(0, "rgba(255,255,255,0.9)");
    bg.addColorStop(1, "rgba(230,247,255,0.7)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, SIZE, SIZE);

    ctx.strokeStyle = "rgba(120, 210, 255, 0.18)";
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(SIZE, i * CELL);
      ctx.stroke();
    }

    ctx.fillStyle = "#5ed3ff";
    snake.forEach((part, idx) => {
      ctx.fillStyle = idx === 0 ? "#31b8ff" : "#7ddfff";
      ctx.fillRect(part.x * CELL + 1, part.y * CELL + 1, CELL - 2, CELL - 2);
    });

    ctx.fillStyle = "#ff7dd8";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL + CELL / 2,
      food.y * CELL + CELL / 2,
      CELL / 2.6,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [snake, food]);

  function reset() {
    const freshSnake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    setSnake(freshSnake);
    setDir("RIGHT");
    setFood(randomFood(freshSnake));
    setScore(0);
    setGameOver(false);
    setRunning(false);
  }

  return (
    <div className="game-shell">
      <div className="cards-grid-3">
        <div className="kpi-card">
          <div className="kpi-label">Wynik</div>
          <div className="kpi-value">{score}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Stan</div>
          <div className="kpi-value">
            {gameOver ? "Koniec" : running ? "Live" : "Stop"}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Nagroda</div>
          <div className="kpi-value">💎 {score * 3}</div>
        </div>
      </div>

      <div className="snake-wrap">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className="snake-canvas"
        />

        <div className="button-row">
          <button className="action-btn" onClick={() => setRunning(true)}>
            Start
          </button>
          <button className="action-btn secondary" onClick={reset}>
            Reset
          </button>
        </div>

        <div className="result-box">
          Sterowanie: strzałki ↑ ↓ ← →. Gra kończy się po uderzeniu w ścianę
          albo w siebie.
        </div>
      </div>
    </div>
  );
}