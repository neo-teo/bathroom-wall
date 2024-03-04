import moment from "moment-timezone";

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

    let formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    // if more than 24 hours ago, just return HH:MM AM/PM
    return formattedTime
}

export const dateToTimeGroup = (ogDate: Date, timezone?: string) => {
    let date = timezone ? moment.tz(ogDate, timezone) : moment(ogDate);

    // Check if the time is before 6 AM and subtract a day if necessary
    if (date.hour() < 6) {
        date.subtract(1, 'days');
    }

    // Format the date as MM-DD-YYYY in the specified time zone
    return date.format('MM-DD-YYYY');
}

export const timeGroupToDisplayDate = (timeGroup: string) => {
    return moment(timeGroup, 'MM-DD-YYYY').format('MMMM D, YYYY')
}