import { BASE_TRANSITION_ANIMATION_TIME } from "../config";
import { Upgrade } from "../types";
import { shuffleArray } from "../utilities";
import { addClick, clearClicks } from "./ClickController";
import { drawEngine } from "./DrawController";
import { GameController } from "./GameController";
import { screenTransitions } from "./ScreenTransitionController";
import { UpgradeController } from "./UpgradeController";

export class UpgradeScreenController {
  isActive = false;
  canSelectUpgrade = false;
  upgrades: Upgrade[] = [];

  private gameManager: GameController;
  private allUpgrades: Upgrade[] = [];

  constructor(gameManager: GameController) {
    this.gameManager = gameManager;
    const upgradeController = new UpgradeController(gameManager);
    this.allUpgrades = upgradeController.getAllUpgrades();
  }

  start() {
    this.isActive = true;
    this.canSelectUpgrade = true;
    this.generateUpgrades();

    this.gameManager.storyController.chooseTorxDialog();

    clearClicks();
  }

  drawUpgradeOption(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    upgrade: Upgrade
  ) {
    // Border color based on rarity
    let borderColor = "white";
    if (upgrade.rarity === "Rare") borderColor = "#60a5fa";
    else if (upgrade.rarity === "Epic") borderColor = "#c084fc";
    else if (upgrade.rarity === "Legendary") borderColor = "#fb923c";

    // Rounded rect background
    const radius = 6;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Upgrade text
    ctx.fillStyle = borderColor;
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`[${upgrade.rarity}]`, x + 6, y + 10);

    ctx.fillStyle = "white";
    ctx.fillText(upgrade.name, x + 6, y + 20);
    ctx.fillText(upgrade.description, x + 6, y + 30);
    if (upgrade.description2) ctx.fillText(upgrade.description2, x + 6, y + 40);
  }

  generateUpgrades() {
    // Shuffle and pick first 3
    const shuffled = shuffleArray(this.allUpgrades);
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

    this.gameManager.storyController.drawTorxDialog();
    this.drawUpgradeOptions(ctx);

    ctx.restore();
  }

  drawUpgradeOptions(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const boxHeight = 45;
    const spacing = 10;
    const x = 5;
    const width = ctx.canvas.width - 10;
    const startY = 90;

    clearClicks(); // reset for fresh click mapping

    this.upgrades.forEach((upgrade, index) => {
      const y = startY + index * (boxHeight + spacing);

      // Draw box
      this.drawUpgradeOption(ctx, x, y, width, boxHeight, upgrade);

      // Register click
      if (!this.canSelectUpgrade) return;
      addClick(x, y, width, boxHeight, () => {
        upgrade.apply();

        // Prevent multiple clicks
        this.canSelectUpgrade = false;

        // Remove upgrade from future options
        this.allUpgrades = this.allUpgrades.filter((u) => u !== upgrade);

        screenTransitions.startFade(
          "fade-out",
          BASE_TRANSITION_ANIMATION_TIME,
          () => {
            clearClicks();
            this.isActive = false;
            this.gameManager.levelManager.nextLevel();
            screenTransitions.startFade("fade-in");
          }
        );
      });
    });
  }
}
