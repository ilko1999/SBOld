/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    patterns: {
      opacities: {
          100: "1",
          80: ".80",
          60: ".60",
          40: ".40",
          20: ".20",
          10: ".10",
          5: ".05",
      },
      sizes: {
          1: "0.25rem",
          2: "0.5rem",
          4: "1rem",
          6: "1.5rem",
          8: "2rem",
          16: "4rem",
          20: "5rem",
          24: "6rem",
          32: "8rem",
      }
  },
    extend: {
      colors: {
        'primary-white': "#F5F5F4",
        'primary-orange': '#FF570A',
        'primary-orange-opacity-50': '#FF570A80',
        'primary-orange-opacity-20': '#FF570A33',
        'primary-orange-opacity-10': 'rgb(255, 87, 10, 0.15)',
        'primary-purple': '#1B0E33',
        'primary-purple-opacity-5': '#1B0E330D',
        'primary-purple-opacity-80': '#1B0E33CC',
        'primary-purple-opacity-15': '#1B0E3326',
        'primary-purple-opacity-50': '#1B0E3380',
        'primary-purple-opacity-70': '#1B0E33B2',
        'primary-purple-opacity-30': '#1B0E334D',
        'primary-purple-opacity-20': '#D1CFD6',
        'primary-purple-opacity-60': '#1B0E3399',
        'primary-purple-opacity-40': '#1B0E3366',
        'primary-gray': '#D9D9D973',
        'primary-gray-opacity-80': '#D9D9D9CC',
        'primary-gray-opacity-50': '#d9d9d980',
        'primary-gray-opacity-45': '#D9D9D973',
        'primary-gray-opacity-40': 'rgb(217, 217, 217, 0.4)',
        'primary-red-opacity-80': '#EF4444CC',
        'primary-red-opacity-50': '#F8717180',
        'primary-red-opacity-20': '#F8717133',
        'primary-error': '#DC2626',
        'primary-orange-complementary-1': '#F8B89E',
        'primary-orange-complementary-2': '#FFE7D5',
        'primary-orange-complementary-3': '#9FA8DF',
      },

      fontFamily: {
        Lexend: 'Lexend, sans-serif',
        Work_Sans: 'Work Sans, sans-serif',
      },
      borderWidth: {
        6: '6px',
      },
      spacing: {
        '10px': '10px',
      },
      height: {
        680: '680px',
      },
      maxHeight: {
        128: '32rem',
        156: '40rem',
        184: '50rem',
      },
      width: {
        47: '47.4%',
        46: '46%',
        45: '45.4%',
        44: '44%',
        40: '40.3%',
        42: '42.5%',
      },
      minWidth: {
        450: '450px',
      },
      screens: {
        xs: { min: '300px', max: '639px' },
        sm: { min: '640px', max: '767px' },
        // => @media (min-width: 640px and max-width: 767px) { ... }

        md: { min: '768px', max: '1023px' },
        // => @media (min-width: 768px and max-width: 1023px) { ... }

        lg: { min: '1024px', max: '1279px' },
        // => @media (min-width: 1024px and max-width: 1279px) { ... }

        xl: { min: '1280px', max: '1535px' },
        // => @media (min-width: 1280px and max-width: 1535px) { ... }

        '2xl': { min: '1536px' },
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('tailwindcss-bg-patterns')
  ],

};
