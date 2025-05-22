import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media", // Enables OS-level dark mode
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-dark': 'var(--color-navy-dark)',
        'navy': 'var(--color-navy)',
        'royal': 'var(--color-royal)',
        'cyan': 'var(--color-cyan)',
        'steel': 'var(--color-steel)',
        'stone': 'var(--color-stone)',
        'white': 'var(--color-white)',
        'background-body': 'var(--background-body)',
        'background-surface': 'var(--background-surface)',
        'background-neutral': 'var(--background-neutral)',
        'foreground-default': 'var(--foreground-default)',
        'foreground-muted': 'var(--foreground-muted)',
        'foreground-on-accent': 'var(--foreground-on-accent)',
        'foreground-accent': 'var(--foreground-accent)',
        'foreground-accent-hover': 'var(--foreground-accent-hover)',
      },
      fontFamily: {
        heading: ['Europa', 'sans-serif'],
        'body-en': ['Europa', 'sans-serif'],
        'body-he': ['Open Sans Hebrew', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        'card': '1rem',
        'button': '1rem',
        'input': '1rem',
      },
      spacing: {
        'grid-unit': '0.5rem',
      },
      maxWidth: {
        'container': '1280px',
      },
      boxShadow: {
        DEFAULT: '0 4px 16px rgba(0,0,0,0.25)',
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(to bottom, var(--color-navy-dark), var(--color-navy))',
        'gradient-highlight': 'linear-gradient(135deg, var(--color-royal), var(--color-cyan))',
      },
      transitionDuration: {
        'slow': '0.5s',
        'normal': '0.3s',
        'fast': '0.15s',
      },
      transitionTimingFunction: {
        'custom-bezier': 'cubic-bezier(0.25,0.1,0.25,1)',
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'), // Uncomment if you want the forms plugin
  ],
};

export default config;
