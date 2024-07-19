export const howLongAgo = (date: Date, timezone?: string) => {
    const now = new Date();
    const timeDifference = now.getTime() - date.getTime();
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(minutesDifference / 60);

    if (minutesDifference < 1) {
        return 'just now';
    }

    if (minutesDifference < 60) {
        return `${minutesDifference} ${minutesDifference === 1 ? 'minute' : 'minutes'} ago`;
    }

    if (minutesDifference < 90) {
        return 'about an hour ago';
    }

    if (hoursDifference < 24) {
        return `${hoursDifference} hours ago`;
    }

    let formattedTime = `${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: timezone
    })} / ${date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        timeZone: timezone
    })}`;

    // if more than 24 hours ago, just return HH:MM AM/PM
    return formattedTime
}