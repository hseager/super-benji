import { State } from "@/core/types";
import { drawEngine } from "@/core/controllers/DrawController";
import { gameStateMachine } from "@/gameStates/gameStateMachine";
import { GameController } from "@/core/controllers/GameController";
import { LoseState } from "./loseState";
import { MusicPlayer } from "@/core/music/music";
import { screenTransitions } from "@/core/controllers/ScreenTransitionController";
import { BASE_TRANSITION_ANIMATION_TIME } from "@/core/config";

class GameState implements State {
  private ctx;
  private gameManager!: GameController;
  musicPlayer!: MusicPlayer;

  constructor() {
    this.ctx = drawEngine.context;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  async onEnter() {
    // Force fullscreen for mobiles as the gestures in most browsers mess with the game
    // and cause them to exit the tab or refresh the page
    if (window.innerWidth <= 720) {
      this.toggleFullscreen();
    }

    // Setup Music
    this.musicPlayer = new MusicPlayer();
    this.musicPlayer.play();
    this.gameManager = await new GameController().init(this.musicPlayer);
    screenTransitions.start(0, 1, 1);
  }

  onUpdate(delta: number) {
    const mouse = drawEngine.mousePosition;

    if (!this.gameManager) return;

    this.gameManager.update(delta, mouse);
    this.gameManager.draw(this.ctx);

    this.checkLoseCondition();
  }

  private checkLoseCondition() {
    if (this.gameManager.player.isDead()) {
      if (!screenTransitions.active) {
        screenTransitions.start(1, 0, BASE_TRANSITION_ANIMATION_TIME, () => {
          gameStateMachine.setState(
            new LoseState(this.gameManager.levelManager.currentLevel)
          );
          screenTransitions.start(0, 1, BASE_TRANSITION_ANIMATION_TIME);
        });
      }
    }
  }

  onLeave() {
    this.musicPlayer.stop();
  }
}

export const gameState = new GameState();
