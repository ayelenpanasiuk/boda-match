/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        wine:  { DEFAULT: '#6B1530', dark: '#4A0D20', light: '#8B1D3F' },
        gold:  { DEFAULT: '#C9A96E', light: '#E8D5A3' },
        pearl: '#FAF7F4',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        script:  ['"Dancing Script"', 'cursive'],
      },
      keyframes: {
        floatUp:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        popIn:     { '0%': { opacity: 0, transform: 'scale(0.7)' }, '70%': { transform: 'scale(1.08)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        confettiFall: { '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: 1 }, '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: 0 } },
        particleRise: { '0%': { transform: 'translateY(0) rotate(0deg)', opacity: 0 }, '10%': { opacity: 0.4 }, '90%': { opacity: 0.4 }, '100%': { transform: 'translateY(-105vh) rotate(360deg)', opacity: 0 } },
      },
      animation: {
        float:    'floatUp 3.5s ease-in-out infinite',
        slideUp:  'slideUp 0.4s ease-out both',
        popIn:    'popIn 0.45s cubic-bezier(0.175,0.885,0.32,1.275) both',
        fadeIn:   'fadeIn 0.3s ease-out both',
        confetti: 'confettiFall linear forwards',
        particle: 'particleRise linear infinite',
      },
    },
  },
  plugins: [],
}
