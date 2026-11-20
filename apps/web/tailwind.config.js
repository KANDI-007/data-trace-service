/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        navy: "var(--navy)",
        ink: "var(--ink)",
        canvas: "var(--canvas)",
        accent: "var(--accent)",
        "accent-text": "var(--accent-text)",
        whatsapp: "var(--whatsapp)",
        line: "var(--line)",
      },
      fontFamily: { sans: ["Poppins", "system-ui", "sans-serif"] },
      borderRadius: { card: "16px", control: "12px" },
    },
  },
  plugins: [],
};
