module.exports = {
  content: ["./public/**/*.{html,js}", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff9900", // Custom orange
        dark: "#1a1a1a", // Hero section background
        lightGray: "#ddd",
        accent: "#e0e0e0",
        headerBg: "rgb(19, 25, 33)",
        tooltipBg: "rgba(0, 0, 0, 0.75)",
        cartHighlight: "rgb(240, 136, 4)",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      boxShadow: {
        custom: "0 2px 8px rgba(0, 0, 0, 0.1)",
        hover: "0 4px 12px rgba(0, 0, 0, 0.2)",
      },
      screens: {
        xs: "450px",
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [],
};
