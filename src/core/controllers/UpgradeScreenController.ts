import { Upgrade, ItemRarity } from "../types";
import { UpgradeController } from "./UpgradeController";
import { RARITY_WEIGHTS } from "../config";
import { GameController } from "./GameController";
import { ChoiceScreenController } from "./ChoiceScreenController";
import { drawEngine } from "./DrawController";
import { screenTransitions } from "./ScreenTransitionController";
import { clearClicks } from "./ClickController";

export class UpgradeScreenController extends ChoiceScreenController<Upgrade> {
  private allUpgrades: Upgrade[] = [];

  constructor(gameManager: GameController) {
    super(gameManager);
    const upgradeController = new UpgradeController(gameManager);
    this.allUpgrades = upgradeController.getAllUpgrades();
  }

  protected getTitle() {
    return "Zone Cleared!";
  }

  protected drawIntroSection() {
    this.gameManager.storyController.drawTorxDialog();
  }

  protected generateOptions(): Upgrade[] {
    const chosen: Upgrade[] = [];
    const pickFromRarity = (rarity: ItemRarity): Upgrade => {
      let pool = this.allUpgrades.filter(
        (u) => u.rarity === rarity && !chosen.includes(u)
      );
      if (!pool.length) {
        pool = this.allUpgrades.filter(
          (u) => u.rarity === "Common" && !chosen.includes(u)
        );
      }
      if (!pool.length) {
        pool = this.allUpgrades.filter((u) => !chosen.includes(u));
      }
      return pool[Math.floor(Math.random() * pool.length)];
    };

    while (chosen.length < 3) {
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

      chosen.push(pickFromRarity(rarity));
    }

    return chosen;
  }

  protected drawOption(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    upgrade: Upgrade
  ) {
    const padding = 10;
    const lineHeight = 18;

    let borderColor = "white";
    if (upgrade.rarity === "Rare") borderColor = "#60a5fa";
    else if (upgrade.rarity === "Epic") borderColor = "#c084fc";
    else if (upgrade.rarity === "Legendary") borderColor = "#fb923c";

    drawEngine.drawRoundedRect(ctx, x, y, w, h, 6, "#222", borderColor);

    let textY = y + lineHeight;
    ctx.fillStyle = borderColor;
    ctx.font = "16px Courier New";
    ctx.fillText(`[${upgrade.rarity}]`, x + padding, textY);

    textY += lineHeight;
    ctx.font = "bold 16px Courier New";
    ctx.fillStyle = "white";
    ctx.fillText(upgrade.name, x + padding, textY);

    ctx.font = "16px Courier New";
    textY += lineHeight;
    ctx.fillText(upgrade.description, x + padding, textY);

    if (upgrade.description2) {
      textY += lineHeight;
      ctx.fillText(upgrade.description2, x + padding, textY);
    }
  }

  protected handleSelection(upgrade: Upgrade) {
    upgrade.apply();
    this.gameManager.musicPlayer.playMenuSuccess();
    this.canSelectOption = false;

    this.allUpgrades = this.allUpgrades.filter((u) => {
      if (u.rarity === "Common") return true;
      return u !== upgrade;
    });

    screenTransitions.fadeOutThenIn(() => {
      clearClicks();
      this.isActive = false;
      this.gameManager.levelManager.nextLevel();
    });
  }
}
