import { TORX_AVATAR_HEIGHT, TORX_AVATAR_WIDTH } from "../config";
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
    "Do you think Maggie likes copper?",
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

  getTorxDialog(ctx: CanvasRenderingContext2D) {
    if (!this.currentTorxDialog) return;

    const spriteManager = this.gameController.spriteManager;

    const boxPadding = 6;           // space inside the box
    const avatarX = 10;
    const avatarY = 25;
    const avatarWidth = TORX_AVATAR_WIDTH;
    const avatarHeight = TORX_AVATAR_HEIGHT;

    const dialogX = 40;
    const dialogY = 30;
    const lineHeight = 10;          // spacing between wrapped lines
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

    const boxHeight = Math.max(avatarHeight + 20, lines.length * lineHeight + boxPadding * 2);
    const boxWidth = drawEngine.canvasWidth - boxPadding * 2;

    // --- Draw Rounded Dialog Box ---
    const radius = 4;
    ctx.fillStyle = "#1f1722";
    ctx.beginPath();
    ctx.moveTo(boxPadding + radius, avatarY - boxPadding);
    ctx.lineTo(boxWidth - radius, avatarY - boxPadding);
    ctx.quadraticCurveTo(boxWidth, avatarY - boxPadding, boxWidth, avatarY - boxPadding + radius);
    ctx.lineTo(boxWidth, avatarY - boxPadding + boxHeight - radius);
    ctx.quadraticCurveTo(boxWidth, avatarY - boxPadding + boxHeight, boxWidth - radius, avatarY - boxPadding + boxHeight);
    ctx.lineTo(boxPadding + radius, avatarY - boxPadding + boxHeight);
    ctx.quadraticCurveTo(boxPadding, avatarY - boxPadding + boxHeight, boxPadding, avatarY - boxPadding + boxHeight - radius);
    ctx.lineTo(boxPadding, avatarY - boxPadding + radius);
    ctx.quadraticCurveTo(boxPadding, avatarY - boxPadding, boxPadding + radius, avatarY - boxPadding);
    ctx.fill();

    // --- Draw Torx Avatar ---
    const torxSprite = spriteManager.torxAvatar;
    if (torxSprite) {
      ctx.drawImage(torxSprite, avatarX, avatarY, avatarWidth, avatarHeight);

      // Draw name under avatar
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "9px monospace";
      ctx.fillText("Torx", avatarX + avatarWidth / 2, avatarY + avatarHeight + 10);
    }

    // --- Draw Dialog Text ---
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.font = "8px monospace";

    let lineY = dialogY;
    for (const l of lines) {
      ctx.fillText(l, dialogX, lineY);
      lineY += lineHeight;
    }

    ctx.restore();
  }



}
