import { Player } from "@/model/player";
import { Background } from "@/model/background";
import { Bullet } from "@/model/bullet";
import { LevelManager } from "./level-manager";
import { Enemy } from "@/model/enemy";
import { CollisionManager } from "./collision-manager";
import { SpriteManager } from "./sprite-manager";

export class GameManager {
  spriteManager!: SpriteManager;
  player!: Player;
  background: Background;
  bullets: Bullet[] = [];
  levelManager!: LevelManager;
  enemies: Enemy[] = [];

  constructor() {
    this.background = new Background();
  }

  update(delta: number, mouse: { x: number; y: number }) {
    const { player, background, bullets, levelManager } = this;

    // Background
    background.update(player.velocityX);

    // Player movement
    player.update(mouse.x, mouse.y);

    // TODO Move to player.shoot()
    // Handle shooting cooldown
    if (player.attackCooldown > 0) {
      player.attackCooldown -= delta;
    }

    if (player.attackCooldown <= 0) {
      this.fireBullet(player.centerX(), player.y);
      player.attackCooldown = player.attackSpeed; // reset cooldown
    }

    // Bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      bullet.update();

      // Remove if off-screen
      if (bullet.offScreen()) {
        bullets.splice(i, 1);
      }
    }

    // Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(delta);

      if (enemy.offScreen()) {
        this.enemies.splice(i, 1);
      }
    }

    CollisionManager.checkAll(this.bullets, this.enemies, (bullet, enemy) => {
      const bulletIndex = this.bullets.indexOf(bullet as Bullet);
      if (bulletIndex !== -1) this.bullets.splice(bulletIndex, 1);

      // Find and remove enemy
      const enemyIndex = this.enemies.indexOf(enemy as Enemy);
      if (enemyIndex !== -1) this.enemies.splice(enemyIndex, 1);
    });

    // Level logic
    levelManager.update(delta);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.background.draw(ctx);
    this.enemies.forEach((enemy) => enemy.draw(ctx));
    this.player.draw(ctx);
    this.bullets.forEach((bullet) => bullet.draw(ctx));
    this.levelManager.draw();
  }

  fireBullet(x: number, y: number) {
    this.bullets.push(new Bullet(x, y));
  }

  addEnemy(enemy: Enemy) {
    this.enemies.push(enemy);
  }

  async init(): Promise<GameManager> {
    this.spriteManager = await new SpriteManager().init();
    this.player = new Player(this.spriteManager.playerSprite);
    this.levelManager = new LevelManager(this);

    this.levelManager.startLevel(1);

    return this;
  }
}
