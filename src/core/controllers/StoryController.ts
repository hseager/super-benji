import {
  AVATAR_BODY_HEIGHT,
  TORX_AVATAR_HEIGHT,
  TORX_AVATAR_WIDTH,
} from "../config";
import { ImageProperties } from "../types";
import { drawEngine } from "./DrawController";
import { GameController } from "./GameController";

export class StoryController {
  gameController: GameController;

  private torxDialog: string[] = [
    "Zone cleared. Time to upgrade.",
    "Your scrap haul looks promising.",
    "Another zone down. Nice work Benji.",
    "The reactor’s stable… for now.",
    "Enemy tech is scrap for us.",
    "Should I cut the green or red wire?",
    "I’ve patched the hull, with sticky tape.",
    "Do you think Maggie likes silver?",
    "What does this big red button do?",
    "This isn't as easy as it looks.",
    "Don’t let the Jackal see this upgrade coming.",
    "Look what I found!",
    "This part looks purr-fect!",
    "Keep your claws sharp, Jackal’s crew is close.",
    "Fitting this might take a while.",
  ];

  private currentTorxDialog: string | null = null; // stores the chosen line

  constructor(gameController: GameController) {
    this.gameController = gameController;
  }

  chooseTorxDialog() {
    this.currentTorxDialog =
      this.torxDialog[Math.floor(Math.random() * this.torxDialog.length)];
  }

  drawAvatar(
    ctx: CanvasRenderingContext2D,
    sprite: HTMLImageElement,
    properties: ImageProperties
  ) {
    if (sprite) {
      const { x, y, width, height } = properties;

      ctx.save();
      // Draw the avatar sprite
      ctx.drawImage(sprite, x, y, width, height);

      // Draw 1px white border
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);
      ctx.strokeRect(x, y, width, height);

      // Draw name under avatar
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "9px monospace";
      ctx.fillText("Torx", x + width / 2, y + height + 10);
      ctx.restore();
    }
  }

  getTorxDialog(ctx: CanvasRenderingContext2D) {
    if (!this.currentTorxDialog) return;

    const spriteManager = this.gameController.spriteManager;

    const dialogBoxHeight = 30;
    const boxPadding = 6; // space inside the box

    const dialogX = 35;
    const lineHeight = 10; // spacing between wrapped lines
    const maxTextWidth = drawEngine.canvasWidth - dialogX - boxPadding;

    ctx.save();
    ctx.font = "8px monospace";

    // --- Wrap Text ---
    const words = this.currentTorxDialog.split(" ");
    const lines: string[] = [];
    let line = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      if (ctx.measureText(testLine).width > maxTextWidth) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line); // push remaining

    const boxHeight = Math.max(
      TORX_AVATAR_HEIGHT + AVATAR_BODY_HEIGHT + 20,
      lines.length * lineHeight + boxPadding * 2
    );
    const boxWidth = drawEngine.canvasWidth - boxPadding * 2;

    // --- Draw Rounded Dialog Box ---
    const radius = 4;
    ctx.fillStyle = "#1f1722";
    ctx.beginPath();
    ctx.moveTo(boxPadding + radius, dialogBoxHeight - boxPadding);
    ctx.lineTo(boxWidth - radius, dialogBoxHeight - boxPadding);
    ctx.quadraticCurveTo(
      boxWidth,
      dialogBoxHeight - boxPadding,
      boxWidth,
      dialogBoxHeight - boxPadding + radius
    );
    ctx.lineTo(boxWidth, dialogBoxHeight - boxPadding + boxHeight - radius);
    ctx.quadraticCurveTo(
      boxWidth,
      dialogBoxHeight - boxPadding + boxHeight,
      boxWidth - radius,
      dialogBoxHeight - boxPadding + boxHeight
    );
    ctx.lineTo(boxPadding + radius, dialogBoxHeight - boxPadding + boxHeight);
    ctx.quadraticCurveTo(
      boxPadding,
      dialogBoxHeight - boxPadding + boxHeight,
      boxPadding,
      dialogBoxHeight - boxPadding + boxHeight - radius
    );
    ctx.lineTo(boxPadding, dialogBoxHeight - boxPadding + radius);
    ctx.quadraticCurveTo(
      boxPadding,
      dialogBoxHeight - boxPadding,
      boxPadding + radius,
      dialogBoxHeight - boxPadding
    );
    ctx.fill();

    const torxSprite = spriteManager.torxAvatar;
    this.drawAvatar(ctx, torxSprite, {
      x: 10,
      y: dialogBoxHeight,
      width: TORX_AVATAR_WIDTH,
      height: TORX_AVATAR_HEIGHT + AVATAR_BODY_HEIGHT,
    });

    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.font = "8px monospace";

    let lineY = dialogBoxHeight + 5;
    for (const l of lines) {
      ctx.fillText(l, dialogX, lineY);
      lineY += lineHeight;
    }

    ctx.restore();
  }
}
