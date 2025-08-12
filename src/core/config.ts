// Genreated from ss.png in project root
export const SPRITE_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABYCAMAAAByMgEaAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAGlQTFRFAAAASUlJLCwsQUFBOjo6NDQ0ZGRkFBQUJCQkT09PHR0dXl5eVlZWa2trcnJyeXl5lpaWjo6OhYWFyMjIBwcHpqam3NzcDAwM////HR0dCwsLVFRUCAgIubm51NTU1NTUXl5eISEhZWVlwlG8LgAAACN0Uk5TAP////7///////////////////////9P/44d7nH/X6mw446feByIAAADC0lEQVR4nO1Xa3faMAy1JL/fCYXSbazb/v+PnAKEwUpXNdlH7jkNsU90LV3JsqsUqDs44L3Zu3jNr28nExknJfiuv/8105WiGoxSX8Ve3KDw2pYyE2SxFzfYeYUVKgaFciGukayFwTb0Vpsl9gC50LDfodZETwsIEDQEu63ZGDRLCJRxWIZEezALNYg65gQ6oJfXwg0oqqdgUKulWSA2YwLPei4jUPrNyyexSPq10CrcjMfpET9BMKh2PfTnn42YYLMdrkbHFjPt5UJSgsOhfbkM+uT71+3kwt1udZ8gXd615XXTzvJW1FqYSejbcCmamtDkvrHBIWRhDC2VrOcYagZTeu8BjQ0gK4pOFen57E0Gyqn2fdIZAGQujLpG8+30zg3ZB0qHTdbaRJTJ2DG5uX0FP/3ZsVnPEqJIxdCSdfhyEiFOSTRlLBm5HQgJLFrn/VkEToezKYAm9sX/kBBQ8tZFfxaBZSNgGRzRcSCACT45F92lGFkHw30JhFs7lJyNd16fYzDHMKbciJbnHGxDiegInv/4ND280F71DqwBE3yTWtziZxt1iMFpeLlxQNpRwOpqxgAOjJk1PzeH8K7RNRLhYIbCWfNz3WI9yVhkVQQ46F6ZwM0ElT0pwQnTAGQqjdY4inj2Wae0seSD7GSyQY/Q+E6kI+bTFGU4VDvNyAggJWvQaW/mvoZ52GzBy85W7h9kLWHEF3MMwR034+ZARpbGMH0PnnHq5z/44UvdNT2dsigjKY57z/m9u2GkNmz2sEcCkO2HFPF5Jqg2cF76tqONdDzlBdDqRf2cvQnkn6DtQiZnAGUXtWmZOVjDzUn9Co34phJNlGkw2KtBYBtnMh1viUVkn9v1tmnXiwpqMXEi4SbSz9wLGBV6NUtvQxPGMqZqP/7uXbSh1JxXEJSmbRZfJO4gffzJv7Em/GusCeKIvtK+yWr2XVBbeDG/OEDrtByhrMrmGHJZU4sNqrUrQhgn+7I8Cy3XwgTLNzSvzyeTXh4C/5tKOevlpQwhTLt5TRYeeOCBBx74X/gN1wEaI0xzsV0AAAAASUVORK5CYII=";

// Menus
export const BASE_TRANSITION_ANIMATION_TIME = 0.5;

// Player Stats
export const PLAYER_MAX_LIFE = 100;
export const PLAYER_BULLET_DAMAGE = 10;
export const PLAYER_BULLET_SPEED = 100;
export const PLAYER_ATTACK_SPEED = 0.6;
export const PLAYER_BULLET_COLOR = "#00c1fca4";
export const PLAYER_MOVEMENT_X_SPEED = 75;
export const PLAYER_MOVEMENT_Y_SPEED = 50;

export const PLAYER_HEALTH_GLOW_COLOURS = [
  { hp: 1.0, color: "#00FF66" }, // green
  { hp: 0.75, color: "#00BFFF" }, // blue
  { hp: 0.5, color: "#FFA500" }, // orange
  { hp: 0.25, color: "#FF3333" }, // red
  { hp: 0.0, color: "rgba(255, 0, 0, 0)" }, // transparent red
];

export const PLAYER_BULLET_PALETTE = ["#35a3ec", "#4480b8a2"];

// Enemy
export const ENEMY_MAX_LIFE = 20;
export const ENEMY_BULLET_DAMAGE = 12;
export const ENEMY_PROXIMITY_DAMAGE = 0.5;
export const ENEMY_BULLET_SPEED = 50;
export const ENEMY_MOVEMENT_Y_SPEED = 10;
export const ENEMY_ATTACK_SPEED = 3.5;
export const ENEMY_ATTACK_VARIANCE = 0.3;
export const ENEMY_BULLET_COLOR = "#f0736af1";
export const ENEMY_START_POSITION_Y = -15;

export const ENEMY_BULLET_PALETTE = ["#ff5e49", "#881c18"];

export const BASIC_ENEMY_PALETTE = [
  "#200900", // deep shadow
  "#190902", // dark panel
  "#291403", // mid-tone metal
  "#311d0c", // light mid-tone
  "#a05030", // light metal
  "#c06440", // highlight
  "#e6a67c", // cockpit/engine glow
];

export const MODERATE_ENEMY_PALETTE = [
  "#201a00", // deep shadow
  "#191502", // dark panel
  "#291f03", // mid-tone metal
  "#312e0c", // light mid-tone
  "#a08230", // light metal
  "#c09e40", // highlight
  "#e6d37c", // cockpit/engine glow
];

export const ADVANCED_ENEMY_PALETTE = [
  "#200000", // deep shadow
  "#190202", // dark panel
  "#290303", // mid-tone metal
  "#310c0c", // light mid-tone
  "#A03030", // light metal
  "#c04040", // highlight
  "#e67c7c", // cockpit/engine glow
];

// Background
export const BACKGROUND_HUE_SHIFT = 200; // 20 = 10%
export const BACKGROUND_SATURATION_SHIFT = 10;
export const BACKGROUND_LIGHTNESS_SHIFT = 0;
export const BACKGROUND_MOVEMENT_Y_SPEED = 30;
export const BACKGROUND_CLOUD_OPACITY = 0.1;

// Enemy
export const EXPLOSION_SIZE = 240; // Pixels per second
export const EXPLOSION_PART_SIZE = 6;
export const EXPLOSION_ROTATION_SPEED = 8;
export const EXPLOSION_DURATION = 1.5;
