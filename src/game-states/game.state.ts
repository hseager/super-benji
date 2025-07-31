import { State } from "@/core/types";
import { drawEngine } from "@/core/draw-engine";
import { controls } from "@/core/controls";
import { gameStateMachine } from "@/game-state-machine";
import { menuState } from "@/game-states/menu.state";
import { GameManager } from "@/core/game-manager";
import { LoseState } from "./lose.state";
import { Music } from "@/core/music/music";

const randInt = (min: number, max: number): number =>
  ((Math.random() * (max - min + 1)) | 0) + min;

const degToRad = (d: number): number => (Math.PI / 180) * d;

function pick<T>(list: T[]): T {
  return list[randInt(0, list.length - 1)];
}

const distance = (x1: number, y1: number, x2: number, y2: number): number =>
  Math.hypot(x2 - x1, y2 - y1);

const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  colour: string,
  alpha: number
): void => {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, degToRad(360), false);
  ctx.fill();
};

// Colours used in galaxy
const colours: string[] = ["#0069aa", "#ca52c9", "#ea323c"];
const starColours: string[] = [
  "#fffcea",
  "#fffc4e",
  "#91f4ff",
  "#ffe1e1",
  "#ffb30a",
];

// Create one big cluster procedurally, given cluster parameters and offset
function drawStars(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  qty: [number, number],
  size: [number, number],
  colours: string[],
  alpha: [number, number]
): void {
  const max = randInt(qty[0], qty[1]);
  for (let i = 0; i < max; i++) {
    const rx = randInt(cx - radius, cx + radius);
    const ry = randInt(cy - radius, cy + radius);
    drawCircle(
      ctx,
      rx,
      ry,
      randInt(size[0], size[1]),
      pick(colours),
      Math.random() * (alpha[1] - alpha[0]) + alpha[0]
    );
  }
}

class GameState implements State {
  private ctx: CanvasRenderingContext2D;
  private gameManager: GameManager;
  private muteButton: HTMLButtonElement;
  musicPlayer: Music;

  // Large galaxy background canvas
  private galaxyCanvas: HTMLCanvasElement;
  private galaxyCtx: CanvasRenderingContext2D;
  private galaxyOffsetX: number = 0;
  private galaxyOffsetY: number = 0;

  // Store clusters for the procedural galaxy
  private clusters: {
    x: number;
    y: number;
    colour: string;
    radius: number;
    holeInCenter: number;
  }[] = [];

  // Camera position to offset background as player moves
  private cameraX = 0;
  private cameraY = 0;

  constructor() {
    this.ctx = drawEngine.context;
    this.gameManager = new GameManager();

    this.muteButton = document.querySelector(
      ".mute-button"
    ) as HTMLButtonElement;

    this.musicPlayer = new Music();

    // Create a large canvas for the galaxy background (e.g., 3000x3000 for a big world)
    this.galaxyCanvas = document.createElement("canvas");
    this.galaxyCanvas.width = 3000;
    this.galaxyCanvas.height = 3000;
    this.galaxyCtx = this.galaxyCanvas.getContext("2d")!;

    // Generate galaxy clusters once
    this.generateGalaxyClusters();
  }

  generateGalaxyClusters() {
    const w = this.galaxyCanvas.width;
    const h = this.galaxyCanvas.height;

    // Fill with black
    this.galaxyCtx.fillStyle = "#000";
    this.galaxyCtx.fillRect(0, 0, w, h);

    const totalClusters = 30;
    this.clusters = [];

    for (let z = 0; z < totalClusters; z++) {
      const cluster = {
        x: randInt(0, w),
        y: randInt(0, h),
        colour: pick(colours),
        radius: randInt(150, 300),
        holeInCenter: randInt(2, 4),
      };
      this.clusters.push(cluster);

      // Draw the transparent "blobs" of each cluster
      const blobs = 500;
      for (let i = 0; i < blobs; i++) {
        const rx = randInt(
          cluster.x - cluster.radius,
          cluster.x + cluster.radius
        );
        const ry = randInt(
          cluster.y - cluster.radius,
          cluster.y + cluster.radius
        );

        let alpha = 0.01;
        const d = distance(rx, ry, cluster.x, cluster.y);

        if (d > cluster.radius / cluster.holeInCenter) {
          alpha = 1.0 / d;
          drawCircle(
            this.galaxyCtx,
            rx,
            ry,
            randInt(20, 60),
            cluster.colour,
            alpha
          );
        }
      }

      // Draw stars on cluster
      drawStars(
        this.galaxyCtx,
        cluster.x,
        cluster.y,
        cluster.radius / 2,
        [30, 50],
        [1, 2],
        [starColours[0]],
        [0.2, 1.0]
      );
      drawStars(
        this.galaxyCtx,
        cluster.x,
        cluster.y,
        cluster.radius,
        [20, 30],
        [1, 1],
        starColours,
        [0.6, 0.9]
      );
      drawStars(
        this.galaxyCtx,
        cluster.x,
        cluster.y,
        cluster.radius,
        [5, 8],
        [2, 2],
        starColours,
        [0.7, 1.0]
      );
      drawStars(
        this.galaxyCtx,
        cluster.x,
        cluster.y,
        cluster.radius,
        [1, 5],
        [1, 1],
        [starColours[0]],
        [1.0, 1.0]
      );
    }
  }

  setupMuteButton() {
    this.musicPlayer.play();
    this.muteButton.classList.remove("hide");
    this.muteButton.textContent = this.musicPlayer.isPlaying ? "🔈" : "🔇";

    // Remove previous listeners safely
    this.muteButton.replaceWith(this.muteButton.cloneNode(true));
    this.muteButton = document.querySelector(
      ".mute-button"
    ) as HTMLButtonElement;

    this.muteButton.addEventListener("click", () => {
      if (this.musicPlayer.isPlaying) {
        this.musicPlayer.stop();
        this.muteButton.textContent = "🔇";
      } else {
        this.musicPlayer.play();
        this.muteButton.textContent = "🔈";
      }
    });
  }

  onEnter() {
    this.gameManager = new GameManager();
    this.setupMuteButton();
    // this.galaxyCanvas = this.generateGalaxyClusters();
  }

  onUpdate(delta: number) {
    // Clear the canvas first (or fill with black)
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Draw the cached galaxy with an offset (simulate movement)
    this.ctx.drawImage(
      this.galaxyCanvas,
      this.galaxyOffsetX,
      this.galaxyOffsetY
    );

    // Update the offset based on player movement or input (example)
    // For demonstration, let's slowly scroll the galaxy left and up:
    this.galaxyOffsetX -= 0.1 * delta;
    this.galaxyOffsetY -= 0.05 * delta;

    // Optionally wrap offsets if you want infinite scrolling
    const w = this.galaxyCanvas.width;
    const h = this.galaxyCanvas.height;
    if (this.galaxyOffsetX <= -w) this.galaxyOffsetX = 0;
    if (this.galaxyOffsetY <= -h) this.galaxyOffsetY = 0;

    // Rest of your update logic here ...
  }

  private checkWinCondition() {
    // Implement your win logic here
  }

  private checkLoseCondition() {
    if (this.gameManager.player.life <= 0) {
      gameStateMachine.setState(new LoseState());
    }
  }

  onLeave() {
    this.muteButton.classList.add("hide");
    this.musicPlayer.stop();
  }
}

export const gameState = new GameState();
