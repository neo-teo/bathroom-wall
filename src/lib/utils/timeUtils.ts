export const today = () => {

    const date = new Date(); // Current date and time

    const estDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return estDate;
}

export const twentyFourAgo = () => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Subtract 24 hours in milliseconds

    return twentyFourHoursAgo;
}

export const nearestPast7Am = () => {
    const date = new Date();

    // If it's before 7 AM, subtract a day to get to yesterday
    if (date.getHours() < 7) {
        date.setDate(date.getDate() - 1);
    }

    return date.setHours(7, 0, 0, 0);
}

export const howLongAgo = (date: Date) => {
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

    let formattedDate = date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
    });
    let formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    // if more than 24 hours ago, just return HH:MM AM/PM
    return `${formattedDate} ${formattedTime}`
}