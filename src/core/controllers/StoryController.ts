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
  currentAct: StoryActs = "act1";
  currentActPart = 0;
  levelsToProgressStory = [6, 11, 16];

  private storyActs: Record<StoryActs, StoryLine[]> = {
    act1: [
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
    ],
    act2: [
      {
        speaker: "Maggie",
        text: "Next stop, Verdantia. Jackal’s forces are harvesting planetary cores to power a superweapon.",
      },
      {
        speaker: "Benji",
        text: "A superweapon? That’s… way above our pay grade.",
      },
      {
        speaker: "Torx",
        text: "Above our pay grade, sure… but at least we get hazard pay in adrenaline!",
      },
      {
        speaker: "Benji",
        text: "Any bright ideas on how to take down a mega-ship before it completes the weapon?",
      },
      {
        speaker: "Torx",
        text: "Step one: survive. Step two: wreak some chaos. Step three: victory… hopefully without turning into space debris.",
      },
      {
        speaker: "Maggie",
        text: "And remember, if the Titan Heart powers up, it won’t just ruin our day—it’ll ruin everyone’s day. Literally.",
      },
    ],
    act3: [
      {
        speaker: "Maggie",
        text: "Ironfang Megaship. Bigger than a moon. Powered by the Heart.",
      },
      { speaker: "Benji", text: "Wow. That’s… intimidating." },
      {
        speaker: "Torx",
        text: "Intimidating? Yes. Inviting for a good wrecking? Absolutely.",
      },
      {
        speaker: "Benji",
        text: "Final showdown time. Jackal, meet chaos and sticky tape.",
      },
      { speaker: "Torx", text: "Let’s go! Moon-sized boss fight incoming!" },
    ],
    epilogue: [
      {
        speaker: "Maggie",
        text: "Well, you did it! But there's still the Jackals fleet to clear up.",
      },
    ],
  };

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

  private currentTorxDialog: string | null = null;

  constructor(gameController: GameController) {
    this.gameController = gameController;
  }

  start() {
    drawEngine.context.canvas.addEventListener(
      "click",
      () => this.isActive && this.next()
    );
  }

  private getCurrentActScript() {
    return this.storyActs[this.currentAct];
  }

  next() {
    const actScript = this.getCurrentActScript();

    if (this.currentActPart < actScript.length - 1) {
      this.currentActPart++;
      return;
    }

    // Move to next act
    this.currentActPart = 0;
    switch (this.currentAct) {
      case "act1":
        this.currentAct = "act2";
        this.gameController.startGame();
        this.gameController.resumeGame();
        break;
      case "act2":
        this.currentAct = "act3";
        this.gameController.levelManager.startLevel();
        this.gameController.resumeGame();
        break;
      case "act3":
        this.currentAct = "epilogue";
        this.gameController.levelManager.startLevel();
        this.gameController.resumeGame();
        break;
    }
  }

  progressStory(level: number) {
    this.levelsToProgressStory.includes(level)
      ? this.gameController.pauseGame()
      : this.gameController.resumeGame();
  }

  draw() {
    if (!this.isActive) return;
    const part = this.getCurrentActScript()[this.currentActPart];
    if (!part) return;
    this.drawDialogBox(part.speaker, part.text, 190, 50);
  }

  private getAvatar(speaker: Character) {
    const sm = this.gameController.spriteManager;
    return speaker === "Maggie"
      ? sm.maggieAvatar
      : speaker === "Torx"
      ? sm.torxAvatar
      : sm.playerAvatar;
  }

  private drawDialogBox(
    speaker: Character,
    text: string,
    dialogBoxY: number,
    dialogBoxHeight: number
  ) {
    const ctx = drawEngine.context;
    const words = text.split(" ");
    const avatarPos: ImageProperties = {
      x: 15,
      y: dialogBoxY - 34,
      width: TORX_AVATAR_WIDTH,
      height: TORX_AVATAR_HEIGHT + AVATAR_BODY_HEIGHT,
    };

    // Draw box
    const boxPadding = 5,
      lineHeight = 10,
      radius = 4;
    const maxTextWidth =
      drawEngine.canvasWidth - (avatarPos.width + boxPadding);

    let lines: string[] = [],
      line = "";
    for (let w of words) {
      const testLine = line + w + " ";
      if (ctx.measureText(testLine).width > maxTextWidth) {
        lines.push(line.trim());
        line = w + " ";
      } else line = testLine;
    }
    lines.push(line.trim());

    const textHeight = lines.length * lineHeight + boxPadding;
    const boxHeight = Math.max(dialogBoxHeight, textHeight);
    const boxWidth = drawEngine.canvasWidth - boxPadding;

    ctx.save();
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

    // Draw avatar & text
    this.drawAvatar(ctx, speaker, this.getAvatar(speaker), avatarPos);
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.font = "8px monospace";
    let y = dialogBoxY + boxPadding + 8;
    for (let l of lines) {
      ctx.fillText(l, boxPadding * 2, y);
      y += lineHeight;
    }
    ctx.restore();
  }

  private drawAvatar(
    ctx: CanvasRenderingContext2D,
    speaker: Character,
    sprite: HTMLImageElement,
    { x, y, width, height }: ImageProperties
  ) {
    if (!sprite) return;
    ctx.save();
    ctx.drawImage(sprite, x, y, width, height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);
    ctx.strokeRect(x, y, width, height);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "9px monospace";
    ctx.fillText(speaker, x + width / 2, y + height + 10);
    ctx.restore();
  }

  chooseTorxDialog() {
    this.currentTorxDialog =
      this.torxDialog[Math.floor(Math.random() * this.torxDialog.length)];
  }

  drawTorxDialog() {
    if (!this.currentTorxDialog) return;
    this.drawDialogBox("Torx", this.currentTorxDialog, 55, 30);
  }
}
