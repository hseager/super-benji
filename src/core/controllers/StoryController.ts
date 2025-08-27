import { AVATAR_BODY_HEIGHT, STORY_LEVELS } from "../config";
import { Character, ImageProperties, StoryActs, StoryLine } from "../types";
import { drawEngine } from "./DrawController";
import { GameController } from "./GameController";
import { screenTransitions } from "./ScreenTransitionController";

const storyActs: Record<number, StoryLine[]> = {
  [StoryActs.Act1]: [
    {
      speaker: "Maggie",
      text: "Benji, the Iron Jackal has stolen the Warp Core.",
    },
    {
      speaker: "Maggie",
      text: "Who knows what he plans to do with it, but it can't be good.",
    },
    {
      speaker: "Torx",
      text: "That core could power a thousand fleets…",
    },
    {
      speaker: "Benji",
      text: "Then what are we waiting for? After him!",
    },
  ],
  [StoryActs.Act2]: [
    {
      speaker: "Maggie",
      text: "The closer we get, the more concerning some of these readings are. ",
    },
    {
      speaker: "Torx",
      text: "It looks like space-time itself is... distorting...",
    },
    {
      speaker: "Jackal",
      text: "Hahaha, you should be running rather than chasing me!",
    },
    {
      speaker: "Benji",
      text: "You will regret stealing The Warp Core once we are done with you Jackal!",
    },
  ],
  [StoryActs.Act3]: [
    {
      speaker: "Torx",
      text: "We're close, but I hope we're ready, this area looks very unstable.",
    },
    {
      speaker: "Jackal",
      text: "Just in time for us to test the Mega Drive! Hahaha",
    },
    {
      speaker: "Maggie",
      text: "Watch out Benji! He's turned the Warp Core into a weapon!",
    },
    {
      speaker: "Benji",
      text: "This stops now Jackal! Feel my claws",
    },
  ],
  [StoryActs.Epilogue]: [
    {
      speaker: "Maggie",
      text: "It’s done. The Jackal is defeated, and The Core is safe.",
    },
    {
      speaker: "Torx",
      text: "There's plenty of Iron Jackal's allies left to clean up.",
    },
    {
      speaker: "Benji",
      text: "Let's see how far we can get!",
    },
  ],
};

export class StoryController {
  gameController: GameController;
  isActive = true;
  currentAct: number = StoryActs.Act1;
  currentActPart = 0;

  private torxDialog: string[] = [
    "Scrap secured. Upgrade time!",
    "Jackal’s junk is our treasure.",
    "Zone clear. Let’s bolt on something new.",
    "Reactor’s humming—don’t breathe too close.",
    "Cut the green wire… I think.",
    "Hull patched. Tape counts as armor, right?",
    "Think Maggie prefers chrome or silver?",
    "Big red button… probably important.",
  ];
  private maggieDialog: string[] = [
    "You’re betting with lives, Benji - and you don’t have many left.",
    "Nine lives sound plenty… until you spend them like pocket change.",
    "Each choice shaves another chance off your nine lives.",
    "Benji, you’re not rolling dice — you’re rolling your life away.",
    "You're lucky that cats get 9 lives to gamble with.",
  ];

  private currentTorxDialog: string | null = null;
  private currentMaggieDialog: string | null = null;

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

    // Disable dialog showing
    this.isActive = false;

    // Move to next act
    this.currentActPart = 0;
    switch (this.currentAct) {
      case StoryActs.Act1:
        this.currentAct = StoryActs.Act2;
        screenTransitions.fadeOutThenIn(() => {
          this.gameController.startGame();
          this.gameController.paused = false;
        });
        break;
      case StoryActs.Act2:
        this.currentAct = StoryActs.Act3;
        screenTransitions.fadeOutThenIn(() => {
          this.gameController.levelManager.startLevel();
          this.gameController.paused = false;
        });
        break;
      case StoryActs.Act3:
        this.currentAct = StoryActs.Epilogue;
        screenTransitions.fadeOutThenIn(() => {
          this.gameController.levelManager.startLevel();
          this.gameController.paused = false;
        });
        break;
      default:
        screenTransitions.fadeOutThenIn(() => {
          this.gameController.levelManager.startLevel();
          this.gameController.paused = false;
        });
        break;
    }
  }

  progressStory(level: number) {
    STORY_LEVELS.includes(level)
      ? this.activateStory()
      : this.deactivateStory();
  }

  activateStory() {
    this.isActive = true;
    this.gameController.paused = true;
  }

  deactivateStory() {
    this.isActive = false;
    this.gameController.paused = false;
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
      y: dialogBoxY - 75,
      width: 16 * 2.5,
      height: (16 + AVATAR_BODY_HEIGHT) * 2.5,
    };

    // Settings
    const boxPadding = 10;
    const fontSize = 12;
    const lineHeight = fontSize + 4; // breathing room between lines

    ctx.font = `bold ${fontSize}px Courier New`;

    const textX = boxPadding * 2;
    const maxTextWidth = drawEngine.canvasWidth - textX - boxPadding;

    // Word wrapping
    let lines: string[] = [];
    let line = "";
    for (let w of words) {
      const testLine = line + w + " ";
      if (ctx.measureText(testLine).width > maxTextWidth) {
        lines.push(line.trim());
        line = w + " ";
      } else {
        line = testLine;
      }
    }
    if (line.trim()) lines.push(line.trim());

    // Box size
    drawEngine.drawRoundedRect(
      ctx,
      boxPadding,
      dialogBoxY,
      drawEngine.canvasWidth - boxPadding * 2,
      Math.max(dialogBoxHeight, lines.length * lineHeight + boxPadding * 2),
      4,
      "#1f1722"
    );

    // Draw avatar
    this.drawAvatar(ctx, speaker, this.getAvatar(speaker), avatarPos);

    // Draw text
    let y = dialogBoxY + boxPadding / 2 + fontSize;
    for (let l of lines) {
      drawEngine.drawText(l, fontSize, textX, y, "white", "left");
      y += lineHeight;
    }
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
    drawEngine.drawText(
      speaker,
      12,
      x + width / 2,
      y + height + 15,
      "white",
      "center"
    );
    ctx.restore();
  }

  randomiseDialog() {
    this.currentTorxDialog =
      this.torxDialog[Math.floor(Math.random() * this.torxDialog.length)];
    this.currentMaggieDialog =
      this.maggieDialog[Math.floor(Math.random() * this.maggieDialog.length)];
  }

  drawUpgradeDialog(speaker: Character) {
    if (!this.currentMaggieDialog || !this.currentTorxDialog) return;
    if (speaker === "Maggie") {
      if (!this.currentMaggieDialog) return;
      this.drawDialogBox("Maggie", this.currentMaggieDialog, 120, 65);
    } else {
      this.drawDialogBox("Torx", this.currentTorxDialog, 120, 65);
    }
  }
}
