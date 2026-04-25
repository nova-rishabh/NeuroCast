/** @type {import('tailwindcss').Config} */ 
export default { 
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], 
  darkMode: 'class', 
  theme: { 
    extend: { 
      colors: { 
        brand: {
          navy: '#1A0B2E',    // Deep navy from the logo text
          indigo: '#4F46E5',  // Bright indigo from the logo icon
          purple: '#7C3AED',
          light: '#F8FAFC',
          white: '#FFFFFF',
          dark: '#0F172A',
          gray: '#64748B',
          border: '#E2E8F0',
        },
        cyan: {
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          800: '#155E75',
          900: '#164E63',
        }
      }, 
      fontFamily: { 
        sans: ['Inter', 'system-ui', 'sans-serif'], 
        mono: ['JetBrains Mono', 'monospace'], 
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(79, 70, 229, 0.3)',
      }
    }, 
  }, 
  plugins: [], 
} 
