import { Item } from "../types";
import { drawEngine } from "./DrawController";
import { GameController } from "./GameController";

export class UpgradeScreenController {
  isActive = false;
  isFinished = false;
  upgrades: Item[] = [];

  private gameManager: GameController;
  private allUpgrades: Item[] = [];

  constructor(gameManager: GameController) {
    this.gameManager = gameManager;

    // Define all possible upgrades here
    this.allUpgrades = [
      {
        type: "Cannon",
        name: "BOLT LASER MK-II",
        description: "(DMG +12, ATK SPD +20%)",
        apply: () => {
          this.gameManager.player.damage += 12;
          this.gameManager.player.attackSpeed *= 0.2;
        },
      },
      {
        type: "Hull",
        name: "ADAMITE PLATING",
        description: "(HP +20, REGEN +10)",
        apply: () => {
          this.gameManager.player.life += 2;
        },
      },
      {
        type: "Relic",
        name: "MAMOTH TUSK",
        description: "(SPD-X +10, ATK SPD +10%)",
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
    this.generateUpgrades();
  }

  generateUpgrades() {
    // Shuffle and pick first 3
    const shuffled = [...this.allUpgrades].sort(() => Math.random() - 0.5);
    this.upgrades = shuffled.slice(0, 3);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isActive) return;

    // Dim background
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Title
    drawEngine.drawTitle("Zone Cleared!", 12, drawEngine.getCenterX(), 15);
    drawEngine.drawText("Loot found:", 9, drawEngine.getCenterX(), 30);

    // Draw upgrade boxes
    const startY = 60;
    const boxHeight = 30;
    const spacing = 15;
    const x = 10;

    this.upgrades.forEach((upgrade, index) => {
      const y = startY + index * (boxHeight + spacing);

      ctx.fillStyle = "white";
      ctx.font = "bold 9px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`[${upgrade.type}]`, x, y);
      ctx.fillText(upgrade.name, x, y + 10);
      ctx.fillText(upgrade.description, x, y + 20);
    });

    drawEngine.drawButton("Inventory", drawEngine.canvasHeight - 35);

    ctx.restore();
  }
}
