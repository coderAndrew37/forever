import { baseUrl } from "./constants.js";
import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

let salesChart, categoryChart, salesTrendChart;

// ✅ Fetch & Render Sales Data
async function fetchSalesData(startDate = "", endDate = "") {
  try {
    let url = `${baseUrl}/api/admin/sales?startDate=${startDate}&endDate=${endDate}`;
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) throw new Error("Failed to fetch sales data");

    const data = await response.json();
    renderCharts(data);
  } catch (error) {
    console.error("Error fetching sales data:", error);
  }
}

// ✅ Render Sales Charts
function renderCharts(data) {
  const ctx1 = document.getElementById("salesChart").getContext("2d");
  const ctx2 = document.getElementById("categoryChart").getContext("2d");

  if (salesChart) salesChart.destroy();
  if (categoryChart) categoryChart.destroy();

  salesChart = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: data.months,
      datasets: [
        {
          label: "Revenue (KSH)",
          data: data.revenue,
          backgroundColor: "#4CAF50",
        },
        {
          label: "Orders",
          data: data.orders,
          backgroundColor: "#2196F3",
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });

  categoryChart = new Chart(ctx2, {
    type: "pie",
    data: {
      labels: data.categories.map((c) => c.name),
      datasets: [
        {
          data: data.categories.map((c) => c.sales),
          backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50"],
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
}

// ✅ Fetch & Render Orders Trend Data
async function fetchOrdersTrend() {
  try {
    const response = await fetch(`${baseUrl}/api/admin/stats/orders-trend`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch orders trend");

    const data = await response.json();
    renderOrdersTrendChart(data);
  } catch (error) {
    console.error("Error fetching orders trend:", error);
  }
}

function renderOrdersTrendChart(data) {
  const ctx = document.getElementById("ordersTrendChart").getContext("2d");
  if (salesTrendChart) salesTrendChart.destroy();

  salesTrendChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((d) => d._id),
      datasets: [
        {
          label: "Revenue (KSH)",
          data: data.map((d) => d.totalRevenue / 100),
          borderColor: "#4CAF50",
          fill: false,
        },
        {
          label: "Orders",
          data: data.map((d) => d.totalOrders),
          borderColor: "#2196F3",
          fill: false,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
}

// ✅ Attach Date Filter Events
document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const days = button.dataset.range;
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    fetchSalesData(startDate.toISOString().split("T")[0], endDate);
  });
});

document.getElementById("customFilterBtn").addEventListener("click", () => {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  if (startDate && endDate) fetchSalesData(startDate, endDate);
});

// ✅ Fetch & Render Top Selling Products
async function fetchTopProducts() {
  try {
    const response = await fetch(`${baseUrl}/api/admin/stats/top-products`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch top products");

    const data = await response.json();
    renderTopProducts(data);
  } catch (error) {
    console.error("Error fetching top products:", error);
  }
}

function renderTopProducts(data) {
  const list = document.getElementById("topProductsList");
  list.innerHTML = data
    .map((p) => `<li>${p.name} - Sold: ${p.totalSold}</li>`)
    .join(" ");
}

// ✅ Fetch & Render Customer Insights
async function fetchCustomerInsights() {
  try {
    const response = await fetch(`${baseUrl}/api/admin/stats/customers`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch customer insights");

    const data = await response.json();
    document.getElementById("newCustomers").textContent = data.newCustomers;
    document.getElementById("returningCustomers").textContent =
      data.returningCustomers;
  } catch (error) {
    console.error("Error fetching customer insights:", error);
  }
}

// ✅ Initial Data Load (Last 30 Days by default)
document.addEventListener("DOMContentLoaded", () => {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  fetchSalesData(startDate.toISOString().split("T")[0], endDate);
  fetchOrdersTrend();
  fetchTopProducts();
  fetchCustomerInsights();
});
