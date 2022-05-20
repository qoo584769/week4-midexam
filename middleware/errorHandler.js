const handleErrorAsync = (fun) => {
  return (req, res, next) => {
    fun(req, res, next).catch((error) => {
      return next(error);
    });
  };
};

module.exports = handleErrorAsync;
