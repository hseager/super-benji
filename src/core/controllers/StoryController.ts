import {
  AVATAR_BODY_HEIGHT,
  TORX_AVATAR_HEIGHT,
  TORX_AVATAR_WIDTH,
} from "../config";
import { Character, ImageProperties, StoryActs, StoryLine } from "../types";
import { drawEngine } from "./DrawController";
import { GameController } from "./GameController";

export class StoryController {
  gameController: GameController;
  isActive = true;
  currentAct: StoryActs = "intro";
  currentActPart = 0;

  private torxDialog: string[] = [
    "Scrap secured. Upgrade time!",
    "Jackal’s junk is our treasure.",
    "Zone clear. Let’s bolt on something new.",
    "Reactor’s humming—don’t breathe too close.",
    "Enemy tech? More like spare parts.",
    "Cut the green wire… I think.",
    "Hull patched. Tape counts as armor, right?",
    "Think Maggie prefers chrome or silver?",
    "Big red button… probably important.",
    "Not easy, but nothing worth doing is.",
    "Shh—don’t tell the Jackal about this mod.",
    "Found a shiny bit for the collection!",
    "This part’s purr-fect for Benji’s claws.",
    "Stay sharp—Jackal’s crew love ambushes.",
    "Fitting this might take a plasma torch… or luck.",
  ];

  private introScript: StoryLine[] = [
    // ---- Prologue / Mission Brief ----
    {
      speaker: "Maggie",
      text: "Benji… the Iron Jackal has stolen the Titan Heart.",
    },
    {
      speaker: "Maggie",
      text: "An ancient crystalline star-core that powers interstellar warp lanes.",
    },
    {
      speaker: "Maggie",
      text: "Without it, entire colonies risk isolation… and collapse.",
    },
    {
      speaker: "Benji",
      text: "Great. So we’re chasing a galaxy-crushing thief again?",
    },
    {
      speaker: "Torx",
      text: "That’s right. First stop: Starfield Frontiers — Jackal’s raiders are tearing the system apart.",
    },
  ];

  // private act1 = [
  //   // ---- Area 1: Starfield Frontiers ----
  //   {
  //     speaker: "Maggie",
  //     text: "First stop: Starfield Frontiers. Jackal’s raiding fleets are stripping systems bare.",
  //   },
  //   {
  //     speaker: "Benji",
  //     text: "And the scavenger drones? Fueling his mega-ship, no doubt.",
  //   },
  //   {
  //     speaker: "Torx",
  //     text: "This isn’t just survival. He’s building something… nasty.",
  //   },
  //   {
  //     speaker: "Benji",
  //     text: "Ugh. Jackal, always gotta make things personal.",
  //   },
  //   {
  //     speaker: "Jackal (broadcast)",
  //     text: "Ha! Feline Star League — always three steps behind!",
  //   },
  //   { speaker: "Torx", text: "Yep. That voice. Big ego, bigger lasers." },
  // ];

  // private act2 = [
  //   // ---- Area 2: Verdantia Planet System ----
  //   {
  //     speaker: "Maggie",
  //     text: "Verdantia. Jackal’s armies are harvesting planetary cores as fuel.",
  //   },
  //   { speaker: "Benji", text: "That’s… awful. And very illegal." },
  //   { speaker: "Torx", text: "Awful, illegal… and we get to stop him. Score!" },
  //   {
  //     speaker: "Benji",
  //     text: "Any bright ideas on how to actually beat a mega-ship?",
  //   },
  //   {
  //     speaker: "Torx",
  //     text: "Step one: survive. Step two: chaos. Step three: victory (hopefully).",
  //   },
  //   {
  //     speaker: "Torx",
  //     text: "Also, if the Heart of Purrima powers up… we’re all in the doghouse. Literally.",
  //   },
  // ];

  // private act3 = [
  //   // ---- Area 3: Ironfang Megaship ----
  //   {
  //     speaker: "Maggie",
  //     text: "Ironfang Megaship. Bigger than a moon. Powered by the Heart.",
  //   },
  //   { speaker: "Benji", text: "Wow. That’s… intimidating." },
  //   {
  //     speaker: "Torx",
  //     text: "Intimidating? Yes. Inviting for a good wrecking? Absolutely.",
  //   },
  //   {
  //     speaker: "Benji",
  //     text: "Final showdown time. Jackal, meet chaos and sticky tape.",
  //   },
  //   { speaker: "Torx", text: "Let’s go! Moon-sized boss fight incoming!" },
  // ];

  private currentTorxDialog: string | null = null; // stores the chosen line

  constructor(gameController: GameController) {
    this.gameController = gameController;
  }

  start() {
    drawEngine.context.canvas.addEventListener("click", () => {
      if (this.isActive) {
        this.next();
      }
    });
  }

