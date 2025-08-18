import { State } from "@/core/types";
import { drawEngine } from "@/core/controllers/DrawController";
import { controls } from "@/core/controllers/ControlsController";
import { gameStateMachine } from "@/gameStates/gameStateMachine";
import { menuState } from "@/gameStates/menuState";
import { GameController } from "@/core/controllers/GameController";
import { LoseState } from "./loseState";
import { Music } from "@/core/music/music";
import { screenTransitions } from "@/core/controllers/ScreenTransitionController";
import { BASE_TRANSITION_ANIMATION_TIME } from "@/core/config";

class GameState implements State {
  private ctx;
  private gameManager!: GameController;
  musicPlayer!: Music;

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
    this.musicPlayer = new Music();
    this.musicPlayer.play();
    this.gameManager = await new GameController().init();
    screenTransitions.startFade("fade-in", 1);
  }

  onUpdate(delta: number) {
    const mouse = drawEngine.mousePosition;

    if (!this.gameManager) return;

    this.gameManager.update(delta, mouse);
    this.gameManager.draw(this.ctx);

    if (controls.isEscape) {
      gameStateMachine.setState(menuState);
    }

    this.checkWinCondition();
    this.checkLoseCondition();
  }

  private checkWinCondition() {
    // gameStateMachine.setState(new WinState());
  }

  private checkLoseCondition() {
    if (this.gameManager.player.isDead()) {
      if (!screenTransitions.isFading) {
        screenTransitions.startFade(
          "fade-out",
          BASE_TRANSITION_ANIMATION_TIME,
          () => {
            gameStateMachine.setState(
              new LoseState(this.gameManager.levelManager.currentLevel)
            );
            screenTransitions.startFade(
              "fade-in",
              BASE_TRANSITION_ANIMATION_TIME
            );
          }
        );
      }
    }
  }

  onLeave() {
    this.musicPlayer.stop();
  }
}

export const gameState = new GameState();
