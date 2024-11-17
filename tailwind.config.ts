import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.tsx"],
  screens: {
    sm: "640px",
    md: "1024px",
    lg: "1280px",
    xl: "1920px"
  },
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        primary: "#df2a60",
        secondary: "#20D5EC",
        lightGray: "#f1f1f1",
        strongGray: "#707070"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")]
} satisfies Config;

export default config;
