import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        'brand-mint': '#cbe8de',
        'brand-charcoal': '#2d3134',
        'brand-teal': '#0d9488',
        'brand-mint-light': '#e0f2f1',
        'brand-text-dark': '#1a1d20',
        'brand-text-secondary': '#64748b',
        'brand-border-light': '#e2e8f0',
        'brand-border-mint': '#a7f3d0',
        'brand-bg-light': '#f8fafc',
        'brand-charcoal-dark': '#1e293b',
        // Functional Colors
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'info': '#3b82f6',
      },
      fontFamily: {
        'geist': ['Geist', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-brand": "linear-gradient(135deg, #2d3134 0%, #1e293b 50%, #2d3134 100%)",
        "gradient-brand-mint": "linear-gradient(135deg, #cbe8de 0%, #e0f2f1 100%)",
      },

      animation: {
        'gradient-slow': 'gradientBG 15s ease infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradientBG: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
