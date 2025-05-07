const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
  console.error(err.stack);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
