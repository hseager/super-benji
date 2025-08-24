import { BASE_TRANSITION_ANIMATION_TIME, RARITY_WEIGHTS } from "../config";
import { ItemRarity, Upgrade } from "../types";
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
    const chosen: Upgrade[] = [];

    const rollUpgrade = (): Upgrade => {
      const r = Math.random() * 100;

      let rarity: ItemRarity;
      if (r <= RARITY_WEIGHTS.Legendary) rarity = "Legendary";
      else if (r <= RARITY_WEIGHTS.Legendary + RARITY_WEIGHTS.Epic)
        rarity = "Epic";
      else if (
        r <=
        RARITY_WEIGHTS.Legendary + RARITY_WEIGHTS.Epic + RARITY_WEIGHTS.Rare
      )
        rarity = "Rare";
      else rarity = "Common";

      return pickFromRarity(rarity);
    };

    const pickFromRarity = (rarity: ItemRarity): Upgrade => {
      // Only pick items not already chosen
      let pool = this.allUpgrades.filter(
        (u) => u.rarity === rarity && !chosen.includes(u)
      );

      if (!pool.length) {
        // Fallback to common items that haven't been picked yet
        pool = this.allUpgrades.filter(
          (u) => u.rarity === "Common" && !chosen.includes(u)
        );
      }

      if (!pool.length) {
        // If somehow nothing left, fallback to any not chosen
        pool = this.allUpgrades.filter((u) => !chosen.includes(u));
      }

      return pool[Math.floor(Math.random() * pool.length)];
    };

    while (chosen.length < 3) {
      chosen.push(rollUpgrade());
    }

    this.upgrades = chosen;
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
        this.gameManager.musicPlayer.playMenuSuccess();

        // Prevent multiple clicks
        this.canSelectUpgrade = false;

        // Remove upgrade from future options
        this.allUpgrades = this.allUpgrades.filter((u) => {
          if (u.rarity === "Common") return true; // Don't remove common items so there's always options later
          return u !== upgrade;
        });

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
