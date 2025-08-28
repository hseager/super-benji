import { Bargain } from "../types";
import { GameController } from "./GameController";
import { characterNames } from "./StoryController";

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
      description: `Enemies have increased`,
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
      cost: 8,
      description: `Warp to Rift Horizon`,
      description2: `(Danger!)`,
      apply: async () => {
        this.gameManager.levelManager.currentLevel = 15;
        this.gameManager.levelManager.startLevel();
      },
    },
    {
      cost: 7,
      description: `${characterNames.Benji}'s movement speed`,
      description2: `also increases evasion`,
      apply: async () => {
        this.gameManager.player.moveSpeedEvasionBuff = true;
      },
    },
    {
      cost: 6,
      description: `${characterNames.Benji}'s regen is`,
      description2: `increased at low health`,
      apply: async () => {
        this.gameManager.player.regenIncreaseBuff = true;
      },
    },
    {
      cost: 2,
      description: `Enemies have more health`,
      apply: async () => {
        this.gameManager.levelManager.enemyTypes =
          this.gameManager.levelManager.enemyTypes.map((e) => {
            e.health *= 1.5;
            return e;
          });
      },
    },
    {
      cost: 1,
      description: `Increases the amount`,
      description2: `of enemies`,
      apply: async () => {
        this.gameManager.levelManager.baseEnemyCount *= 1.75;
      },
    },
    {
      cost: 3,
      description: `Changes enemy shooting`,
      description2: `patterns`,
      apply: async () => {
        this.gameManager.levelManager.enemyTypes =
          this.gameManager.levelManager.enemyTypes.map((e) => {
            e.shootPattern = "megaspread";
            return e;
          });
      },
    },
    {
      cost: 5,
      description: `${characterNames.Benji} deals more damage`,
      description2: `${characterNames.Benji} has less max health`,
      apply: async () => {
        this.gameManager.player.maxLife /= 1.5;
        this.gameManager.player.damage *= 1.5;
      },
    },
    {
      cost: 0,
      description: `Last Chance`,
      description2: `Megashot`,
      apply: async () => {
        this.gameManager.player.shootPattern = "megaspread";
      },
    },
  ];
}
