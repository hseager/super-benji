import { UpgradeOption } from "../types";
import { drawEngine } from "./DrawController";
import { GameController } from "./GameController";

export class UpgradeScreenController {
  isActive = false;
  isFinished = false;
  upgrades: UpgradeOption[] = [];
  selectedIndex = 0;

  private gameManager: GameController;
  private allUpgrades: UpgradeOption[] = [];

  constructor(gameManager: GameController) {
    this.gameManager = gameManager;

    // Define all possible upgrades here
    this.allUpgrades = [
      {
        name: "Increase Fire Rate",
        description: "Shoot 20% faster.",
        apply: () => {
          this.gameManager.player.attackSpeed *= 0.8;
        },
      },
      {
        name: "Extra Health",
        description: "Gain +2 health.",
        apply: () => {
          this.gameManager.player.life += 2;
        },
      },
      {
        name: "Speed Boost",
        description: "Move 15% faster.",
        apply: () => {
          this.gameManager.player.movementXSpeed *= 1.15;
          this.gameManager.player.movementYSpeed *= 1.15;
        },
      },
    ];
  }

  start() {
    this.isActive = true;
    this.isFinished = false;
    this.selectedIndex = 0;
    this.generateUpgrades();
  }

  generateUpgrades() {
    // Shuffle and pick first 3
    const shuffled = [...this.allUpgrades].sort(() => Math.random() - 0.5);
    this.upgrades = shuffled.slice(0, 3);
  }

  // update(delta: number) {
  //   if (!this.isActive) return;
  //   // Add animations / transitions here if wanted
  // }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isActive) return;

    // Dim background
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Title
    drawEngine.drawText("Choose an upgrade!", 12, drawEngine.getCenterX(), 20);

    // Draw upgrade boxes
    const startY = 40;
    const boxHeight = 30;
    const spacing = 20;

    this.upgrades.forEach((upgrade, index) => {
      const y = startY + index * (boxHeight + spacing);
      const isSelected = index === this.selectedIndex;

      ctx.fillStyle = isSelected ? "#44aaff" : "#222";
      ctx.fillRect(ctx.canvas.width / 2 - 50, y, 100, boxHeight);

      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(ctx.canvas.width / 2 - 50, y, 100, boxHeight);

      ctx.fillStyle = "white";
      ctx.font = "9px Arial";
      ctx.textAlign = "left";
      ctx.fillText(upgrade.name, ctx.canvas.width / 2 - 40, y + 10);

      ctx.font = "9px Arial";
      ctx.fillText(upgrade.description, ctx.canvas.width / 2 - 40, y + 20);
    });

    ctx.restore();
  }

  handleInput(key: string) {
    if (!this.isActive) return;

    if (key === "ArrowUp") {
      this.selectedIndex =
        (this.selectedIndex - 1 + this.upgrades.length) % this.upgrades.length;
    }
    if (key === "ArrowDown") {
      this.selectedIndex = (this.selectedIndex + 1) % this.upgrades.length;
    }
    if (key === "Enter") {
      // Apply selected upgrade
      this.upgrades[this.selectedIndex].apply();
      this.isActive = false;
      this.isFinished = true;
    }
  }
}
