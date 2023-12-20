export default function catchAsyncErrors(func) {
    return function (req, res, next) {
        return Promise.resolve(func(req, res, next))
            .catch(next);
    }
}