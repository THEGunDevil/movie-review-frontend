export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price)
}

export const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`
}

export const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
        return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
        return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
        return `$${(marketCap / 1e6).toFixed(2)}M`
    }
    return `$${marketCap.toLocaleString()}`
}
export const getDateTimestamp = (dateStr: string | undefined | null): number => {
  if (!dateStr) return 0;
  const ts = new Date(dateStr).getTime();
  return isNaN(ts) ? 0 : ts;
};

export function formatDate(value: string | null | undefined) {
    if (!value) {
        return "Unknown date";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
