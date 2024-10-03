/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      boxShadow: {
        'up': '0px 0px 20px rgba(0, 0, 0, 0.2)',
        'down-right': '4px 4px 10px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}

