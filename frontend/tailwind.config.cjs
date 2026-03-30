/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        trust: {
          50: "#eef6f6",
          100: "#d7e9eb",
          300: "#72a4ad",
          500: "#2d6570",
          700: "#123f4a",
          900: "#0c2d35",
        },
        ambergold: {
          100: "#f8edd0",
          300: "#ebc56a",
          500: "#d89b2b",
          700: "#a87318",
        },
        clay: {
          100: "#f7e0db",
          300: "#dc9888",
          500: "#c46c5a",
          700: "#974838",
        },
        leaf: {
          100: "#deeadf",
          300: "#7daa82",
          500: "#3f6b4b",
          700: "#2f5038",
        },
        ivory: "#f7f3ec",
        ink: "#1f2529",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 18px 50px rgba(17, 27, 31, 0.08)",
        float: "0 22px 60px rgba(18, 63, 74, 0.16)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(216, 155, 43, 0.18), transparent 35%), radial-gradient(circle at bottom right, rgba(18, 63, 74, 0.14), transparent 32%)",
      },
    },
  },
  plugins: [],
};
