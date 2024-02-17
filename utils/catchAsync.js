const catchAsync = (func) => {
  const wrappedFunction = (req, res, next) => {
    func(req, res).catch((err) => next(err));
  };
  return wrappedFunction;
};
module.exports = catchAsync;
