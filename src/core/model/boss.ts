import { BOSS_ATTACK_SPEED, BOSS_MAX_LIFE } from "../config";
import { Enemy } from "./enemy";

export class Boss extends Enemy {
  glowColor: string = "#ff1e007c";
  glowAmount: number = 12;

  // Stats
  maxLife = BOSS_MAX_LIFE;
  life = BOSS_MAX_LIFE;
  attackSpeed: number = BOSS_ATTACK_SPEED;
  shootDir = { x: 0, y: 1 };
}
