export function timeConversion(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    const seconds = diffInSeconds;
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const months = Math.floor(diffInSeconds / 2592000);
    const years = Math.floor(diffInSeconds / 31536000);

    if (seconds < 60) {
        return seconds <= 5 ? 'few seconds ago' : `${seconds}s ago`;
    } else if (minutes < 60) {
        return `${minutes}m ago`;  // Exact number of minutes
    } else if (hours < 24) {
        return hours === 1 ? '1h ago' : `${hours}h ago`;  // Exact number of hours
    } else if (days < 30) {
        return days === 1 ? '1d ago' : `${days}d ago`;  // Exact number of days
    } else if (months < 12) {
        return months === 1 ? '1 month ago' : `${months}months ago`;  // Exact number of months
    } else {
        return years === 1 ? '1y ago' : `${years}yrs ago`;  // Exact number of years
    }
}