import { Player } from "@/core/model/player";
import { Background } from "@/core/model/background";
import { Bullet } from "@/core/model/bullet";
import { LevelController } from "./LevelController";
import { Enemy } from "@/core/model/enemy";
import { CollisionController } from "./CollisionController";
import { SpriteController } from "./SpriteController";
import { BulletPool } from "../model/bulletPool";
import { UpgradeScreenController } from "./UpgradeScreenController";
import {
  ENEMY_BULLET_COLOR,
  PLAYER_BULLET_COLOR,
  PLAYER_BULLET_DAMAGE,
  PLAYER_BULLET_SPEED,
} from "../config";

export class GameController {
  spriteManager!: SpriteController;
  player!: Player;
  background: Background;
  levelManager!: LevelController;
  enemies: Enemy[] = [];
  playerBulletPool!: BulletPool;
  enemyBulletPool!: BulletPool;
  upgradeScreen: UpgradeScreenController;

  constructor() {
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
    background.update(delta, player.velocityX);

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
    this.playerBulletPool.updateAll(delta);
    this.enemyBulletPool.updateAll(delta);

    // Player Bullet and enemy collision
    CollisionController.checkAll(
      this.playerBulletPool.pool.filter((b) => b.active && !b.isExploding),
      this.enemies.filter((e) => !e.isExploding),
      (bulletObject, enemyObject) => {
        const enemy = enemyObject as Enemy;
        const bullet = bulletObject as Bullet;

        enemy.takeDamage(bullet.damage);
        bullet.explode(6);
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
      this.enemyBulletPool.pool.filter((b) => b.active && !b.isExploding),
      (playerObject, bulletObject) => {
        const player = playerObject as Player;
        const bullet = bulletObject as Bullet;

        player.takeDamage(bullet.damage);
        bullet.explode(6);
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
    // Anything that depends on sprites need to be awaited as the spritesheet is loaded, so we create some objects here instead of the constuctor
    this.spriteManager = await new SpriteController().init();
    const { playerSprite, enemyBulletSprite, playerBulletSprite } =
      this.spriteManager;

    // Create Bullet pools
    this.playerBulletPool = new BulletPool(
      100,
      () => new Bullet(playerBulletSprite, PLAYER_BULLET_COLOR)
    );
    this.enemyBulletPool = new BulletPool(
      100,
      () => new Bullet(enemyBulletSprite, ENEMY_BULLET_COLOR)
    );

    // Create Player
    this.player = new Player(
      playerSprite,
      this.playerBulletPool,
      PLAYER_BULLET_DAMAGE,
      PLAYER_BULLET_SPEED
    );

    // Setup levels
    this.levelManager = new LevelController(this);
    this.levelManager.startLevel(1);

    return this;
  }
}
