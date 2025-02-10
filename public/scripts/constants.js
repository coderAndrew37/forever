const isProduction = window.location.hostname !== "localhost";
export const baseUrl = isProduction
  ? "https://forever-tau.vercel.app"
  : "http://localhost:5000";
