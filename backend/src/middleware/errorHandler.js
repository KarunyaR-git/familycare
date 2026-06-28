function errorHandler(error, req, res, next) {
    const statusCode = error.statusCode || 500;

    if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(400).send('Invalid data');
    }
    return res.status(statusCode).send(error.message || 'Something went wrong')

}

module.exports = errorHandler;