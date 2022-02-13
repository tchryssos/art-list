type ColorHash = `#${string}`;
type ColorRgba = `rgba(${number},${number},${number},${number})`;
export interface ColorModeColors {
  background: ColorHash;
  text: ColorHash;
  success: ColorHash;
  danger: ColorHash;
  accentHeavy: ColorHash;
  accentLight: ColorHash;
  smudge: ColorRgba;
}

export type ColorMode = 'standard';
