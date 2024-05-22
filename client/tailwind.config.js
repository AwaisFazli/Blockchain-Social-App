module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        embossed:
          "inset 0 1px 3px rgba(255, 255, 255, 0.1), inset 0 -1px 3px rgba(0, 0, 0, 0.7)",
      },
      colors: {
        darkGray: "#232429",
        primaryGray: "#222328",
        secondaryGray: "#292A2F",
        lightGray: "#34343C",
        primaryBlue: "#1481B9",
        secondaryBlue: "#1FCEC7",
      },
    },
  },
  plugins: [],
};
