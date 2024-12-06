const isProduction = window.location.hostname !== "localhost";
export const baseUrl = isProduction
  ? "https://forever-svro.onrender.com/"
  : "http://localhost:5000";
