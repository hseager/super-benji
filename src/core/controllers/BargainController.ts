import { Bargain } from "../types";
import { GameController } from "./GameController";

export class BargainController {
  private gameManager: GameController;

  constructor(gameManager: GameController) {
    this.gameManager = gameManager;
  }

  getAllBargains() {
    return this.bargains;
  }

  private bargains: Bargain[] = [
    {
      cost: 3,
      description: `50% increase enemy`,
      description2: `projectile speed`,
      apply: async () => {
        this.gameManager.levelManager.enemyTypes =
          this.gameManager.levelManager.enemyTypes.map((e) => {
            e.bulletSpeed *= 1.5;
            return e;
          });
      },
    },
    {
      cost: 4,
      description: `Jackal attacks 20% slower`,
      apply: async () => {
        this.gameManager.levelManager.bossAttackSpeedPenalty = 1.2;
      },
    },
    {
      cost: 8,
      description: `Warp to Rift Horizon`,
      apply: async () => {
        this.gameManager.levelManager.currentLevel = 15;
        this.gameManager.levelManager.startLevel();
      },
    },
    {
      cost: 2,
      description: `Enemies deal double damage`,
      apply: async () => {
        this.gameManager.levelManager.enemyTypes =
          this.gameManager.levelManager.enemyTypes.map((e) => {
            e.bulletDamage *= 2;
            return e;
          });
      },
    },
    {
      cost: 2,
      description: `Enemies have double health`,
      apply: async () => {
        this.gameManager.levelManager.enemyTypes =
          this.gameManager.levelManager.enemyTypes.map((e) => {
            e.health *= 2;
            return e;
          });
      },
    },
    {
      cost: 1,
      description: `Jackal calls for backup`,
      description2: `(Twice as many enemies)`,
      apply: async () => {
        this.gameManager.levelManager.baseEnemyCount *= 2;
      },
    },
    {
      cost: 5,
      description: `You deal double damage`,
      description2: `You have half max health`,
      apply: async () => {
        this.gameManager.player.maxLife /= 2;
        this.gameManager.player.damage *= 2;
      },
    },
    // {
    //   cost: 4,
    //   description: `Enemies do 10% increased`,
    //   description2: "damage",
    //   apply: async () => {
    //     this.gameManager.player.damage += 4;
    //     this.gameManager.player.attackSpeed *= 0.9;
    //     this.gameManager.player.bulletColor = "green";
    //   },
    // },

    // Warp directly to Rift Horizon (Jackal fight)
    // Evasion % also increases damage
    // Legendaries are more common
  ];
}
