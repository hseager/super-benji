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
    // Run game state
    const mouse = drawEngine.mousePosition;

    const { background, player, bullets, levelManager } = this.gameManager;

    // Background
    background?.update(player.velocityX);
    background?.draw(this.ctx);

    // Player
    player?.update(mouse.x, mouse.y);
    player?.draw(this.ctx);

    // Handle shooting cooldown
    const { attackCooldown, attackSpeed } = player;
    if (attackCooldown > 0) {
      player.attackCooldown -= delta;
    }

    if (player.attackCooldown <= 0) {
      this.gameManager.fireBullet(
        player.x + 1,
        player.y - player.shootingYPosition
      );
      player.attackCooldown = attackSpeed; // reset cooldown
    }

    // Bullets
    bullets.forEach((bullet, i) => {
      bullet.update();
      bullet.draw(this.ctx);

      // Remove if off screen
      if (bullet.offScreen()) {
        bullets.splice(i, 1);
      }
    });

    // Update level manager
    levelManager.update(delta);

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
