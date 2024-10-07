/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      boxShadow: {
        up: "0px 0px 20px rgba(0, 0, 0, 0.2)",
      },
      backgroundColor: {
        one: "#4a7766",
        acent: "#007e77",
        details: "#1275a7"
      },
      textColor: {
        light: "#ece7e2",
        details: "#1275a7"
      },
    },
  },
  plugins: [],
};
