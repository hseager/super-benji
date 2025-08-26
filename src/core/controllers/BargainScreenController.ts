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
      this.start();
      this.gameManager.player.revive();
    }
  }

  protected getTitle() {
    return "Life Exchange";
  }

  protected drawIntroSection() {}

  protected generateOptions(): Bargain[] {
    return this.allBargains;
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
    ctx.fillStyle = "white";
    ctx.font = "16px Courier New";
    ctx.fillText(`[${bargain.cost}]`, x + padding, textY);

    textY += lineHeight;
    ctx.fillText(bargain.description, x + padding, textY);

    if (bargain.description2) {
      textY += lineHeight;
      ctx.fillText(bargain.description2, x + padding, textY);
    }
  }

  protected handleSelection(bargain: Bargain) {
    bargain.apply();
    this.gameManager.musicPlayer.playMenuSuccess();
    this.canSelectOption = false;

    screenTransitions.fadeOutThenIn(() => {
      clearClicks();
      this.isActive = false;
      this.gameManager.levelManager.nextLevel();
    });
  }
}
