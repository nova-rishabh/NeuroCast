export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          violet: '#6366F1',
          purple: '#818CF8',
          cyan: '#22D3EE',
          amber: '#F59E0B',
          red: '#EF4444',
          teal: '#2DD4BF',
        },
        dark: {
          primary: '#03040A',
          secondary: '#0D0F1C',
          card: '#111327',
        }
      },
      animation: {
        'shimmer': 'shimmer 4s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '60px 60px',
      }
    },
  },
  plugins: [],
}