  next() {
    this.currentActPart++;

    if (this.currentActPart >= this.introScript.length) {
      this.currentActPart = this.introScript.length - 1; // clamp

      if (this.currentAct === 'intro') {
        this.currentAct = "act1";
        this.gameController.startGame();
      } else if (this.currentAct === 'act1') {
        this.currentAct = "act2";
      } else if (this.currentAct === 'act2') {
        this.currentAct = "act3";
      } else if (this.currentAct === 'act3') {
        this.currentAct = "epilogue";
      }
    }
  }

  progressStory(level: number) {
    if (level === 2) {
      this.gameController.pauseGame();
      this.isActive = true;
    }
  }

  draw() {
    const actPart = this.introScript[this.currentActPart];
    const avatar = this.getDialogAvatar(actPart.speaker);

    const dialogBoxY = 190;
    const dialogBoxHeight = 50;

    this.drawDialogBox(
      drawEngine.context,
      actPart.speaker,
      avatar,
      actPart.text.split(" "),
      dialogBoxY,
      dialogBoxHeight
    );
  }

  getDialogAvatar(speaker: Character) {
    if (speaker === "Benji") {
      return this.gameController.spriteManager.playerAvatar;
    } else if (speaker === "Maggie") {
      return this.gameController.spriteManager.maggieAvatar;
    } else if (speaker === "Torx") {
      return this.gameController.spriteManager.torxAvatar;
    } else if (speaker === "Jackal") {
      return this.gameController.spriteManager.playerAvatar;
    } else {
      return this.gameController.spriteManager.playerAvatar;
    }
  }

  drawActPart() {
    this.getTorxUpgradeDialog(drawEngine.context);
  }

  chooseTorxDialog() {
    this.currentTorxDialog =
      this.torxDialog[Math.floor(Math.random() * this.torxDialog.length)];
  }

  drawAvatar(
    ctx: CanvasRenderingContext2D,
    speaker: Character,
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
      ctx.fillText(speaker, x + width / 2, y + height + 10);
      ctx.restore();
    }
  }

  drawDialogBox(
    ctx: CanvasRenderingContext2D,
    speaker: Character,
    sprite: HTMLImageElement,
    words: string[],
    dialogBoxY: number,
    dialogBoxHeight: number,
  ) {

    const avatarPosition: ImageProperties = {
      x: 15,
      y: dialogBoxY - 34,
      width: TORX_AVATAR_WIDTH,
      height: TORX_AVATAR_HEIGHT + AVATAR_BODY_HEIGHT,
    };

    const boxPadding = 5;
    const lineHeight = 10;
    const radius = 4;

    ctx.save();
    ctx.font = "8px monospace";

    // --- Wrap text ---
    const maxTextWidth =
      drawEngine.canvasWidth - (avatarPosition.width + boxPadding);

    const lines: string[] = [];
    let line = "";
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      if (ctx.measureText(testLine).width > maxTextWidth) {
        lines.push(line.trim());
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    // --- Compute final box height ---
    const textHeight = lines.length * lineHeight + boxPadding;
    const boxHeight = Math.max(dialogBoxHeight, textHeight);

    const boxWidth = drawEngine.canvasWidth - boxPadding;

    // --- Draw Rounded Dialog Box ---
    ctx.fillStyle = "#1f1722";
    ctx.beginPath();
    ctx.moveTo(boxPadding + radius, dialogBoxY);
    ctx.lineTo(boxWidth - radius, dialogBoxY);
    ctx.quadraticCurveTo(boxWidth, dialogBoxY, boxWidth, dialogBoxY + radius);
    ctx.lineTo(boxWidth, dialogBoxY + boxHeight - radius);
    ctx.quadraticCurveTo(
      boxWidth,
      dialogBoxY + boxHeight,
      boxWidth - radius,
      dialogBoxY + boxHeight
    );
    ctx.lineTo(boxPadding + radius, dialogBoxY + boxHeight);
    ctx.quadraticCurveTo(
      boxPadding,
      dialogBoxY + boxHeight,
      boxPadding,
      dialogBoxY + boxHeight - radius
    );
    ctx.lineTo(boxPadding, dialogBoxY + radius);
    ctx.quadraticCurveTo(
      boxPadding,
      dialogBoxY,
      boxPadding + radius,
      dialogBoxY
    );
    ctx.fill();

    // --- Draw Avatar ---
    this.drawAvatar(ctx, speaker, sprite, avatarPosition);

    // --- Draw Text ---
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.font = "8px monospace";

    // Start text to the right of avatar
    const textX = boxPadding * 2;
    let lineY = dialogBoxY + boxPadding + 8;
    for (const l of lines) {
      ctx.fillText(l, textX, lineY);
      lineY += lineHeight;
    }

    ctx.restore();
  }

  getTorxUpgradeDialog(ctx: CanvasRenderingContext2D) {
    if (!this.currentTorxDialog) return;

    const words = this.currentTorxDialog.split(" ");
    const spriteManager = this.gameController.spriteManager;

    const dialogBoxY = 55;
    const dialogBoxHeight = 30;

    this.drawDialogBox(
      ctx,
      "Torx",
      spriteManager.torxAvatar,
      words,
      dialogBoxY,
      dialogBoxHeight
    );

    ctx.restore();
  }
}
