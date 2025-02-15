import { baseUrl } from "./constants.js";
import { showToast } from "./utils/toast.js";

// ✅ Check Admin Authentication
async function checkAdminAccess() {
  try {
    const response = await fetch(`${baseUrl}/api/users/profile`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Unauthorized");

    const user = await response.json();
    if (!user.isAdmin) throw new Error("Not an admin");

    return true;
  } catch (error) {
    console.error("Admin access denied:", error);
    window.location.href = "/login.html"; // Redirect non-admins
    return false;
  }
}

// ✅ Fetch Dashboard Stats
async function fetchAdminStats() {
  try {
    const response = await fetch(`${baseUrl}/api/admin/stats`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to fetch stats");

    const { totalOrders, totalRevenue, pendingTestimonials, totalUsers } =
      await response.json();

    document.getElementById("totalOrders").textContent = totalOrders;
    document.getElementById(
      "totalRevenue"
    ).textContent = `KSH ${totalRevenue.toLocaleString()}`;
    document.getElementById("pendingTestimonials").textContent =
      pendingTestimonials;
    document.getElementById("totalUsers").textContent = totalUsers;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    showToast("Failed to load stats", "error");
  }
}

// ✅ Initialize Admin Panel
document.addEventListener("DOMContentLoaded", async () => {
  const isAdmin = await checkAdminAccess();
  if (isAdmin) fetchAdminStats();
});
