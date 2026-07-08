import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        safe: '#22c55e',
        caution: '#f59e0b',
        danger: '#ef4444',
        critical: '#7f1d1d',
      },
    },
  },
  plugins: [],
};

export default config;
