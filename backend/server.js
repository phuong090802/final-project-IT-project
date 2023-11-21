import dotenv from 'dotenv';
import dbConnection from './config/dbConnection.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import app from './app.js';


process.on('uncaughtException', err => {
    console.log(`error: ${err.stack}`);
    console.log('Máy chủ bị tắt do Uncaugth exception');
    process.exit(1);
});

dotenv.config();


await dbConnection();

app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
    console.log(`Máy chủ chạy ở cổng: ${process.env.PORT}`);
});

process.on('unhandledRejection', err => {
    console.log(`Lỗi: ${err.stack}`);
    console.log('Máy chủ bị tắt do rejection Unhandle Promise');
    server.close(() => {
        process.exit(1);
    });
});

