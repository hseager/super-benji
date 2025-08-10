import { Player } from "@/core/model/player";
import { Background } from "@/core/model/background";
import { Bullet } from "@/core/model/bullet";
import { LevelController } from "./LevelController";
import { Enemy } from "@/core/model/enemy";
import { CollisionController } from "./CollisionController";
import { SpriteController } from "./SpriteController";
import { BulletPool } from "../model/bulletPool";
import { UpgradeScreenController } from "./UpgradeScreenController";
import { ENEMY_BULLET_DAMAGE, PLAYER_BULLET_DAMAGE } from "../config";

export class GameController {
  spriteManager!: SpriteController;
  player!: Player;
  background: Background;
  levelManager!: LevelController;
  enemies: Enemy[] = [];
  playerBulletPool: BulletPool;
  enemyBulletPool: BulletPool;
  upgradeScreen: UpgradeScreenController;

  constructor() {
    this.playerBulletPool = new BulletPool(
      100,
      () => new Bullet(3, "#00c1fca4")
    );
    this.enemyBulletPool = new BulletPool(
      100,
      () => new Bullet(1.5, "#f0736af1")
    );
    this.background = new Background();
    this.upgradeScreen = new UpgradeScreenController(this);
  }

  update(delta: number, mouse: { x: number; y: number }) {
    const { player, background, levelManager } = this;

    // Upgrade Screen
    if (this.upgradeScreen.isActive) {
      this.upgradeScreen.update(delta);
      return;
    }

    // Background
    background.update(player.velocityX);

    // Player movement
    player.update(delta, mouse.x, mouse.y);

    // Enemies
    for (const enemy of this.enemies) {
      enemy.update(delta);
    }
    // Remove dead enemies
    this.enemies = this.enemies.filter(
      (enemy) => !enemy.offScreen() && !enemy.isDead()
    );

    // Bullets
    this.playerBulletPool.updateAll();
    this.enemyBulletPool.updateAll();

    // Bullet and enemy collision
    CollisionController.checkAll(
      this.playerBulletPool.pool,
      this.enemies,
      (bulletObject, enemyObject) => {
        const enemy = enemyObject as Enemy;
        const bullet = bulletObject as Bullet;

        enemy.takeDamage(bullet.damage);
        bullet.active = false;
      }
    );

    // Player and enemy proximity collision
    CollisionController.checkAll(
      [this.player],
      this.enemies,
      (playerObject, enemyObject) => {
        const player = playerObject as Player;
        const enemy = enemyObject as Enemy;
        player.takeDamage(enemy.proximityDamage);
      }
    );

    // Player and enemy bullet collision
    CollisionController.checkAll(
      [this.player],
      this.enemyBulletPool.pool,
      (playerObject, bulletObject) => {
        const player = playerObject as Player;
        const bullet = bulletObject as Bullet;

        player.takeDamage(bullet.damage);
        bullet.active = false;
      }
    );

    // Level logic
    levelManager.update(delta);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.upgradeScreen.isActive) {
      this.upgradeScreen.draw(ctx);
      return;
    }

    this.background.draw(ctx);
    this.enemies.forEach((enemy) => enemy.draw(ctx));
    this.player.draw(ctx);
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
      this.playerBulletPool,
      PLAYER_BULLET_DAMAGE
    );
    this.levelManager = new LevelController(this);

    this.levelManager.startLevel(1);

    return this;
  }
}
