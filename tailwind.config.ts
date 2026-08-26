import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        thai: {
          orange: "#F97316",
          gold: "#FBBF24",
          teal: "#14B8A6",
          deep: "#0F172A",
          sand: "#FBF5E9",
        },
      },
      fontFamily: {
        sans: ["Heebo", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
