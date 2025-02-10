const isProduction = window.location.hostname !== "localhost";
export const baseUrl = isProduction
<<<<<<< HEAD
  ? "https://forever-1-3cbm.onrender.com"
=======
  ? "https://forever-tau.vercel.app"
>>>>>>> cfd292623decfa019c4565f110864eda0c817787
  : "http://localhost:5000";
