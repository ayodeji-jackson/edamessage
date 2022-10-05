/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "index.html", 
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'custom-orange': 'hsl(23deg 100% 50%)', 
        'custom-orange-100': 'hsl(33deg 100% 59%)',
        'custom-orange-200': 'hsl(26deg 100% 50%)', 
        'custom-orange-300': 'hsl(25deg 100% 49%)', 
        'custom-orange-400': 'hsl(26deg 100% 49%)', 
        'custom-grey-100': 'hsl(0deg 0% 31%)',
        'custom-grey-200': 'hsl(0deg 0% 97%)'
      }, 
      screens: {
        'ms': '320px', 
        'mm': '375px', 
        'ml': '425px',
      }, 
    },
  }
}
