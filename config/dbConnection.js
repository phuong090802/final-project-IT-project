import { connect } from 'mongoose';

const dbConnection = async () => {
    try {
        const con = await connect(process.env.MONGO_URI);
        console.log(`Đã kết nối MongoDB với HOST: ${con.connection.host}`);
    } catch (error) {
        console.error(`Lỗi kết nối MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default dbConnection;