import { Player } from "@/core/model/player";
import { Background } from "@/core/model/background";
import { Bullet } from "@/core/model/bullet";
import { LevelController } from "./LevelController";
import { Enemy } from "@/core/model/enemy";
import { CollisionController } from "./CollisionController";
import { SpriteController } from "./SpriteController";
import { BulletPool } from "../model/bulletPool";

export class GameController {
  spriteManager!: SpriteController;
  player!: Player;
  background: Background;
  levelManager!: LevelController;
  enemies: Enemy[] = [];
  playerBulletPool: BulletPool;
  enemyBulletPool: BulletPool;

  constructor() {
    this.playerBulletPool = new BulletPool(100, () => new Bullet(3));
    this.enemyBulletPool = new BulletPool(100, () => new Bullet(1));
    this.background = new Background();
  }

  update(delta: number, mouse: { x: number; y: number }) {
    const { player, background, levelManager } = this;

    // Background
    background.update(player.velocityX);

    // Player movement
    player.update(delta, mouse.x, mouse.y);

    // Enemies
    for (const enemy of this.enemies) {
      enemy.update(delta);
    }

    this.enemies = this.enemies.filter(
      (enemy) => !enemy.offScreen() && !enemy.isDead()
    );

    this.playerBulletPool.updateAll();
    this.enemyBulletPool.updateAll();

    CollisionController.checkAll(
      this.playerBulletPool.pool,
      this.enemies,
      (bulletObject, enemyObject) => {
        const enemy = enemyObject as Enemy;

        if (!enemy.isExploding) {
          const bullet = this.playerBulletPool.pool.find(
            (b) => b === bulletObject
          );
          if (bullet) bullet.active = false;
        }

        enemy.explode();
      }
    );

    CollisionController.checkAll(
      [this.player],
      this.enemies,
      (playerObject, enemyObject) => {
        const player = playerObject as Player;
        const enemy = enemyObject as Enemy;

        player.life -= enemy.proximityDamage;
      }
    );

    this.checkPlayerLife();

    // Level logic
    levelManager.update(delta);
  }

  checkPlayerLife() {
    if (this.player.life <= 0) {
      this.player.explode(20);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.background.draw(ctx);
    this.enemies.forEach((enemy) => enemy.draw(ctx));
    this.player.draw(ctx);
    // this.bullets.forEach((bullet) => bullet.draw(ctx));
    this.levelManager.draw();

    this.playerBulletPool.drawAll(ctx);
    this.enemyBulletPool.drawAll(ctx);
  }

  addEnemy(enemy: Enemy) {
    this.enemies.push(enemy);
  }

  async init(): Promise<GameController> {
    this.spriteManager = await new SpriteController().init();
    this.player = new Player(
      this.spriteManager.playerSprite,
      this.playerBulletPool
    );
    this.levelManager = new LevelController(this);

    this.levelManager.startLevel(1);

    return this;
  }
}
