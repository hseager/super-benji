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
    const padding = 10;
    const lineHeight = 18;

    // Border color based on rarity
    let borderColor = "white";
    if (upgrade.rarity === "Rare") borderColor = "#60a5fa";
    else if (upgrade.rarity === "Epic") borderColor = "#c084fc";
    else if (upgrade.rarity === "Legendary") borderColor = "#fb923c";

    // Rounded rect background
    drawEngine.drawRoundedRect(ctx, x, y, w, h, 6, "#222", borderColor);

    // Start text cursor just below the top padding
    let textY = y + lineHeight;

    // Rarity line
    ctx.fillStyle = borderColor;
    ctx.font = "16px Courier New";
    ctx.fillText(`[${upgrade.rarity}]`, x + padding, textY);

    // Move down one line
    textY += lineHeight;

    // Name
    ctx.font = "bold 16px Courier New";
    ctx.fillStyle = "white";
    ctx.fillText(upgrade.name, x + padding, textY);

    // Description
    ctx.font = "16px Courier New";
    textY += lineHeight;
    ctx.fillText(upgrade.description, x + padding, textY);

    // Optional second description
    if (upgrade.description2) {
      textY += lineHeight;
      ctx.fillText(upgrade.description2, x + padding, textY);
    }
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
    drawEngine.drawTitle("Zone Cleared!", 24, drawEngine.getCenterX(), 30);

    this.gameManager.storyController.drawTorxDialog();
    this.drawUpgradeOptions(ctx);

    ctx.restore();
  }

  drawUpgradeOptions(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const boxHeight = 90;
    const spacing = 15;
    const x = 10;
    const width = ctx.canvas.width - x * 2;
    const startY = 200;

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

        screenTransitions.start(1, 0, BASE_TRANSITION_ANIMATION_TIME, () => {
          clearClicks();
          this.isActive = false;
          this.gameManager.levelManager.nextLevel();
          screenTransitions.start(0, 1, BASE_TRANSITION_ANIMATION_TIME);
        });
      });
    });
  }
}
