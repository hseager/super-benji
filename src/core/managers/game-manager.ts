import { Player } from "@/core/model/player";
import { Background } from "@/core/model/background";
import { Bullet } from "@/core/model/bullet";
import { LevelManager } from "./level-manager";
import { Enemy } from "@/core/model/enemy";
import { CollisionManager } from "./collision-manager";
import { SpriteManager } from "./sprite-manager";
import { BulletPool } from "../model/bullet-pool";

export class GameManager {
  spriteManager!: SpriteManager;
  player!: Player;
  background: Background;
  levelManager!: LevelManager;
  enemies: Enemy[] = [];
  playerBulletPool: BulletPool;
  enemyBulletPool: BulletPool;

  constructor() {
    this.playerBulletPool = new BulletPool(100, () => new Bullet(2));
    this.enemyBulletPool = new BulletPool(100, () => new Bullet(2));
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

    this.playerBulletPool.updateAll();
    this.enemyBulletPool.updateAll();

    CollisionManager.checkAll(
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

    // Level logic
    levelManager.update(delta);
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

  async init(): Promise<GameManager> {
    this.spriteManager = await new SpriteManager().init();
    this.player = new Player(
      this.spriteManager.playerSprite,
      this.playerBulletPool
    );
    this.levelManager = new LevelManager(this);

    this.levelManager.startLevel(1);

    return this;
  }
}
