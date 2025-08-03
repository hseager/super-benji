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
