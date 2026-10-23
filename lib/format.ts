const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatEventDate(date: string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date.trim());

    if (!match) {
        return date;
    }

    const month = MONTHS[Number(match[2]) - 1];

    if (!month) {
        return date;
    }

    return `${Number(match[3])} ${month} ${match[1]}`;
}

export function formatEventTime(time: string) {
    const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());

    if (!match) {
        return time;
    }

    let hours = Number(match[1]);
    const minutes = match[2];
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
}
