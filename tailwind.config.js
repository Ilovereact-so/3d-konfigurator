/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Poppins': ['Poppins', 'sans-serif'],
      },
      dropShadow: {
        'cartoon': '0px 8px 0px #f3f3f3',
        'cartoonB': '0px 8px 0px #5e5e5e',
        'bottomRight': '-20px -12px 4px #CECFD0',
      },
      screens: {
        'ss': '450px',
        '01ss': "545px",
        'mm': '650px',
        'll': '825px',
        '1ll': '1024px',
        '1xl': '1420px',
        '01xl':'1360px',
        '3xl':'1600px',
        // orginal screens:
        'a1':"900px",
        'a2':"385px"


        // => @media (min-width: 640px) { ... }
      },
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        heading: "var(--color-heading)",
        text: "var(--color-text)",
        background: "var(--color-background)",
      }
    },
  },
  plugins: [],
}

