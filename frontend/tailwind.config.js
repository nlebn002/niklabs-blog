/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        sand: "#f8f5ee",
        clay: "#d97706",
        pine: "#0f766e",
        fog: "#e2e8f0"
      },
      boxShadow: {
        card: "0 24px 60px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};
