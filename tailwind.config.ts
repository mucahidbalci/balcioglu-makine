import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // <-- BU SATIR ŞART! YOKSA KARANLIK MOD ÇALIŞMAZ
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;