// Genreated from ss.png in project root
export const SPRITE_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABYCAMAAAByMgEaAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAEtQTFRFAAAAHh4eEhISPj4+KCgoS0tLMjIyc3NzY2NjVlZWCAgIwMDAioqKnZ2d3NzckJCQ9/f3ra2t4uLiCgoKr6+vnp6eHR0dYGBg8PDwLyecuwAAABl0Uk5TAP///////////v/4///9Iu/LelwjgY6lCv7BgooAAARvSURBVHic7VfZcuQgDDRI4jDgOXLs/v+XbguMj8STuDL7mK4kZbusRkitNhkGGQ6Q+POzv/f7teJ+/7t5fI/3z+8GcvbDo8ttKtFUxDLdLisBfSQow0Be3LDN7XLL2Riu8Q6/eUvxAd5qBhEEccnikrKzSmABJbEup0cMEw/sxbMMzGu8bZCSkrdmxOVDhhCC5OCZUYge7xEw1tUl50x6YY0/ZhCJnvJ1YgLGeX1GxDgqB5OIGDuCwBznwIJXQvHROXaV4IbyNQLdPsdIqIUSmHI7SsFZ9jnQVVyrwWXSoiF+rPGG689YuzEdpWDIxIA0mJsWbl4Jag0cdiWaIWRSm5GPUiAzjFidhtYFJKBLsm7frZCmiaMUCGEtfVGCt6Ttp6wbb51ooJpCejtKYXdxC1V9IaJ52FeL1m3WDMLRHsbdXTIrQYhMmoTYwEGr6Ew66sMOU92si9i0ZTBUPWJ5aYM19WTjLirrH9MIqvTZmdGRq+2o49C6sBDkwW/j5xng1Am0fuNoSNtn56buCFLJm/g6xpqSp06gOhp7D8bWjx1B2mRQNPdYNAXRIvLM0BvYr1QfvYgphSWeAtYNU8AoQnhoYyPgSjF2NFn3Nkop4jqBD+xiSUEsSyQIqYmfenAvQNXnLCQf0OaFIIrzBZTsgsh4mbhC4rq8iTxjlnIh7+hlrmAUisGXK2wNo4895PoqHkbb9gAheobYHfdhyuSNmwngQ7CEkFJE0wzKeJngDEadJEbsCoNEhgLMAuizlF20vQZSpyhklAIl1KG8lVpyB68yiFZNqimBoRuKoAaW39uN0SY6nz1UO1QCWJrRgkG91iEDFJC0A7xYmmA0sMTLIkMLXxXSueY/g1pCQQ0CsR01AaHRYE1ZLZGC2RBgTYytkCXqo/06FQ9ECNmhyHYU3JXVTGAvQY161TIPTn1pGe3XVAJihCBi/QVBSa/L6z5GB9vsjXTzNOVFGmC4lQw/pDpIMKjd1xGaCYZhNy/LIzcXYwN8XJMXBLN+XNflGwFqsCM4xOvbbVKk29vOSvEVoGgEBO+7BLqjfAcJ0HFGadHhvunZHA6PHp8A6WaXPboGrfWcWgE8fRnZMxDOVAlsJ9BA1GvXhq8IHL7GwaG/bnZWCiFBd8IHB6WDLQhl8aQE3AmiJF8pzxEIjhQYWGTQfY1jTjCUj+esY8A/kDJG3723Ldg6jCnh0SkC0ff1W8utb39E2+An36bxHAn8yPSCFYtDkM/TVa56nDnViCHA0LojYdCpmio+n+TONQJT/77oFjPLmPcJlg5hsPsysMMMq/Ad3A2FQAnMoMegUwQ5bG4EMdapJ2s+p+Kj346N3y56ogQBzZPdTs9lvS4o2btzzTpGxqnSh+/fe5xBhl/H7997TOApxHPec4xnFq94ZvtbPLOJivz9K1/Cn9PsQ4g/N3WPE6Dnapnhq8/F4wT2RLzXM9ITGeQa/3MCH2v8zwca60fE/zwDFJDwz+jPpYxjm07z00P5i1/84he/+A/4B4ZhJXc0dSfjAAAAAElFTkSuQmCC";

