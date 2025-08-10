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
  private muteButton: HTMLButtonElement;

  musicPlayer: Music;

  constructor() {
    this.ctx = drawEngine.context;

    // Setup Music
    this.muteButton = document.querySelector(
      ".mute-button"
    ) as HTMLButtonElement;
    this.musicPlayer = new Music();
  }

  // toggleFullscreen() {
  //   if (!document.fullscreenElement) {
  //     document.documentElement.requestFullscreen();
  //   } else {
  //     document.exitFullscreen();
  //   }
  // }

  setupMuteButton() {
    this.musicPlayer.play();
    this.muteButton.classList.remove("hide");
    this.muteButton.textContent = this.musicPlayer.isPlaying ? "🔈" : "🔇";
    this.muteButton.addEventListener("click", () => {
      if (this.musicPlayer.isPlaying) {
        this.musicPlayer.stop();
        this.muteButton.textContent = "🔇";
      } else {
        this.musicPlayer.play();
        this.muteButton.textContent = "🔈";
      }
    });
  }

  async onEnter() {
    // Force fullscreen for mobiles as the gestures in most browsers mess with the game
    // and cause them to exit the tab or refresh the page
    // if (window.innerWidth <= 920) {
    //   this.toggleFullscreen();
    // }

    this.setupMuteButton();
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
            gameStateMachine.setState(new LoseState());
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
    this.muteButton.classList.add("hide");
    this.musicPlayer.stop();
  }
}

export const gameState = new GameState();
