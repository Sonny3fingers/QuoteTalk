/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.75s linear 0.75",
        fadeInFaster: "fadeIn 0.3s linear ",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "50%": {
            opacity: 0.5,
          },
          "100%": {
            opacity: 1,
          },
        },
        fadeOut: {
          "0%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.5,
          },
          "100%": {
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
