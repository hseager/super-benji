import { Player, PLAYER_PALETTE } from "@/model/player";
import { SpriteSheet } from "./graphics/sprite-sheet";
import { SpriteBuilder } from "./graphics/sprite-builder";
import { Background } from "@/model/background";
import { Bullet } from "@/model/bullet";

const SPRITE_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABYCAMAAAByMgEaAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAThQTFRFAAAATExMSUlJX19fUVFRZmZmUFBQIyMjTk5OLy8vODg4NjY2ZGRkbGxsQUFBR0dHNzc3a2trZ2dnQkJCKysrOzs7Xl5eLS0tYWFhV1dXaGhob29vREREJiYmVFRUOjo6cXFxPj4+ISEhSkpKVVVVFxcXWlpaYmJiaWlpFhYWNTU1dnZ2k5OTGRkZiYmJe3t7Y2NjCwsLJSUlNDQ0cnJyiIiIkZGReHh4S0tLVlZWDg4OCQkJmJiYCAgIfHx8EhISf39/WVlZHBwcjIyMKCgoSEhIFBQUPz8/tra2Hh4ejo6OoaGhMTExIyMjKioqQ0NDERERlJSUgoKCuLi4ICAgfn5+dHR0lpaWBgYGhISEGBgYIiIiGhoaICAgBQUFFxcXJiYmFRUVwcHBJycnJycnqKioCgoKIiIiS71T+gAAAGh0Uk5TAP///////////////////////////////////////////////////////////////x3///////////9V/3H///////////////////+N/////////////xj/qnHjGC+Oo1X/uuP/OB8TpO42AAACMUlEQVR4nO2X15LaQBAAVzkLRQQSOWcwGYyPcITLOTln+///wHC+H/CMH+kqHrthZ2vFipC/mCmC4zGEDKj8R5R/bhsuKpAYKjIqcKhR3zF+8jobi/OIwL1pZBwdEejxJ7m4fQbVW+xMb3KCYmdh/mGg0Z7lZzo+w30B+OqB71+GVDXjRJhU9Pe/B6IFa55r8OxFWi7kTMAveEbzOvFPUHnHkhDnCeEnCYv5+u1GkAEu8O1nHxe4va2+QgWOjhiUH5qcihIm0GRKURmzhokdSLHXiMBb92FhvEEEalJh3EH4fJMprp338CGIxYvIWIj/Agc2YaE1XbThQzD4OJMvH5ehaxDNUc4QyoIL3cjHU75055RjQ2hgcr0SrPH6kgIO4cdglmQX1NSlz0H+sCh3lRlLX4WMjg0JMGnppNLX9PWmLdGQgEgv+3Ktq1/peQn0z7SKKYHdUI1puu6Bnqyq6N5QzZiSl+vLKCywCjOtMyefFpQwJDCi07rF2V5deqeAlrC9lyjasJ0R2oRQkMAOM1+pO1B5R/jY++phAjL5TD5gApnt5w4T6BcxNiHzKnj8W5jt5oUqiECXrj1UkojAjdYLBy1EYNAIUnPQKXrBPJCtBGaIBYT7DIcNvIB95yI1pH+v4fzYAeqORUhVx82yQZdQ98SeGC3lEP6ASqkRxBJ62cCKmCWwXx2l/Ajnw9+cs12rEI4k4Q81muU2iZELP480Kya2ByEBDuzZs2fPnv/HH9MfOmHqf1LYAAAAAElFTkSuQmCC";

export class GameManager {
  player: Player;
  background: Background;
  bullets: Bullet[] = [];

  constructor() {
    // Player
    this.player = new Player();

    const img = new Image();
    img.src = SPRITE_BASE64;
    const spriteSheet = new SpriteSheet(img);

    img.onload = async () => {
      const playerSprite = await SpriteBuilder.createPlayer(
        spriteSheet,
        PLAYER_PALETTE
      );
      this.player.sprite = playerSprite;
    };

    // Background
    this.background = new Background();
  }

  fireBullet(x: number, y: number) {
    this.bullets.push(new Bullet(x, y));
  }
}
