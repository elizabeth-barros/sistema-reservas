import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#18212f',
        moss: '#315846',
        coral: '#c76055',
        skywash: '#e8f3f6',
      },
    },
  },
  plugins: [],
};

export default config;
