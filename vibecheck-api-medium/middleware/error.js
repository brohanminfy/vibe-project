import errorResponse from '../utils/errorResponse'

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = new errorResponse(message, 400);
    }

    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new errorResponse(message, 400);
    }


    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new errorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

export default errorHandler;