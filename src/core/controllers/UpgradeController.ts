import { Upgrade } from "../types";
import { GameController } from "./GameController";

export class UpgradeController {
  private gameManager: GameController;

  // TODO Change color of bullets with weapons
  // Change color of boosters
  // Trishot etc
  // Adamite/Mithril panel colour
  private upgrades: Upgrade[] = [
    // Offensive
    {
      rarity: "Common",
      name: "Pulse Lazer MK-II",
      description: "DMG +2, ATK SPD +10%",
      apply: async () => {
        this.gameManager.player.damage += 2;
        this.gameManager.player.attackSpeed *= 0.9;
        this.gameManager.player.bulletColor = "green";
      },
    },
    {
      rarity: "Rare",
      name: "Nebula Railcoil",
      description: "DMG +5, PROJ SPD +20%",
      apply: () => {
        this.gameManager.player.damage += 5;
        this.gameManager.player.bulletSpeed *= 1.2;
        this.gameManager.player.bulletColor = "purple";
      },
    },
    {
      rarity: "Epic",
      name: "Iron Fang Torpedo",
      description: "DMG +10, PROJ SPD +20%",
      description2: "ATK SPD +20%",
      apply: () => {
        this.gameManager.player.damage += 10;
        this.gameManager.player.bulletSpeed *= 1.2;
        this.gameManager.player.attackSpeed *= 0.8;
        this.gameManager.player.bulletColor = "orange";
      },
    },
    // Defensive
    {
      rarity: "Common",
      name: "Mithril Plating",
      description: "HP +10, REGEN +2",
      description2: "EVASION +5%",
      apply: () => {
        this.gameManager.player.maxLife += 20;
        this.gameManager.player.life += 20;
        this.gameManager.player.regen += 5;
        this.gameManager.player.evasion += 5;
      },
    },
    {
      rarity: "Common",
      name: "Adamite Panels",
      description: "HP +20, REGEN +5",
      apply: () => {
        this.gameManager.player.maxLife += 20;
        this.gameManager.player.life += 20;
        this.gameManager.player.regen += 5;
      },
    },
    {
      rarity: "Rare",
      name: "Torx’s Reinforced Shell",
      description: "HP +50, REGEN +10",
      apply: () => {
        this.gameManager.player.maxLife += 50;
        this.gameManager.player.life += 50;
        this.gameManager.player.regen += 10;
      },
    },
    {
      rarity: "Epic",
      name: "Aether Veil",
      description: "EVASION +15%",
      apply: () => {
        this.gameManager.player.evasion += 15;
      },
    },
    // Movement
    {
      rarity: "Common",
      name: "Starwing Stabilizers",
      description: "MOVE SPD +10%",
      apply: () => {
        this.gameManager.player.movementXSpeed *= 1.15;
        this.gameManager.player.movementYSpeed *= 1.15;
      },
    },
    {
      rarity: "Rare",
      name: "Meteor Thrusters",
      description: "MOVE SPD +20%",
      description2: "EVASION +5%",
      apply: () => {
        this.gameManager.player.movementXSpeed *= 1.2;
        this.gameManager.player.movementYSpeed *= 1.2;
        this.gameManager.player.evasion += 5;
      },
    },
    {
      rarity: "Legendary",
      name: "Voidstep Drive",
      description: "MOVE SPD +30%",
      description2: "EVASION +10%",
      apply: () => {
        this.gameManager.player.movementXSpeed *= 1.3;
        this.gameManager.player.movementYSpeed *= 1.3;
        this.gameManager.player.evasion += 10;
      },
    },
    // Utility
    {
      rarity: "Common",
      name: "Hunter’s Instinct",
      description: "DMG +4, EVASION +2%",
      apply: () => {
        this.gameManager.player.damage += 4;
        this.gameManager.player.evasion += 2;
      },
    },
    {
      rarity: "Rare",
      name: "Plasma Capacitor",
      description: "ATK SPD +15%",
      description2: "PROJ SPD +15%",
      apply: () => {
        this.gameManager.player.attackSpeed *= 0.85;
        this.gameManager.player.bulletSpeed *= 1.15;
      },
    },
    {
      rarity: "Legendary",
      name: "Jackalbane Core",
      description: "DMG +15, HP +50",
      apply: () => {
        this.gameManager.player.damage += 15;
        this.gameManager.player.maxLife += 50;
        this.gameManager.player.life += 50;
      },
    },
    // Heal
    {
      rarity: "Common",
      name: "Left-over Sushi",
      description: "HP +10, REGEN +1",
      apply: () => {
        this.gameManager.player.regen += 1;
        this.gameManager.player.maxLife += 10;
        this.gameManager.player.life += 10;
      },
    },
    {
      rarity: "Common",
      name: "Tuna Suprise",
      description: "HP +5, REGEN +3",
      apply: () => {
        this.gameManager.player.regen += 3;
        this.gameManager.player.maxLife += 5;
        this.gameManager.player.life += 5;
      },
    },
    {
      rarity: "Rare",
      name: "Iron Jackal Bru",
      description: "HP +10, REGEN +3",
      description2: "PROJ SPD +10%",
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
