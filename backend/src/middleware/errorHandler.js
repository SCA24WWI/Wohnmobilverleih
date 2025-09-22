class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Entwicklungsumgebung: Sende detaillierte Fehlerinformationen
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } 
    // Produktionsumgebung: Sende nur grundlegende Fehlerinformationen
    else {
        // Operationelle, vertrauenswürdige Fehler
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } 
        // Programmierfehler: keine Details nach außen geben
        else {
            console.error('ERROR 💥', err);
            res.status(500).json({
                status: 'error',
                message: 'Etwas ist schiefgelaufen!'
            });
        }
    }
};

// Middleware für nicht gefundene Routen
const notFound = (req, res, next) => {
    const error = new AppError(`Route ${req.originalUrl} nicht gefunden`, 404);
    next(error);
};

module.exports = {
    AppError,
    errorHandler,
    notFound
};