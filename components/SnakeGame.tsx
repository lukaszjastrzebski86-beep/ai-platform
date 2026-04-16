"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/contexts/AppContext";

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

    if (!snake.some((segment) => segment.x === point.x && segment.y === point.y)) {
      return point;
    }
  }
}

function initialSnake() {
  return [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { state, grantRewards, recordGameScore } = useApp();

  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [food, setFood] = useState<Point>({ x: 13, y: 10 });
  const [phase, setPhase] = useState<"idle" | "live" | "paused" | "over">(
    "idle"
  );
  const [score, setScore] = useState(0);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);

  function changeDirection(next: Dir) {
    setDir((current) => {
      if (next === "UP" && current === "DOWN") return current;
      if (next === "DOWN" && current === "UP") return current;
      if (next === "LEFT" && current === "RIGHT") return current;
      if (next === "RIGHT" && current === "LEFT") return current;
      return next;
    });
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowUp") changeDirection("UP");
      if (event.key === "ArrowDown") changeDirection("DOWN");
      if (event.key === "ArrowLeft") changeDirection("LEFT");
      if (event.key === "ArrowRight") changeDirection("RIGHT");
      if (event.key === " ") {
        setPhase((current) => (current === "live" ? "paused" : "live"));
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (phase !== "live") {
      return;
    }

    const speed = Math.max(84, 138 - score * 3);

    const interval = window.setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0];
        const nextHead = { ...head };

        if (dir === "UP") nextHead.y -= 1;
        if (dir === "DOWN") nextHead.y += 1;
        if (dir === "LEFT") nextHead.x -= 1;
        if (dir === "RIGHT") nextHead.x += 1;

        const hitWall =
          nextHead.x < 0 ||
          nextHead.y < 0 ||
          nextHead.x >= GRID ||
          nextHead.y >= GRID;

        const hitSelf = currentSnake.some(
          (segment) => segment.x === nextHead.x && segment.y === nextHead.y
        );

        if (hitWall || hitSelf) {
          setPhase("over");
          return currentSnake;
        }

        const ateFood = nextHead.x === food.x && nextHead.y === food.y;
        const nextSnake = [nextHead, ...currentSnake];

        if (!ateFood) {
          nextSnake.pop();
        } else {
          const nextScore = score + 1;
          setScore(nextScore);
          setFood(randomFood(nextSnake));
          grantRewards({
            diamonds: nextScore % 4 === 0 ? 1 : 0,
            light: 4,
            xp: 6,
          });
        }

        return nextSnake;
      });
    }, speed);

    return () => window.clearInterval(interval);
  }, [phase, dir, food, score, grantRewards]);

  useEffect(() => {
    if (phase !== "over" || submittedScore === score) {
      return;
    }

    recordGameScore("snake", score);

    if (score > 0) {
      grantRewards(
        {
          diamonds: Math.max(1, Math.floor(score / 5)),
          light: score * 2,
          xp: score * 4,
        },
        {
          title: "Snake session complete",
          detail: `Run zakonczony z wynikiem ${score}. Rewardy zapisano globalnie.`,
          source: "game",
          accent: "#7cf0c2",
        }
      );
    }

    setSubmittedScore(score);
  }, [phase, score, submittedScore, recordGameScore, grantRewards]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, SIZE, SIZE);

    const background = ctx.createLinearGradient(0, 0, 0, SIZE);
    background.addColorStop(0, "rgba(6, 18, 31, 0.96)");
    background.addColorStop(1, "rgba(15, 37, 62, 0.94)");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, SIZE, SIZE);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    for (let index = 0; index <= GRID; index += 1) {
      ctx.beginPath();
      ctx.moveTo(index * CELL, 0);
      ctx.lineTo(index * CELL, SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, index * CELL);
      ctx.lineTo(SIZE, index * CELL);
      ctx.stroke();
    }

    snake.forEach((segment, index) => {
      const inset = index === 0 ? 1 : 2;
      ctx.fillStyle = index === 0 ? "#ffba6b" : "#67d8ff";
      ctx.fillRect(
        segment.x * CELL + inset,
        segment.y * CELL + inset,
        CELL - inset * 2,
        CELL - inset * 2
      );
    });

    ctx.fillStyle = "#7cf0c2";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL + CELL / 2,
      food.y * CELL + CELL / 2,
      CELL / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [snake, food]);

  function reset() {
    const nextSnake = initialSnake();
    setSnake(nextSnake);
    setDir("RIGHT");
    setFood(randomFood(nextSnake));
    setScore(0);
    setSubmittedScore(null);
    setPhase("idle");
  }

  const best = Math.max(state.gameStats.snakeBest, submittedScore ?? 0);

  return (
    <div className="game-shell">
      <div className="cards-grid-4">
        <div className="kpi-card">
          <div className="kpi-label">Wynik</div>
          <div className="kpi-value">{score}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Best</div>
          <div className="kpi-value">{best}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Tryb</div>
          <div className="kpi-value">
            {phase === "live"
              ? "LIVE"
              : phase === "paused"
                ? "PAUSE"
                : phase === "over"
                  ? "END"
                  : "READY"}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Return</div>
          <div className="kpi-value">{score * 2} LT</div>
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
          <button
            className="action-btn"
            onClick={() =>
              setPhase((current) => {
                if (current === "live") return "paused";
                return "live";
              })
            }
          >
            {phase === "live" ? "Pauza" : phase === "paused" ? "Wznow" : "Start"}
          </button>
          <button className="action-btn secondary" onClick={reset}>
            Reset
          </button>
        </div>

        <div className="dpad">
          <div />
          <button className="dpad-btn" onClick={() => changeDirection("UP")}>
            UP
          </button>
          <div />
          <button className="dpad-btn" onClick={() => changeDirection("LEFT")}>
            LT
          </button>
          <div className="dpad-btn" style={{ opacity: 0.5, cursor: "default" }}>
            GO
          </div>
          <button className="dpad-btn" onClick={() => changeDirection("RIGHT")}>
            RT
          </button>
          <div />
          <button className="dpad-btn" onClick={() => changeDirection("DOWN")}>
            DN
          </button>
          <div />
        </div>

        <div className="result-box">
          Zbieraj swiatlo i utrzymuj spokojny rytm ruchu. Gra konczy sie po
          uderzeniu w sciane albo w siebie, a kazdy punkt zasila wspolny system
          rewardow w calej aplikacji.
        </div>
      </div>
    </div>
  );
}
