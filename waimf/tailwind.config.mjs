/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        heading: '#2D4A68',
        paragaraph: "#333333",
        buttonColor: '#228FFF',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screen: {
        "listing": {max: '1130px'},
      },
        
    },
  },
  plugins: [],
};
