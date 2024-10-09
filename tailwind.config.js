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
        acent: "#2f4858",
        details: "#1275a7",
        light: "#fff",
      },
      textColor: {
        light: "#fff",
        details: "#1275a7",
        one: "#4a7766",
        acent: "#2f4858",
      },
      borderColor: {
        one: "#4a7766",
        acent: "#2f4858",
        details: "#1275a7",
        light: "#fff",
      },

    },
  },
  plugins: [],
};
