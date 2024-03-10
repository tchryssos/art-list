/* eslint-disable import/no-default-export */
import type { Config } from 'tailwindcss';

export const colors = {
  background: '#fafafa',
  text: '#17242b',
  success: '#00784e',
  danger: '#db0033',
  accentHeavy: '#adadad',
  accentLight: '#e8e8e8',
  smudge: 'rgba(0,0,0,0.05)',
  primary: '#9E788F',
  textContrast: '#f1f2eb',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        regular: ['"Lora"', 'serif'],
      },
      boxShadow: {
        'nav-button': `0.0625rem 0.0625rem 0.0625rem ${colors.accentHeavy}`,
        'autocomplete-list': `0.25rem 0.25rem 0.0625rem ${colors.smudge}`,
      },
      spacing: {
        'breakpoint-xs': '639px',
        'breakpoint-sm': '640px',
        'breakpoint-md': '768px',
        'breakpoint-lg': '1024px',
        'breakpoint-xl': '1280px',
      },
    },
    colors,
  },
  plugins: [],
} satisfies Config;
