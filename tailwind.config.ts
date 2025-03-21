//write tailwind config here 
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",  
  ],
  theme: {
    extend: { 
      animation: {
        shimmer: 'shimmer 2s infinite linear'
      }, 
      keyframes: {
        shimmer: {
          '0%': { backgroundColor: '#f3f4f6' },
          '100%': { backgroundColor: '#e5e7eb' }
        }
      },
      colors: {
        white: "#ffffff",
        body: "#1e293b",
        "gray-100": "#f3f4f6",
        "gray-200": "#e5e7eb",
        "gray-300": "#d1d5db",
        "gray-400": "#9ca3af",
        "gray-500": "#6b7280",
        "gray-600": "#4b5563",
        "gray-700": "#374151",
        "gray-800": "#1f2937",
        "gray-900": "#111827",

        "primary-50": "#eff6ff",
        "primary-100": "#dbeafe",
        "primary-200": "#bfdbfe",
        "primary-300": "#93c5fd",
        "primary-400": "#60a5fa",
        "primary-500": "#3b82f6",
        "primary-600": "#2563eb",
        "primary-700": "#1d4ed8",
        "primary-800": "#1e40af",
        "primary-900": "#1e3a8a",

        "pgray-50": "#f8fafc",
        "pgray-100": "#f1f5f9",
        "pgray-200": "#e2e8f0",
        "pgray-300": "#cbd5e1",
        "pgray-400": "#94a3b8",
        "pgray-500": "#64748b",
        "pgray-600": "#475569",
        "pgray-700": "#334155",
        "pgray-800": "#1e293b",
        "pgray-900": "#0f172a",
        "ct-blue-dark": "#1c60b8",
        "ct-blue-light": "#3c99dd",
        "ct-footer-bg":"#e7ebed",
        "ct-footer-dark":"#bfc6cb",
        "ct-footer-text":"#3d3d3d",
        "black-light-color": "#505050",
        "light-grey": "#E2E2E2",
        "grey-dark": "#cdced5",
        "blue-dark": "#245DA6"
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0px 2px 4px rgba(148, 163, 184, 0.05), 0px 6px 24px rgba(235, 238, 251, 0.4)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        none: "none",
      },
      fontFamily: {  
            source_serif: ['var(--source_serif_4)'],
            rubik: ['var(--rubik)'],
      },
      fontWeight:{
        bold: 500, 
      },
      fontSize: {
        xs: ".75rem",
        sm: ".875rem",
        tiny: ".875rem",
        base: ".940rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": ["2.25rem", "3.2rem"],
        "5xl": ["3rem", "4rem"],
        "6xl": ["4rem", "1rem"],
        "7xl": ["5rem", "1rem"],
      },
    },
  },
  plugins: [ 
  ],
} 
