import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          light: "#EFF6FF",
        },
        surface: "#FFFFFF",
        background: "#F8FAFC",
        border: "#E5E7EB",
        "text-primary": "#1E293B",
        "text-secondary": "#64748B",
        "text-muted": "#94A3B8",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: [
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "-apple-system",
          "sans-serif",
        ],
      },
      borderRadius: {
        "card": "12px",
        "btn": "8px",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.06)",
        "card-hover": "0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.06)",
      },
      spacing: {
        "sidebar": "280px",
        "inspector": "360px",
        "header": "56px",
      },
    },
  },
  plugins: [],
};

export default config;
