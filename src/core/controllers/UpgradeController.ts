import { Upgrade, UpgradeRarity } from "../types";
import { GameController } from "./GameController";

const RarityLabel: Record<string, UpgradeRarity> = {
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
  EVASION: "Evasion",
  MOVESPD: "Move Speed",
};

export class UpgradeController {
  private gameManager: GameController;

  // Change color of boosters
  // Adamite/Mithril panel colour
  private upgrades: Upgrade[] = [
    // Offensive
    {
      rarity: RarityLabel.Common,
      name: "Pulse Lazer MK-II",
      description: `${StatLabel.DMG} +2, ${StatLabel.ATKSPD} +10%`,
      apply: async () => {
        this.gameManager.player.damage += 2;
        this.gameManager.player.attackSpeed *= 0.9;
        this.gameManager.player.bulletColor = "green";
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
      description: `${StatLabel.DMG} +10, ${StatLabel.ATKSPD} +20%`,
      description2: "Spread Shot",
      apply: () => {
        this.gameManager.player.damage += 10;
        this.gameManager.player.attackSpeed *= 0.8;
        this.gameManager.player.bulletColor = "orange";
        this.gameManager.player.shootPattern = "spread";
      },
    },
    {
      rarity: RarityLabel.Legendary,
      name: "Modified Sprinkler",
      description: `${StatLabel.DMG} -8, ${StatLabel.ATKSPD} +60%`,
      description2: "Mega Shot",
      apply: () => {
        this.gameManager.player.damage -= 8;
        this.gameManager.player.attackSpeed *= 0.6;
        this.gameManager.player.bulletColor = "pink";
        this.gameManager.player.shootPattern = "megaspread";
      },
    },
    {
      rarity: RarityLabel.Legendary,
      name: "Glass Canon",
      description: `${StatLabel.HP} -30, ${StatLabel.DMG} +4`,
      description2: "Mega Shot",
      apply: () => {
        this.gameManager.player.damage += 4;
        this.gameManager.player.life -= 30;
        this.gameManager.player.bulletColor = "orange";
        this.gameManager.player.shootPattern = "megaspread";
      },
    },
    // Defensive
    {
      rarity: RarityLabel.Common,
      name: "Mithril Plating",
      description: `${StatLabel.HP} +10, ${StatLabel.REGEN} +2`,
      description2: `${StatLabel.EVASION} +5%`,
      apply: () => {
        this.gameManager.player.maxLife += 20;
        this.gameManager.player.life += 20;
        this.gameManager.player.regen += 5;
        this.gameManager.player.evasion += 5;
      },
    },
    {
      rarity: RarityLabel.Common,
      name: "Adamite Panels",
      description: `${StatLabel.HP} +20, ${StatLabel.REGEN} +5`,
      apply: () => {
        this.gameManager.player.maxLife += 20;
        this.gameManager.player.life += 20;
        this.gameManager.player.regen += 5;
      },
    },
    {
      rarity: RarityLabel.Rare,
      name: "Torx’s Reinforced Shell",
      description: `${StatLabel.HP} +50, ${StatLabel.REGEN} +10`,
      apply: () => {
        this.gameManager.player.maxLife += 50;
        this.gameManager.player.life += 50;
        this.gameManager.player.regen += 10;
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
    // Movement
    {
      rarity: RarityLabel.Common,
      name: "Starwing Stabilizers",
      description: `${StatLabel.MOVESPD} +10%`,
      apply: () => {
        this.gameManager.player.movementXSpeed *= 1.15;
        this.gameManager.player.movementYSpeed *= 1.15;
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
      rarity: RarityLabel.Legendary,
      name: "Voidstep Drive",
      description: `${StatLabel.MOVESPD} +30%`,
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
      rarity: RarityLabel.Rare,
      name: "Plasma Capacitor",
      description: `${StatLabel.ATKSPD} +15%`,
      description2: `${StatLabel.PROJSPD} +15%`,
      apply: () => {
        this.gameManager.player.attackSpeed *= 0.85;
        this.gameManager.player.bulletSpeed *= 1.15;
      },
    },
    {
      rarity: RarityLabel.Legendary,
      name: "Jackalbane Core",
      description: `${StatLabel.DMG} +15, ${StatLabel.HP} +50`,
      apply: () => {
        this.gameManager.player.damage += 15;
        this.gameManager.player.maxLife += 50;
        this.gameManager.player.life += 50;
      },
    },
    // Heal
    {
      rarity: RarityLabel.Common,
      name: "Left-over Sushi",
      description: `${StatLabel.HP} +10, ${StatLabel.REGEN} +1`,
      apply: () => {
        this.gameManager.player.regen += 1;
        this.gameManager.player.maxLife += 10;
        this.gameManager.player.life += 10;
      },
    },
    {
      rarity: RarityLabel.Common,
      name: "Tuna Suprise",
      description: `${StatLabel.HP} +5, ${StatLabel.REGEN} +3`,
      apply: () => {
        this.gameManager.player.regen += 3;
        this.gameManager.player.maxLife += 5;
        this.gameManager.player.life += 5;
      },
    },
    {
      rarity: RarityLabel.Rare,
      name: "Iron Jackal Bru",
      description: `${StatLabel.HP} +10, ${StatLabel.REGEN} +3`,
      description2: `${StatLabel.PROJSPD} +10%`,
      apply: () => {
        this.gameManager.player.regen += 3;
        this.gameManager.player.maxLife += 10;
        this.gameManager.player.bulletSpeed *= 1.1;
      },
    },
  ];

  constructor(gameManager: GameController) {
    this.gameManager = gameManager;
  }

  getAllUpgrades() {
    return this.upgrades;
  }
}
