import {
  AVATAR_BODY_HEIGHT,
  TORX_AVATAR_HEIGHT,
  TORX_AVATAR_WIDTH,
} from "../config";
import { Character, ImageProperties, StoryActs, StoryLine } from "../types";
import { drawEngine } from "./DrawController";
import { GameController } from "./GameController";

const storyActs: Record<number, StoryLine[]> = {
  [StoryActs.Act1]: [
    {
      speaker: "Maggie",
      text: "Benji, the Iron Jackal has taken the Titan Heart.",
    },
    {
      speaker: "Maggie",
      text: "Without it, warp lanes will collapse. Whole colonies could be stranded.",
    },
    {
      speaker: "Benji",
      text: "So he wants to choke the galaxy by cutting off its roads. Clever. Evil, but clever.",
    },
    {
      speaker: "Torx",
      text: "Then we’ll just have to hunt him down before the galaxy gridlocks into chaos.",
    },
  ],
  [StoryActs.Act2]: [
    {
      speaker: "Maggie",
      text: "Jackal’s fleet is on Verdantia. He’s channeling the Titan Heart into a weapon core.",
    },
    {
      speaker: "Benji",
      text: "A superweapon, naturally. Why do they always build those instead of, I don’t know, hospitals?",
    },
    {
      speaker: "Torx",
      text: "Because hospitals don’t vaporize planets. Stay sharp — he’s accelerating the build.",
    },
    {
      speaker: "Maggie",
      text: "If he succeeds, no world will be safe. We have to stop him here.",
    },
  ],
  [StoryActs.Act3]: [
    {
      speaker: "Maggie",
      text: "There it is. The Ironfang Megaship… the Titan Heart at its core.",
    },
    {
      speaker: "Benji",
      text: "Looks more like a floating fortress than a ship.",
    },
    {
      speaker: "Jackal",
      text: "You’ve come far, but this is where your defiance ends. The galaxy belongs to me.",
    },
    {
      speaker: "Torx",
      text: "Big words from a man hiding behind a flying mountain.",
    },
    {
      speaker: "Jackal",
      text: "Your courage is amusing. Your resistance is doomed.",
    },
    {
      speaker: "Benji",
      text: "We’ll see. If you want the galaxy, you’ll have to take it over our wreckage.",
    },
    { speaker: "Jackal", text: "Gladly." },
  ],
  [StoryActs.Epilogue]: [
    {
      speaker: "Maggie",
      text: "It’s done. The Jackal is defeated, and the Titan Heart is safe.",
    },
    {
      speaker: "Benji",
      text: "For now. But if he clawed his way back once, he might try again.",
    },
    {
      speaker: "Torx",
      text: "Then we’ll be ready. Galaxy’s not done needing heroes yet.",
    },
  ],
};

export class StoryController {
  gameController: GameController;
  isActive = true;
  currentAct: number = StoryActs.Act1;
  currentActPart = 0;
  levelsToProgressStory = [6, 11, 16];

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
    return storyActs[this.currentAct] ?? [];
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
      case StoryActs.Act1:
        this.currentAct = StoryActs.Act2;
        this.gameController.startGame();
        this.gameController.resumeGame();
        break;
      case StoryActs.Act2:
        this.currentAct = StoryActs.Act3;
        this.gameController.levelManager.startLevel();
        this.gameController.resumeGame();
        break;
      case StoryActs.Act3:
        this.currentAct = StoryActs.Epilogue;
        this.gameController.levelManager.startLevel();
        this.gameController.resumeGame();
        break;
      default:
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

    const script = this.getCurrentActScript();
    let part: StoryLine | undefined;

    if (this.currentActPart >= 0 && this.currentActPart < script.length) {
      part = script[this.currentActPart];
    }

    if (!part) return;
    this.drawDialogBox(
      part.speaker,
      part.text,
      drawEngine.canvasHeight - 65,
      50
    );
  }

  private getAvatar(speaker: Character) {
    const sm = this.gameController.spriteManager;
    return speaker === "Maggie"
      ? sm.maggieAvatar
      : speaker === "Torx"
      ? sm.torxAvatar
      : speaker === "Jackal"
      ? sm.jackalAvatar
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
      x: 25,
      y: dialogBoxY - 65,
      width: TORX_AVATAR_WIDTH * 2,
      height: (TORX_AVATAR_HEIGHT + AVATAR_BODY_HEIGHT) * 2,
    };

    // Draw box
    const boxPadding = 10,
      lineHeight = 10;
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
    const boxWidth = drawEngine.canvasWidth - boxPadding * 2;

    drawEngine.drawRoundedRect(
      ctx,
      boxPadding,
      dialogBoxY,
      boxWidth,
      boxHeight,
      4,
      "#1f1722"
    );

    // Draw avatar & text
    this.drawAvatar(ctx, speaker, this.getAvatar(speaker), avatarPos);

    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.font = "bold 12px Courier New";
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
    ctx.font = "bold 12px Courier New";
    ctx.fillText(speaker, x + width / 2, y + height + 15);
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
