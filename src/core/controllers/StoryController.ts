import {
  AVATAR_BODY_HEIGHT,
  BASE_TRANSITION_ANIMATION_TIME,
  STORY_LEVELS,
  TORX_AVATAR_HEIGHT,
  TORX_AVATAR_WIDTH,
} from "../config";
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
      text: "Just in time for us to test our Mega Drive! Hahaha",
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

    // Disable dialog showing
    this.isActive = false;

    // Move to next act
    this.currentActPart = 0;
    switch (this.currentAct) {
      case StoryActs.Act1:
        this.currentAct = StoryActs.Act2;
        if (!screenTransitions.active) {
          screenTransitions.start(1, 0, BASE_TRANSITION_ANIMATION_TIME, () => {
            this.gameController.startGame();
            this.gameController.resumeGame();
            screenTransitions.start(0, 1, BASE_TRANSITION_ANIMATION_TIME);
          });
        }

        break;
      case StoryActs.Act2:
        this.currentAct = StoryActs.Act3;
        if (!screenTransitions.active) {
          screenTransitions.start(1, 0, BASE_TRANSITION_ANIMATION_TIME, () => {
            this.gameController.levelManager.startLevel();
            this.gameController.resumeGame();
            screenTransitions.start(0, 1, BASE_TRANSITION_ANIMATION_TIME);
          });
        }
        break;
      case StoryActs.Act3:
        this.currentAct = StoryActs.Epilogue;
        if (!screenTransitions.active) {
          screenTransitions.start(1, 0, BASE_TRANSITION_ANIMATION_TIME, () => {
            this.gameController.levelManager.startLevel();
            this.gameController.resumeGame();
            screenTransitions.start(0, 1, BASE_TRANSITION_ANIMATION_TIME);
          });
        }
        break;
      default:
        if (!screenTransitions.active) {
          screenTransitions.start(1, 0, BASE_TRANSITION_ANIMATION_TIME, () => {
            this.gameController.levelManager.startLevel();
            this.gameController.resumeGame();
            screenTransitions.start(0, 1, BASE_TRANSITION_ANIMATION_TIME);
          });
        }
        break;
    }
  }

  progressStory(level: number) {
    STORY_LEVELS.includes(level)
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
    const textHeight = lines.length * lineHeight + boxPadding * 2;
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

    // Draw avatar
    this.drawAvatar(ctx, speaker, this.getAvatar(speaker), avatarPos);

    // Draw text
    ctx.fillStyle = "white";
    ctx.textAlign = "left";

    let y = dialogBoxY + boxPadding / 2 + fontSize;
    for (let l of lines) {
      ctx.fillText(l, textX, y);
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
    this.drawDialogBox("Torx", this.currentTorxDialog, 120, 60);
  }
}
