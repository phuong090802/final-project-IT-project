export default class ErrorHandler extends Error {
    constructor(status, message, detail, code) {
        super(message);
        this.status = status;
        this.detail = detail;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}