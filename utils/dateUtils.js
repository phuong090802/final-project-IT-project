import { format, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export default function formatVietnameseDate(date) {
    const parsedDate = parseISO(date);

    const vnTime = utcToZonedTime(parsedDate, 'Asia/Ho_Chi_Minh');


    const time = format(vnTime, 'HH:mm', { timeZone: 'Asia/Ho_Chi_Minh' });


    const formattedDate = format(vnTime, "'ngày' dd-MM-yyyy", { timeZone: 'Asia/Ho_Chi_Minh' });

    const finalFormattedDate = `${time} - ${formattedDate}`;

    return finalFormattedDate;
}