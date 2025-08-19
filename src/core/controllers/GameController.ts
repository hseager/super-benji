import { Player } from "@/core/model/player";
import { Background } from "@/core/model/background";
import { Bullet } from "@/core/model/bullet";
import { LevelController } from "./LevelController";
import { Enemy } from "@/core/model/enemy";
import { CollisionController } from "./CollisionController";
import { SpriteController } from "./SpriteController";
import { BulletPool } from "../model/bulletPool";
import { UpgradeScreenController } from "./UpgradeScreenController";
import { roll } from "../utilities";
import { StoryController } from "./StoryController";

export class GameController {
  spriteManager!: SpriteController;
  player!: Player;
  background: Background;
  levelManager!: LevelController;
  enemies: Enemy[] = [];
  playerBulletPool!: BulletPool;
  enemyBulletPool!: BulletPool;
  storyController: StoryController;
  upgradeScreen: UpgradeScreenController;

  constructor() {
    this.background = new Background();
    this.storyController = new StoryController(this);
    this.upgradeScreen = new UpgradeScreenController(this);
  }

  update(delta: number, mouse: { x: number; y: number }) {
    const { player, background, levelManager } = this;

    // Background
    background.update(delta, player.velocity);

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
        bullet.explode(6, 1);
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

        if (roll() < player.evasion) {
          bullet.explode(6, 1);
          return;
        }

        player.takeDamage(bullet.damage);
        bullet.explode(6, 1);
      }
    );

    // Level logic
    levelManager && levelManager.update(delta);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.upgradeScreen.isActive) {
      this.upgradeScreen.draw(ctx);
      return;
    }

    this.background.draw(ctx);
    this.enemies.forEach((enemy) => enemy.draw(ctx));
    this.player.draw(ctx);
    this.levelManager && this.levelManager.draw();

    this.playerBulletPool.drawAll(ctx);
    this.enemyBulletPool.drawAll(ctx);

    if (this.storyController.isActive) {
      this.storyController.draw();
    }
  }

  addEnemy(enemy: Enemy) {
    this.enemies.push(enemy);
  }

  async init(): Promise<GameController> {
    // Anything that depends on sprites need to be awaited as the spritesheet is loaded, so we create some objects here instead of the constuctor
    this.spriteManager = await new SpriteController().init();
    const { playerSprite, enemyBulletSprite } = this.spriteManager;

    // Create Bullet pools
    this.playerBulletPool = new BulletPool(100, () => {
      // always grab the latest sprite from the sprite manager
      return new Bullet(this.spriteManager.getBulletSprite());
    });
    this.enemyBulletPool = new BulletPool(
      100,
      () => new Bullet(enemyBulletSprite)
    );

    // Create Player
    this.player = new Player(this, playerSprite, this.playerBulletPool);

    // Setup levels
    // this.player.active = true;
    // this.levelManager = new LevelController(this);
    // this.levelManager.startLevel(1);

    return this;
  }
}
