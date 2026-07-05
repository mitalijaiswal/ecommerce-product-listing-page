const USD_TO_INR_RATE = 83;

export function formatINR(usdPrice) {
  const inr = usdPrice * USD_TO_INR_RATE;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(inr);
}
