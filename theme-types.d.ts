// Unfortunately, its not enough to just define our colors
// in tailwind config; some places in the client actually need to
// reference them directly, so we need to define a shared type
// to keep everything in sync
export interface Colors {
  background: '#fafafa';
  text: '#17242b';
  success: '#00784e';
  danger: '#db0033';
  accentHeavy: '#adadad';
  accentLight: '#e8e8e8';
  smudge: 'rgba(0,0,0,0.05)';
}
