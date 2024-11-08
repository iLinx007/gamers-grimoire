/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        edu: ['"Edu AU VIC WA NT Pre"', 'sans-serif'],
        jaro: ['Jaro', 'sans-serif'], // Add Roboto as the default font
      },
    },
  },
  plugins: [],
};
