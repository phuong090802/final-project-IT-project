import { format, parseISO } from 'date-fns';
import vi from 'date-fns/locale/vi/index.js';

export default function formatVietnameseDate(date) {
    const parsedDate = parseISO(date);

    const dayOfWeek = format(parsedDate, 'EEEE', { locale: vi });

    const time = format(parsedDate, 'HH:mm');

    const formattedDate = format(parsedDate, "'Ngày' dd-MM-yyyy");

    const finalFormattedDate = `${time} - ${dayOfWeek}-${formattedDate}`;

    return finalFormattedDate;
}