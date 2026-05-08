function notFound(req, res, next) {
  const error = new Error('Not Found');
  error.status = 404;
  next(error); 
}

function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;

  const message = statusCode === 404 
    ? 'Resource not found' 
    : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message: message
  });
}

module.exports = { notFound, errorHandler };