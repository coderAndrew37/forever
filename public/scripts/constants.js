const isProduction = window.location.hostname !== "localhost";
export const baseUrl = isProduction
  ? "https://forever-1-3cbm.onrender.com"
  : "http://localhost:5000";
