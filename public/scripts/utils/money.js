export function formatCurrency(priceCents) {
  return `KSH ${(priceCents / 100).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
