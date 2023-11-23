import formatVietnameseDate from './dateUtils.js';

export default function handleFormatVietnameseDateTopic(topic) {
    const format = 'HH:mm - EEEE-dd-MM-yyyy';
    
    const beginAtDate = topic.createdAt.toJSON();
    const endAtDate = topic.updatedAt.toJSON();

    const createdAtDate = topic.createdAt.toJSON();
    const updatedAtDate = topic.updatedAt.toJSON();
    
    const createdAt = formatVietnameseDate(createdAtDate, format);
    const updatedAt = formatVietnameseDate(updatedAtDate, format);
    
    const beginAt = formatVietnameseDate(beginAtDate, format);
    const endAt = formatVietnameseDate(endAtDate, format);
    
    return { beginAt, endAt, createdAt, updatedAt };
}