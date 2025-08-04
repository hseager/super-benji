import { State } from "@/core/types";
import { drawEngine } from "@/core/draw-engine";
import { controls } from "@/core/controls";
import { gameStateMachine } from "@/game-state-machine";
import { menuState } from "@/game-states/menu.state";
import { GameManager } from "@/core/game-manager";
import { LoseState } from "./lose.state";
import { Music } from "@/core/music/music";

class GameState implements State {
  private ctx;
  private gameManager: GameManager;
  private muteButton: HTMLButtonElement;

  musicPlayer: Music;

  constructor() {
    this.ctx = drawEngine.context;
    this.gameManager = new GameManager();

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

  onEnter() {
    this.setupMuteButton();
    // Force fullscreen for mobiles as the gestures in most browsers mess with the game
    // and cause them to exit the tab or refresh the page
    // if (window.innerWidth <= 920) {
    //   this.toggleFullscreen();
    // }

    this.gameManager.levelManager.startLevel(1);

    setTimeout(() => {
      this.gameManager.levelManager.nextLevel();
    }, 4000);
  }

  onUpdate(delta: number) {
    const mouse = drawEngine.mousePosition;

    // Delegate logic to GameManager
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
    if (this.gameManager.player?.life <= 0) {
      gameStateMachine.setState(new LoseState());
    }
  }

  onLeave() {
    this.muteButton.classList.add("hide");
    this.musicPlayer.stop();
  }
}

export const gameState = new GameState();
