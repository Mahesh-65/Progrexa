/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#6366F1",
          600: "#4F46E5",
        },
      },
    },
  },
  plugins: [],
};
