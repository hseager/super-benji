export function hexToRgba(hex: string, alpha: number = 1) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b, alpha };
}

export function hexToRgbaString(hex: string, alpha: number = 1): string {
  const { r, g, b } = hexToRgba(hex, alpha);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function randomisePalette(palette: string[]): string[] {
  return palette.map((hex) => {
    const { h, s, l } = hexToHSL(hex);

    const hueShift = 200; // 20 = 10%
    const saturationShift = 10;
    const lightnessShift = 5;

    // Small random offsets to keep shade consistent
    const newH = (h + (Math.random() - 0.5) * hueShift + 360) % 360; // ±10° hue
    const newS = Math.min(
      100,
      Math.max(0, s + (Math.random() - 0.5) * saturationShift)
    ); // ±5% sat
    const newL = Math.min(
      100,
      Math.max(0, l + (Math.random() - 0.5) * lightnessShift)
    ); // ±5% lightness

    return hslToHex(newH, newS, newL);
  });
}

function hexToHSL(hex: string) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
