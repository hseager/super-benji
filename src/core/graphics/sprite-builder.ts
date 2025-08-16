import { CanvasBuffer } from "./canvas-buffer";
import { PaletteApplier } from "./paletter-applier";
import { SpriteSheet } from "./sprite-sheet";

const SPRITE_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABYCAMAAAByMgEaAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAEtQTFRFAAAAKCgoU1NTSUlJMzMzQUFBOjo6ZWVlbGxsd3d3ERERi4uLHR0dXV1dl5eXxMTEsLCwCgoKICAgCQkJ////ISEhYGBg3NzcIyMjvz39MwAAABl0Uk5TAP/+//////////////////9hkSP/HKX/1VEFYkAAAAMrSURBVHic7VfZdts6DBQ2guAiOa4b9/+/tJAsOU56cwtZffQ8OFSOOAQGC6FhuCHn4RETDDsx0uNTFy47CRR/3rmGQQx5GHDH/rOktC6zn62yEOywAok3gisMYGSAA+wQomb6tS67KlU1AE0c3p9GEri5TIRZ6uUKKYmEfbCcGsiyBEqEenIVGeKhqFgR5GYxF8i1y4U4rIGiiSmwLLnQUsNOCSFsQM2ZQLWxdj17DrShIIMHJWiBmqqQE4D27Okkvg0X8ylGgF27S+AapI5zRWwJ8bEIILvmP9b13ipY4MbeCZ5B+lI4df5pOwjqYF/sWf5MYYLpVB+elnSYTcoSJTid7EOBcbYdT7MJ9O2OPwj6fZ3Uz+1X9cROKRhJGke6l651YBwnxQKEQR/MUzBtPpg3lzyOIwIrUiwpRsksb6s1SILdxktPSEQxE2qyllYCb8iA0qcJU+IWlHHkXjYNcK4l0Or17RJCSEW0rgXONxHaHETONSO4/zECUtDStlpwC4rXJ6W5ruE9QiB9IVhFcNmEXIYisjwE4O2rt9LKPRldB/a+RMHSpoyYoMAWB16ryaINxXMmNyhCb/d/LSEJ30uex03LJ4Jd+GWWsFFJdP5kQLSjkCZjz/9CiTfN1+YQu949dSvX7FEDXvMW7CZAjmURQU2jOUHbCMwtyT4c1CAB+22syQnW+3lIvU/qt3XsZlJKPk4I+5UIa1sSpMmUSwqpqES9K4MT8NbXAOt0Iog1E+8f4pcjND7z4kJZinGa3KgYwfw+QWtw6+fv/gPZrnarxhhJbtw2wcZSq1idLnQBIYrVQ2/8thGYorB5UwVtEh1S0nAetiEto0Ahu6J3BCaIDWpt+Eh89u42vPvQ45OKexbToOrDA/qewijLlJi/2/IJ3R6btz0eGpCge/Dok6d75oL5QBqN90xDX1F9qsz69/e+t8DHxL7ny+ArsiW/hA8Q9L+/8v844v4jjjixYDy432I5+y3I4p9H/22AHNOyUj4Uzeofakdy0SirHnChzvvz81EwnM/X5wuaTP1mSs+74J+p4jPS86nss/FczUei8MILL7zwwr/Cb3olFq8dbo59AAAAAElFTkSuQmCC";

export class SpriteBuilder {
  static async loadSpriteSheet(): Promise<SpriteSheet> {
    const img = new Image();
    img.src = SPRITE_BASE64;
    const spriteSheet = new SpriteSheet(img);

    return new Promise<SpriteSheet>((resolve) => {
      img.onload = async () => {
        resolve(spriteSheet);
      };
    });
  }

  static async createPlayer(
    sheet: SpriteSheet,
    palette: string[]
  ): Promise<HTMLImageElement> {
    const buffer = new CanvasBuffer(27, 32);

    // const wingSize = 6;
    const maxWingSize = 7;
    const bodySize = 13;

    // Draw body
    buffer.drawSprite(sheet, maxWingSize, 0, 0, 15, 13, 30);

    // Draw Basic Wings
    // Left Wing
    buffer.drawSprite(sheet, 1, 18, 0, 45, 6, 9);
    // Right Wing
    buffer.drawSprite(sheet, bodySize + maxWingSize - 1, 18, 0, 45, 6, 9, 1);
    //
    // Advanced Wings
    // Left Wing
    // buffer.drawSprite(sheet, 0, 15, 0, 54, 8, 13);
    // // Right Wing
    // buffer.drawSprite(sheet, bodySize + maxWingSize, 15, 0, 54, 8, 13, 1);

    const sprite = await PaletteApplier.applyPalette(buffer.toImage(), palette);

    // Ensure the sprite is fully loaded so we get the correct dimensions
    await sprite.decode();

    return sprite;
  }

  static async createBasicEnemy(
    sheet: SpriteSheet,
    palette: string[]
  ): Promise<HTMLImageElement> {
    const buffer = new CanvasBuffer(14, 14);

    buffer.drawSprite(sheet, 0, 0, 16, 0, 14, 14);

    const sprite = await PaletteApplier.applyPalette(buffer.toImage(), palette);

    // Ensure the sprite is fully loaded so we get the correct dimensions
    await sprite.decode();

    return sprite;
  }
}
