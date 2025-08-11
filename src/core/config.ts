// Genreated from ss.png in project root
export const SPRITE_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABYCAMAAAByMgEaAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAEtQTFRFAAAAKCgoU1NTSUlJMzMzQUFBOjo6ZWVlbGxsd3d3ERERi4uLHR0dXV1dl5eXxMTEsLCwCgoKICAgCQkJ////ISEhYGBg3NzcIyMjvz39MwAAABl0Uk5TAP/+//////////////////9hkSP/HKX/1VEFYkAAAAMrSURBVHic7VfZdts6DBQ2guAiOa4b9/+/tJAsOU56cwtZffQ8OFSOOAQGC6FhuCHn4RETDDsx0uNTFy47CRR/3rmGQQx5GHDH/rOktC6zn62yEOywAok3gisMYGSAA+wQomb6tS67KlU1AE0c3p9GEri5TIRZ6uUKKYmEfbCcGsiyBEqEenIVGeKhqFgR5GYxF8i1y4U4rIGiiSmwLLnQUsNOCSFsQM2ZQLWxdj17DrShIIMHJWiBmqqQE4D27Okkvg0X8ylGgF27S+AapI5zRWwJ8bEIILvmP9b13ipY4MbeCZ5B+lI4df5pOwjqYF/sWf5MYYLpVB+elnSYTcoSJTid7EOBcbYdT7MJ9O2OPwj6fZ3Uz+1X9cROKRhJGke6l651YBwnxQKEQR/MUzBtPpg3lzyOIwIrUiwpRsksb6s1SILdxktPSEQxE2qyllYCb8iA0qcJU+IWlHHkXjYNcK4l0Or17RJCSEW0rgXONxHaHETONSO4/zECUtDStlpwC4rXJ6W5ruE9QiB9IVhFcNmEXIYisjwE4O2rt9LKPRldB/a+RMHSpoyYoMAWB16ryaINxXMmNyhCb/d/LSEJ30uex03LJ4Jd+GWWsFFJdP5kQLSjkCZjz/9CiTfN1+YQu949dSvX7FEDXvMW7CZAjmURQU2jOUHbCMwtyT4c1CAB+22syQnW+3lIvU/qt3XsZlJKPk4I+5UIa1sSpMmUSwqpqES9K4MT8NbXAOt0Iog1E+8f4pcjND7z4kJZinGa3KgYwfw+QWtw6+fv/gPZrnarxhhJbtw2wcZSq1idLnQBIYrVQ2/8thGYorB5UwVtEh1S0nAetiEto0Ahu6J3BCaIDWpt+Eh89u42vPvQ45OKexbToOrDA/qewijLlJi/2/IJ3R6btz0eGpCge/Dok6d75oL5QBqN90xDX1F9qsz69/e+t8DHxL7ny+ArsiW/hA8Q9L+/8v844v4jjjixYDy432I5+y3I4p9H/22AHNOyUj4Uzeofakdy0SirHnChzvvz81EwnM/X5wuaTP1mSs+74J+p4jPS86nss/FczUei8MILL7zwwr/Cb3olFq8dbo59AAAAAElFTkSuQmCC";

export const BASE_TRANSITION_ANIMATION_TIME = 0.5;

// Enemy
export const ENEMY_MAX_LIFE = 20;
export const ENEMY_BULLET_DAMAGE = 5;
export const ENEMY_PROXIMITY_DAMAGE = 0.5;
export const ENEMY_BULLET_SPEED = 1;
export const ENEMY_MOVEMENT_Y_SPEED = 10;
export const ENEMY_ATTACK_SPEED = 3;
export const ENEMY_BULLET_COLOR = "#f0736af1";

// Player Stats
export const PLAYER_MAX_LIFE = 100;
export const PLAYER_BULLET_DAMAGE = 10;
export const PLAYER_BULLET_SPEED = 3;
export const PLAYER_ATTACK_SPEED = 0.5;
export const PLAYER_BULLET_COLOR = "#00c1fca4";

// Background Generation
export const BACKGROUND_HUE_SHIFT = 200; // 20 = 10%
export const BACKGROUND_SATURATION_SHIFT = 10;
export const BACKGROUND_LIGHTNESS_SHIFT = 0;

// Palettes
export const PLAYER_HEALTH_GLOW_COLOURS = [
  { hp: 1.0, color: "#00FF66" }, // green
  { hp: 0.75, color: "#00BFFF" }, // blue
  { hp: 0.5, color: "#FFA500" }, // orange
  { hp: 0.25, color: "#FF3333" }, // red
  { hp: 0.0, color: "rgba(255, 0, 0, 0)" }, // transparent red
];
