import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#F8FAFC",
        panel: "#FFFFFF",
        line: "#E2E8F0",
        cyan: "#2563EB",
        forge: "#4F46E5",
        ink: "#0F172A",
        muted: "#64748B",
        success: "#16A34A",
        warning: "#F59E0B",
      },
      fontFamily: {
        mono: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        grid: "radial-gradient(circle, #E2E8F0 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "26px 26px",
      },
    },
  },
  plugins: [],
};
export default config;
