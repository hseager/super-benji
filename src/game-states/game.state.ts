import { State } from "@/core/types";
import { drawEngine } from "@/core/draw-engine";
import { controls } from "@/core/controls";
import { gameStateMachine } from "@/game-state-machine";
import { menuState } from "@/game-states/menu.state";
import { GameManager } from "@/core/game-manager";
import { LoseState } from "./lose.state";

class GameState implements State {
  private ctx;
  private gameManager;

  constructor() {
    this.ctx = drawEngine.context;
    this.gameManager = new GameManager();
  }

  // toggleFullscreen() {
  //   if (!document.fullscreenElement) {
  //     document.documentElement.requestFullscreen();
  //   } else {
  //     document.exitFullscreen();
  //   }
  // }

  onEnter() {
    this.gameManager = new GameManager();

    // Force fullscreen for mobiles as the gestures in most browsers mess with the game
    // and cause them to exit the tab or refresh the page
    // if (window.innerWidth <= 920) {
    //   this.toggleFullscreen();
    // }
  }

  onUpdate(delta: number) {
    // Run game state

    if (controls.isEscape) {
      gameStateMachine.setState(menuState);
    }

    this.checkWinCondition();
    this.checkLoseCondition();
  }

  private checkWinCondition() {
    //
  }

  private checkLoseCondition() {
    if (this.gameManager.player.life <= 0) {
      gameStateMachine.setState(new LoseState());
    }
  }
}

export const gameState = new GameState();