// Menus
export const BASE_TRANSITION_ANIMATION_TIME = 0.5;

// Player Stats
export const PLAYER_MAX_LIFE = 100;
export const PLAYER_BULLET_DAMAGE = 10;
export const PLAYER_BULLET_SPEED = 100;
export const PLAYER_ATTACK_SPEED = 0.6;
export const PLAYER_MOVEMENT_X_SPEED = 75;
export const PLAYER_MOVEMENT_Y_SPEED = 50;

export const PLAYER_HEALTH_GLOW_COLOURS = [
  { hp: 1.0, color: "#00FF66" }, // green
  { hp: 0.75, color: "#00BFFF" }, // blue
  { hp: 0.5, color: "#FFA500" }, // orange
  { hp: 0.25, color: "#FF3333" }, // red
  { hp: 0.0, color: "rgba(255, 0, 0, 0)" }, // transparent red
];

export const PLAYER_BULLET_PALETTES: Record<string, string[]> = {
  blue: ["#35a3ec", "#4480b8"],
  green: ["#35ec5d", "#44b867"],
  purple: ["#a935ec", "#a144b8"],
  pink: ["#ec35be", "#b84488"],
  orange: ["#eca335", "#b88244"],
};

export const PLAYER_PALETTE = [
  "#202020",
  "#404040",
  "#606060",
  "#808080",
  "#A0A0A0",
  "#C0C0C0",
  "#00BFFF",
];

export const PLAYER_AVATAR_PALETTE = [
  "#000000",
  "#1b1200",
  "#271701",
  "#3a2200",
  "#241700",
  "#604000",
  "#805800",
  "#A07000",
  "#C08800",
  "#FF7F00",
];

// export const PLAYER_PALETTE = [
//   "#201400",
//   "#402800",
//   "#604000",
//   "#805800",
//   "#A07000",
//   "#C08800",
//   "#FF7F00",
// ];

// export const PLAYER_PALETTE = [
//   "#002010",
//   "#004020",
//   "#006030",
//   "#008040",
//   "#00A050",
//   "#00C060",
//   "#00FF7F",
// ];

// export const PLAYER_PALETTE = [
//   "#200000",
//   "#400000",
//   "#601010",
//   "#802020",
//   "#A03030",
//   "#C04040",
//   "#FF3333",
// ];

// Enemy
export const ENEMY_MAX_LIFE = 20;
export const ENEMY_BULLET_DAMAGE = 12;
export const ENEMY_PROXIMITY_DAMAGE = 0.5;
export const ENEMY_BULLET_SPEED = 50;
export const ENEMY_MOVEMENT_Y_SPEED = 20;
export const ENEMY_ATTACK_SPEED = 3.5;
export const ENEMY_ATTACK_VARIANCE = 0.3;
export const ENEMY_START_POSITION_Y = -15;
export const ENEMY_DIRECTION_CHANGE_CHANCE = 0.5; // 50%

export const ENEMY_BULLET_PALETTE = ["#ff5e49", "#881c18"];

export const BASIC_ENEMY_PALETTE = [
  "#200900",
  "#190902",
  "#291403",
  "#311d0c",
  "#a05030",
  "#c06440",
  "#e6a67c",
];

export const MODERATE_ENEMY_PALETTE = [
  "#201a00",
  "#191502",
  "#291f03",
  "#312e0c",
  "#a08230",
  "#c09e40",
  "#e6d37c",
];

export const ADVANCED_ENEMY_PALETTE = [
  "#200000",
  "#190202",
  "#290303",
  "#310c0c",
  "#A03030",
  "#c04040",
  "#e67c7c",
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

// Levels
export const LEVEL_NAMES = [
  "Starfield Frontiers",
  "Verdantia Expanse",
  "Ironfang Megaship",
  "Outer wilds",
];
