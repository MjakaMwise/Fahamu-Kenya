import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["'DM Serif Display'", "Georgia", "serif"],
        body: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom Fahamu Kenya colors
        "fk-black": "hsl(var(--black))",
        "fk-white": "hsl(var(--white))",
        "fk-cream": "hsl(var(--cream))",
        "fk-sand": "hsl(var(--sand))",
        "fk-charcoal": "hsl(var(--charcoal))",
        "fk-slate": "hsl(var(--slate))",
        "kenya-red": "hsl(var(--kenya-red))",
        "kenya-green": "hsl(var(--kenya-green))",
        "arm-executive": "hsl(var(--executive))",
        "arm-executive-bg": "hsl(var(--executive-bg))",
        "arm-legislature": "hsl(var(--legislature))",
        "arm-legislature-bg": "hsl(var(--legislature-bg))",
        "arm-judiciary": "hsl(var(--judiciary))",
        "arm-judiciary-bg": "hsl(var(--judiciary-bg))",
        "arm-security": "hsl(var(--security))",
        "arm-security-bg": "hsl(var(--security-bg))",
        "arm-county": "hsl(var(--county))",
        "arm-county-bg": "hsl(var(--county-bg))",
        "arm-admin": "hsl(var(--admin))",
        "arm-admin-bg": "hsl(var(--admin-bg))",
        "arm-independent": "hsl(var(--independent))",
        "arm-independent-bg": "hsl(var(--independent-bg))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "var(--radius-pill)",
        "lg-custom": "var(--radius-lg)",
      },
      boxShadow: {
        "fk-sm": "var(--shadow-sm)",
        "fk-md": "var(--shadow-md)",
        "fk-lg": "var(--shadow-lg)",
        "fk-xl": "var(--shadow-xl)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
