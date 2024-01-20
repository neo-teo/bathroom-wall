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

export const howLongAgo = (date: Date) => {
    const now = new Date();
    const timeDifference = now.getTime() - date.getTime();
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    if (minutesDifference < 1) {
        return 'just now';
    }

    if (minutesDifference < 60) {
        return `${minutesDifference} ${minutesDifference === 1 ? 'minute' : 'minutes'} ago`;
    }

    if (minutesDifference < 90) {
        return 'about an hour ago';
    }

    const hoursDifference = Math.floor(minutesDifference / 60);
    return `${hoursDifference} hours ago`;
}