import { format, parseISO } from 'date-fns';

export default function formatVietnameseDate(date) {
    const parsedDate = parseISO(date);

    const time = format(parsedDate, 'HH:mm');

    const formattedDate = format(parsedDate, "'ngày' dd-MM-yyyy");

    const finalFormattedDate = `${time} - ${formattedDate}`;

    return finalFormattedDate;
}