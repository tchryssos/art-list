/* eslint-disable import/no-default-export */
import type { Config } from 'tailwindcss';

const colors = {
  background: '#fafafa',
  text: '#17242b',
  success: '#00784e',
  danger: '#db0033',
  accentHeavy: '#adadad',
  accentLight: '#e8e8e8',
  smudge: 'rgba(0,0,0,0.05)',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        jp: [
          "'Hiragino Kaku Gothic Pro'",
          "'メイリオ'",
          "'ＭＳ Ｐゴシック'",
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
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
