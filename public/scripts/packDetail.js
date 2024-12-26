import { baseUrl } from "./constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const packSlug = params.get("slug");

  if (!packSlug) {
    console.error("Pack slug not found in URL.");
    document.body.innerHTML = "<p>Pack not found.</p>";
    return;
  }

  try {
    const pack = await fetchPackDetails(packSlug);
    if (!pack) throw new Error("Pack not found.");

    renderPackDetails(pack);
  } catch (error) {
    console.error("Error rendering pack details:", error);
    document.body.innerHTML = `<p>Error loading pack details: ${error.message}</p>`;
  }
});

/**
 * Fetches pack details from the API.
 * @param {string} slug - The slug of the pack to fetch.
 * @returns {Promise<Object>} - The pack details.
 */
async function fetchPackDetails(slug) {
  const apiUrl = `${baseUrl}/api/packs/${slug}`;
  console.log("Fetching pack details from:", apiUrl);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    console.error(
      "Error fetching pack details:",
      response.status,
      response.statusText
    );
    throw new Error(`Failed to fetch pack details: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Renders the pack details on the page.
 * @param {Object} pack - The pack details object.
 */
function renderPackDetails(pack) {
  // Update hero section
  const packName = document.getElementById("pack-name");
  const packDescription = document.getElementById("pack-description");

  if (packName) packName.textContent = pack.name;
  if (packDescription) packDescription.textContent = pack.description;

  // Update image and detailed description
  const packImage = document.getElementById("pack-image");
  const detailedDescription = document.getElementById(
    "pack-detailed-description"
  );

  if (packImage) {
    packImage.src = pack.packImage || "/images/default-pack.jpg";
    packImage.alt = pack.name;
  }
  if (detailedDescription) {
    detailedDescription.textContent =
      pack.detailedDescription || "No detailed description available.";
  }

  // Update benefits
  const benefitsList = document.getElementById("benefits-list");
  if (benefitsList) {
    benefitsList.innerHTML = pack.benefits
      .map(
        (benefit) => `
          <li class="flex items-start space-x-3">
            <i class="${benefit.icon} text-yellow-500 text-xl"></i>
            <span>${benefit.benefit}</span>
          </li>
        `
      )
      .join("");
  }

  // Update included products
  const productsList = document.getElementById("products-list");
  if (productsList) {
    productsList.innerHTML = pack.productIds
      .map(
        (product) => `
          <li>
            <div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
              <img
                src="${product.image || "/images/default-product.jpg"}"
                alt="${product.name}"
                class="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 class="text-lg font-bold text-gray-800 mb-2">${
                product.name
              }</h3>
              <p class="text-gray-600 mb-4">${product.description}</p>
              <p class="text-green-600 font-bold text-xl">
                KSH ${(product.priceCents / 100).toLocaleString("en-KE")}
              </p>
              <a
                href="/product-details.html?id=${product._id}"
                class="block mt-4 bg-yellow-500 text-white text-center py-2 rounded-md hover:bg-yellow-600 transition"
              >
                View Product
              </a>
            </div>
          </li>
        `
      )
      .join("");
  }
}
