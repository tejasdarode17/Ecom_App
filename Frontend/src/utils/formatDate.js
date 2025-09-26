export function formatDate(date, options = {}) {
    if (!date) return "";

    const dateObj = new Date(date);

    if (isNaN(dateObj)) return "Invalid Date";

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...options
    }).format(dateObj);
}