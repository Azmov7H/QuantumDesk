
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // 👈 التفعيل
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#7c3aed", // بنفسجي فاتح
          DEFAULT: "#6d28d9", // بنفسجي أساسي
          dark: "#4c1d95", // بنفسجي غامق
        },
        background: {
          light: "#ffffff",
          dark: "#0f172a",
        },
        text: {
          light: "#1e293b",
          dark: "#e2e8f0",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        cairo: ["Cairo", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
