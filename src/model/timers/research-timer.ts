import { TimerType } from "@/core/types";
import { Timer } from "./timer";
import { select } from "@/util";
import {
  hideResearchOptions,
  showResearchOptions,
} from "@/core/research-manager";
import { playerResearchTimerSpeed } from "@/core/config";
import { GameManager } from "@/core/game-manager";

export class ResearchTimer extends Timer {
  constructor() {
    super(TimerType.PlayerResearch, playerResearchTimerSpeed);
  }

  start() {
    super.start();
    hideResearchOptions();
  }

  handleComplete(gameManager: GameManager) {
    super.stop();
    gameManager.levelUp();
    showResearchOptions(gameManager);
  }

  tick(deltaTime: number) {
    super.tick(deltaTime);

    const progress = select<HTMLProgressElement>("#research-progress");
    if (progress) {
      progress.value = this.currentTime / 10;
    }
  }
}
