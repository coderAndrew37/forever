import { baseUrl } from "./constants.js";
import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

async function fetchSalesData() {
  try {
    const response = await fetch(`${baseUrl}/api/admin/sales`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to fetch sales data");

    const data = await response.json();
    renderCharts(data);
  } catch (error) {
    console.error("Error fetching sales data:", error);
  }
}

function renderCharts(data) {
  // 📊 Revenue Trends
  new Chart(document.getElementById("revenueChart"), {
    type: "line",
    data: {
      labels: data.months,
      datasets: [
        {
          label: "Revenue (KSH)",
          data: data.revenue,
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          borderColor: "rgba(34, 197, 94, 1)",
          borderWidth: 2,
        },
      ],
    },
  });

  // 📈 Orders Growth
  new Chart(document.getElementById("ordersChart"), {
    type: "bar",
    data: {
      labels: data.months,
      datasets: [
        {
          label: "Orders",
          data: data.orders,
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
        },
      ],
    },
  });

  // 🏆 Top Selling Products
  new Chart(document.getElementById("topProductsChart"), {
    type: "pie",
    data: {
      labels: data.topProducts.map((p) => p.name),
      datasets: [
        {
          data: data.topProducts.map((p) => p.sales),
          backgroundColor: [
            "#f87171",
            "#fb923c",
            "#facc15",
            "#34d399",
            "#60a5fa",
          ],
        },
      ],
    },
  });

  // 📊 Sales by Category
  new Chart(document.getElementById("salesCategoryChart"), {
    type: "doughnut",
    data: {
      labels: data.categories.map((c) => c.name),
      datasets: [
        {
          data: data.categories.map((c) => c.sales),
          backgroundColor: [
            "#ef4444",
            "#f97316",
            "#eab308",
            "#22c55e",
            "#3b82f6",
          ],
        },
      ],
    },
  });
}

// Load Data When Page Loads
document.addEventListener("DOMContentLoaded", fetchSalesData);
