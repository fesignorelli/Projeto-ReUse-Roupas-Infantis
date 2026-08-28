/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./index.ts",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        pink: {
          base: "#ffc0cb",
          medium: "#f48199",
          dark: "#e05578",
          light: "#ffdae9",
          xlight: "#fff5f8",
        },
        blue: {
          base: "#89cff0",
          medium: "#5ba8d4",
          dark: "#2d82b7",
          light: "#b9d9eb",
          xlight: "#eaf5fb",
        },
        mint: {
          base: "#ace1af",
          medium: "#6db571",
          dark: "#3d8b42",
          light: "#d0f0c0",
          xlight: "#edf7ed",
        },
        cream: "#fdf8f0",
        offwhite: "#fafafa",
        neutralIcon: "#f1f1f1",
        neutralDivider: "#e0e0e0",
        softBorder: "#f0e8ee",
        ink: {
          dark: "#212121",
          mid: "#555555",
          light: "#888888",
        },
      },
      fontFamily: {
        heading: ["Montserrat_700Bold"],
        headingMedium: ["Montserrat_600SemiBold"],
        body: ["HindMadurai_400Regular"],
        bodyMedium: ["HindMadurai_500Medium"],
        bodySemibold: ["HindMadurai_600SemiBold"],
      },
    },
  },
  plugins: [],
};
