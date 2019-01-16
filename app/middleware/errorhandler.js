/* eslint-disable */
export default function errorHandler(err, req, res, next) {
/* eslint-enable */
  if (!err) {
    return res.sendStatus(500);
  }

  const error = {
    message: err.message || 'Internal Server Error.',
  };

  if (err.errors) {
    error.errors = {};
    const { errors } = err;
    Object.keys(errors).map((type) => {
      error.errors[type] = errors[type].message;
      return error;
    });
  }
  return res.status(err.status || 500).json(error);
}
