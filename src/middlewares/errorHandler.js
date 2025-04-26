const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // Si ya se envió respuesta, delega al siguiente middleware
  }
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ status: 'error', statusCode, message });
};

module.exports = errorHandler;
