export function getCurrentTimestamp() {
    const now = new Date();

    // Array of days and months for formatting
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Get the day, month, hours, and minutes
    const day = days[now.getDay()]; // Day of the week
    const date = now.getDate(); // Day of the month
    const month = months[now.getMonth()]; // Month
    let hours = now.getHours(); // Hours (24-hour format)
    let minutes = now.getMinutes(); // Minutes

    // Convert time to 12-hour format
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle 0 hours (midnight)

    // Ensure minutes are always two digits
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Format the timestamp as 'Tue 9:47 AM'
    return `${day} ${hours}:${minutes} ${period}`;
}
