export default function catchAsyncErrors(func) {
    console.info('Inside catchAsyncErrors');
    return function (req, res, next) {
        return Promise.resolve(func(req, res, next))
            .catch(next);
    }
}