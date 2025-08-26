import { Bargain } from "../types";
import { BargainController } from "./BargainController";
import { ChoiceScreenController } from "./ChoiceScreenController";
import { clearClicks } from "./ClickController";
import { drawEngine } from "./DrawController";
import { GameController } from "./GameController";
import { screenTransitions } from "./ScreenTransitionController";

export class BargainScreenController extends ChoiceScreenController<Bargain> {
  private allBargains: Bargain[] = [];

  constructor(gameManager: GameController) {
    super(gameManager);
    const bargainController = new BargainController(gameManager);
    this.allBargains = bargainController.getAllBargains();
  }

  update() {
    if (this.gameManager.player.isDead()) {
      this.gameManager.paused = true;
      this.start();
      this.gameManager.player.revive();
    }
  }

  protected getTitle() {
    return "Life Exchange";
  }

  protected drawIntroSection() {
    drawEngine.drawTitle(
      this.gameManager.player.lives.toString(),
      38,
      drawEngine.getCenterX() - 25,
      112
    );
    drawEngine.drawBenjiCoin(this.gameManager.spriteManager.benjiCoin, {
      x: drawEngine.getCenterX() + 25,
      y: 100,
    });
  }

  protected generateOptions(): Bargain[] {
    // Filter bargains by cost < playerLives
    const validBargains = this.allBargains.filter(
      (b) => b.cost < this.gameManager.player.lives
    );

    // Shuffle the bargains
    for (let i = validBargains.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [validBargains[i], validBargains[j]] = [
        validBargains[j],
        validBargains[i],
      ];
    }

    return validBargains;
  }

  protected drawOption(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    bargain: Bargain
  ) {
    const padding = 10;
    const lineHeight = 18;

    drawEngine.drawRoundedRect(ctx, x, y, w, h, 6, "#222", "white");

    let textY = y + lineHeight;

    drawEngine.drawTitle(
      bargain.cost.toString(),
      24,
      drawEngine.getCenterX() - 13,
      textY + 10
    );
    drawEngine.drawBenjiCoin(
      this.gameManager.spriteManager.benjiCoin,
      {
        x: drawEngine.getCenterX() + 13,
        y: textY + 3,
      },
      10
    );

    ctx.fillStyle = "white";
    ctx.font = "16px Courier New";
    textY += lineHeight * 2;
    ctx.fillText(bargain.description, x + padding, textY);

    if (bargain.description2) {
      textY += lineHeight;
      ctx.fillText(bargain.description2, x + padding, textY);
    }
  }

  protected handleSelection(bargain: Bargain) {
    bargain.apply();
    this.gameManager.player.lives -= bargain.cost;
    this.gameManager.musicPlayer.playMenuSuccess();
    this.canSelectOption = false;

    screenTransitions.fadeOutThenIn(() => {
      clearClicks();
      this.isActive = false;
      this.gameManager.paused = false;
    });
  }
}
