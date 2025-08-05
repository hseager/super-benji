import { Player, PLAYER_PALETTE } from "@/model/player";
import { SpriteSheet } from "./graphics/sprite-sheet";
import { SpriteBuilder } from "./graphics/sprite-builder";
import { Background } from "@/model/background";
import { Bullet } from "@/model/bullet";
import { LevelManager } from "./level-manager";
import { Enemy, ENEMY_PALETTE } from "@/model/enemy";
import { CollisionManager } from "./collision-manager";

const SPRITE_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABYCAMAAAByMgEaAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAEtQTFRFAAAAKCgoU1NTSUlJMzMzQUFBOjo6ZWVlbGxsd3d3ERERi4uLHR0dXV1dl5eXxMTEsLCwCgoKICAgCQkJ////ISEhYGBg3NzcIyMjvz39MwAAABl0Uk5TAP/+//////////////////9hkSP/HKX/1VEFYkAAAAMrSURBVHic7VfZdts6DBQ2guAiOa4b9/+/tJAsOU56cwtZffQ8OFSOOAQGC6FhuCHn4RETDDsx0uNTFy47CRR/3rmGQQx5GHDH/rOktC6zn62yEOywAok3gisMYGSAA+wQomb6tS67KlU1AE0c3p9GEri5TIRZ6uUKKYmEfbCcGsiyBEqEenIVGeKhqFgR5GYxF8i1y4U4rIGiiSmwLLnQUsNOCSFsQM2ZQLWxdj17DrShIIMHJWiBmqqQE4D27Okkvg0X8ylGgF27S+AapI5zRWwJ8bEIILvmP9b13ipY4MbeCZ5B+lI4df5pOwjqYF/sWf5MYYLpVB+elnSYTcoSJTid7EOBcbYdT7MJ9O2OPwj6fZ3Uz+1X9cROKRhJGke6l651YBwnxQKEQR/MUzBtPpg3lzyOIwIrUiwpRsksb6s1SILdxktPSEQxE2qyllYCb8iA0qcJU+IWlHHkXjYNcK4l0Or17RJCSEW0rgXONxHaHETONSO4/zECUtDStlpwC4rXJ6W5ruE9QiB9IVhFcNmEXIYisjwE4O2rt9LKPRldB/a+RMHSpoyYoMAWB16ryaINxXMmNyhCb/d/LSEJ30uex03LJ4Jd+GWWsFFJdP5kQLSjkCZjz/9CiTfN1+YQu949dSvX7FEDXvMW7CZAjmURQU2jOUHbCMwtyT4c1CAB+22syQnW+3lIvU/qt3XsZlJKPk4I+5UIa1sSpMmUSwqpqES9K4MT8NbXAOt0Iog1E+8f4pcjND7z4kJZinGa3KgYwfw+QWtw6+fv/gPZrnarxhhJbtw2wcZSq1idLnQBIYrVQ2/8thGYorB5UwVtEh1S0nAetiEto0Ahu6J3BCaIDWpt+Eh89u42vPvQ45OKexbToOrDA/qewijLlJi/2/IJ3R6btz0eGpCge/Dok6d75oL5QBqN90xDX1F9qsz69/e+t8DHxL7ny+ArsiW/hA8Q9L+/8v844v4jjjixYDy432I5+y3I4p9H/22AHNOyUj4Uzeofakdy0SirHnChzvvz81EwnM/X5wuaTP1mSs+74J+p4jPS86nss/FczUei8MILL7zwwr/Cb3olFq8dbo59AAAAAElFTkSuQmCC";

export class GameManager {
  player: Player;
  background: Background;
  bullets: Bullet[] = [];
  levelManager: LevelManager;
  enemies: Enemy[] = [];

  // TODO Check a better way to store these
  playerSprite?: HTMLImageElement;
  enemySprite?: HTMLImageElement;

  constructor() {
    // Load Sprite Sheet
    const img = new Image();
    img.src = SPRITE_BASE64;
    const spriteSheet = new SpriteSheet(img);

    this.player = new Player();
    this.levelManager = new LevelManager(this);
    this.background = new Background();

    // Load sprites
    img.onload = async () => {
      this.playerSprite = await SpriteBuilder.createPlayer(
        spriteSheet,
        PLAYER_PALETTE
      );
      this.player.sprite = this.playerSprite;

      this.enemySprite = await SpriteBuilder.createBasicEnemy(
        spriteSheet,
        ENEMY_PALETTE
      );
    };
  }

  update(delta: number, mouse: { x: number; y: number }) {
    const { player, background, bullets, levelManager } = this;

    // Background
    background.update(player.velocityX);

    // Player movement
    player.update(mouse.x, mouse.y);

    // Handle shooting cooldown
    if (player.attackCooldown > 0) {
      player.attackCooldown -= delta;
    }

    if (player.attackCooldown <= 0) {
      this.fireBullet(
        player.x + player.shootingXPosition,
        player.y + player.shootingYPosition
      );
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
}
