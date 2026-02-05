import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // NovaClaw Neon Palette
        neon: {
          cyan: "#00f5ff",
          magenta: "#ff00ff",
          purple: "#8b5cf6",
          pink: "#f472b6",
          green: "#00ff88",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.05)",
          medium: "rgba(255, 255, 255, 0.1)",
          dark: "rgba(0, 0, 0, 0.3)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "neon-glow": "linear-gradient(135deg, #00f5ff 0%, #8b5cf6 50%, #ff00ff 100%)",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "gradient-shift": "gradient-shift 8s ease infinite",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(0, 245, 255, 0.8), 0 0 80px rgba(139, 92, 246, 0.5)",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "glow": {
          "from": { textShadow: "0 0 10px #00f5ff, 0 0 20px #00f5ff" },
          "to": { textShadow: "0 0 20px #8b5cf6, 0 0 40px #ff00ff" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 245, 255, 0.5)",
        "neon-purple": "0 0 20px rgba(139, 92, 246, 0.5)",
        "neon-magenta": "0 0 20px rgba(255, 0, 255, 0.5)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
};

export default config;
