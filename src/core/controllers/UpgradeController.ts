import { Upgrade, ItemRarity } from "../types";
import { GameController } from "./GameController";

const RarityLabel: Record<string, ItemRarity> = {
  Common: "Common",
  Rare: "Rare",
  Epic: "Epic",
  Legendary: "Legendary",
};

const StatLabel: Record<string, string> = {
  DMG: "Damage",
  ATKSPD: "Fire Rate",
  PROJSPD: "Proj Speed",
  HP: "HP",
  REGEN: "Regen",
  HEAL: "Heal",
  EVASION: "Evasion",
  MOVESPD: "Move Speed",
};

export class UpgradeController {
  private gameManager: GameController;

  constructor(gameManager: GameController) {
    this.gameManager = gameManager;
  }

  getAllUpgrades() {
    return this.upgrades;
  }

  // Change color of boosters
  private upgrades: Upgrade[] = [
    // Offensive
    {
      rarity: RarityLabel.Common,
      name: "Pulse Lazer MK-II",
      description: `${StatLabel.DMG} +4, ${StatLabel.ATKSPD} +10%`,
      apply: async () => {
        this.gameManager.player.damage += 4;
        this.gameManager.player.attackSpeed *= 0.9;
        this.gameManager.player.bulletColor = "green";
      },
    },
    {
      rarity: RarityLabel.Common,
      name: "A.F.K Simulator",
      description: `${StatLabel.DMG} +3, ${StatLabel.PROJSPD} 5%`,
      description2: `Spread Shot`,
      apply: async () => {
        this.gameManager.player.damage += 3;
        this.gameManager.player.bulletSpeed *= 1.05;
        this.gameManager.player.bulletColor = "orange";
        this.gameManager.player.shootPattern = "spread";
      },
    },
    {
      rarity: RarityLabel.Common,
      name: "Starburst",
      description: `${StatLabel.DMG} +3, ${StatLabel.ATKSPD} 5%`,
      description2: `Burst Shot`,
      apply: async () => {
        this.gameManager.player.damage += 3;
        this.gameManager.player.attackSpeed *= 0.95;
        this.gameManager.player.shootPattern = "burst";
      },
    },
    {
      rarity: RarityLabel.Rare,
      name: "Nebula Railcoil",
      description: `${StatLabel.DMG} +5, ${StatLabel.PROJSPD} +20%`,
      description2: "Burst Shot",
      apply: () => {
        this.gameManager.player.damage += 5;
        this.gameManager.player.bulletSpeed *= 1.2;
        this.gameManager.player.bulletColor = "purple";
        this.gameManager.player.shootPattern = "burst";
      },
    },
    {
      rarity: RarityLabel.Epic,
      name: "Iron Fang Torpedo",
      description: `${StatLabel.DMG} +6, ${StatLabel.ATKSPD} +20%`,
      description2: "Spread Shot",
      apply: () => {
        this.gameManager.player.damage += 6;
        this.gameManager.player.attackSpeed *= 0.8;
        this.gameManager.player.bulletColor = "orange";
        this.gameManager.player.shootPattern = "spread";
      },
    },
    {
      rarity: RarityLabel.Epic,
      name: "Modified Sprinkler",
      description: `${StatLabel.DMG} -4, ${StatLabel.ATKSPD} +60%`,
      description2: "Mega Shot",
      apply: () => {
        this.gameManager.player.damage -= 4;
        this.gameManager.player.attackSpeed *= 0.6;
        this.gameManager.player.bulletColor = "pink";
        this.gameManager.player.shootPattern = "megaspread";
      },
    },
    {
      rarity: RarityLabel.Legendary,
      name: "Glass Cannon",
      description: `${StatLabel.DMG} +8 ${StatLabel.HP} -40,`,
      description2: "Mega Shot",
      apply: () => {
        this.gameManager.player.damage += 8;
        this.gameManager.player.life -= 30;
        this.gameManager.player.bulletColor = "orange";
        this.gameManager.player.shootPattern = "megaspread";
      },
    },
    // Defensive
    {
      rarity: RarityLabel.Common,
      name: "Mithril Plating",
      description: `${StatLabel.HP} +10, ${StatLabel.REGEN} +3`,
      description2: `${StatLabel.EVASION} +5%`,
      apply: () => {
        this.gameManager.player.maxLife += 20;
        this.gameManager.player.life += 20;
        this.gameManager.player.regen += 5;
        this.gameManager.player.evasion += 5;
        this.gameManager.player.playerColor = "purple";
      },
    },
    {
      rarity: RarityLabel.Common,
      name: "Adamite Panels",
      description: `${StatLabel.HP} +15, ${StatLabel.REGEN} +2`,
      apply: () => {
        this.gameManager.player.maxLife += 20;
        this.gameManager.player.life += 20;
        this.gameManager.player.regen += 5;
        this.gameManager.player.playerColor = "green";
      },
    },
    {
      rarity: RarityLabel.Rare,
      name: "Torx’s Reinforced Shell",
      description: `${StatLabel.HP} +20, ${StatLabel.REGEN} +4`,
      apply: () => {
        this.gameManager.player.maxLife += 20;
        this.gameManager.player.life += 20;
        this.gameManager.player.regen += 4;
      },
    },
    {
      rarity: RarityLabel.Epic,
      name: "Aether Veil",
      description: `${StatLabel.EVASION} +15%`,
      apply: () => {
        this.gameManager.player.evasion += 15;
      },
    },
    {
      rarity: RarityLabel.Legendary,
      name: "Maggie's Cloak",
      description: `${StatLabel.HP} -15, ${StatLabel.REGEN} +5`,
      description2: `${StatLabel.EVASION} +30%`,
      apply: () => {
        this.gameManager.player.maxLife -= 15;
        this.gameManager.player.life -= 20;
        this.gameManager.player.regen += 5;
        this.gameManager.player.evasion += 30;
        this.gameManager.player.playerColor = "blue";
      },
    },
    // Movement
    {
      rarity: RarityLabel.Common,
      name: "Starwing Stabilizers",
      description: `${StatLabel.MOVESPD} +12%`,
      apply: () => {
        this.gameManager.player.movementXSpeed *= 1.12;
        this.gameManager.player.movementYSpeed *= 1.12;
      },
    },
    {
      rarity: RarityLabel.Common,
      name: "Advanced Wings",
      description: `${StatLabel.MOVESPD} +10%`,
      description2: `${StatLabel.ATKSPD} +5%`,
      apply: () => {
        this.gameManager.player.movementXSpeed *= 1.1;
        this.gameManager.player.movementYSpeed *= 1.1;
        this.gameManager.player.attackSpeed *= 0.95;
      },
    },
    {
      rarity: RarityLabel.Rare,
      name: "Meteor Thrusters",
      description: `${StatLabel.MOVESPD} +20%`,
      description2: `${StatLabel.EVASION} +5%`,
      apply: () => {
        this.gameManager.player.movementXSpeed *= 1.2;
        this.gameManager.player.movementYSpeed *= 1.2;
        this.gameManager.player.evasion += 5;
      },
    },
    {
      rarity: RarityLabel.Epic,
      name: "Plasma Rocket Fuel",
      description: `${StatLabel.MOVESPD} +30%`,
      description2: `${StatLabel.EVASION} -10%`,
      apply: () => {
        this.gameManager.player.movementXSpeed *= 1.3;
        this.gameManager.player.movementYSpeed *= 1.3;
        this.gameManager.player.evasion -= 10;
      },
    },
    {
      rarity: RarityLabel.Legendary,
      name: "Voidstep Drive",
      description: `${StatLabel.MOVESPD} +25%`,
      description2: `${StatLabel.EVASION} +10%`,
      apply: () => {
        this.gameManager.player.movementXSpeed *= 1.3;
        this.gameManager.player.movementYSpeed *= 1.3;
        this.gameManager.player.evasion += 10;
      },
    },
    // Utility
    {
      rarity: RarityLabel.Common,
      name: "Hunter’s Instinct",
      description: `${StatLabel.DMG} +4, ${StatLabel.EVASION} +2%`,
      apply: () => {
        this.gameManager.player.damage += 4;
        this.gameManager.player.evasion += 2;
      },
    },
    {
      rarity: RarityLabel.Common,
      name: "Lazer pointer attachment",
      description: `${StatLabel.ATKSPD} +8%`,
      description2: `${StatLabel.EVASION} 3%`,
      apply: () => {
        this.gameManager.player.attackSpeed *= 0.92;
        this.gameManager.player.evasion += 3;
      },
    },
    {
      rarity: RarityLabel.Rare,
      name: "Plasma Capacitor",
      description: `${StatLabel.ATKSPD} +15%`,
      description2: `${StatLabel.PROJSPD} +20%`,
      apply: () => {
        this.gameManager.player.attackSpeed *= 0.85;
        this.gameManager.player.bulletSpeed *= 1.2;
      },
    },
    {
      rarity: RarityLabel.Rare,
      name: "Reverse Polarity",
      description: `${StatLabel.PROJSPD} +30%`,
      description2: `${StatLabel.MOVESPD} -15%`,
      apply: () => {
        this.gameManager.player.bulletSpeed *= 1.3;
        this.gameManager.player.movementXSpeed *= 0.85;
        this.gameManager.player.movementYSpeed *= 0.85;
      },
    },
    {
      rarity: RarityLabel.Epic,
      name: "Warp Core Fragment",
      description: `${StatLabel.ATKSPD} +30%`,
      description2: `${StatLabel.PROJSPD} -40%`,
      apply: () => {
        this.gameManager.player.attackSpeed *= 0.7;
        this.gameManager.player.bulletSpeed *= 0.6;
      },
    },
    {
      rarity: RarityLabel.Legendary,
      name: "Jackalbane Core",
      description: `${StatLabel.DMG} +7, ${StatLabel.HP} +30`,
      description2: `${StatLabel.PROJSPD} 10%`,
      apply: () => {
        this.gameManager.player.damage += 7;
        this.gameManager.player.maxLife += 30;
        this.gameManager.player.life += 30;
        this.gameManager.player.bulletSpeed *= 1.1;
      },
    },
    // Heal
    {
      rarity: RarityLabel.Common,
      name: "Left-over Sushi",
      description: `${StatLabel.HEAL} +10, ${StatLabel.REGEN} +1`,
      apply: () => {
        this.gameManager.player.regen += 1;
        this.gameManager.player.heal(15);
      },
    },
    {
      rarity: RarityLabel.Common,
      name: "Tuna Suprise",
      description: `${StatLabel.HEAL} +15 ${StatLabel.HP} +5`,
      apply: () => {
        this.gameManager.player.maxLife += 5;
        this.gameManager.player.heal(5);
      },
    },
    {
      rarity: RarityLabel.Rare,
      name: "Iron Jackal Bru",
      description: `${StatLabel.HEAL} +25, ${StatLabel.REGEN} +3`,
      description2: `${StatLabel.ATKSPD} +10%`,
      apply: () => {
        this.gameManager.player.regen += 3;
        this.gameManager.player.heal(25);
        this.gameManager.player.attackSpeed *= 0.9;
      },
    },
    {
      rarity: RarityLabel.Legendary,
      name: "Stardust",
      description: `${StatLabel.HEAL} +80, ${StatLabel.ATKSPD} +20%`,
      apply: () => {
        this.gameManager.player.heal(80);
        this.gameManager.player.attackSpeed *= 0.8;
      },
    },
  ];
}
