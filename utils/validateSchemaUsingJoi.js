const ExpressError = require("./ExpressError");
const { campgroundSchemaJoi, reviewSchemaJoi } = require("../schemasJoi");

//middleware to check schema using Joi
const validateSchemaUsingJoi = (schemaOf) => {
  return async (req, res, next) => {
    let validateSchema;
    if (schemaOf == "Campground") {
      validateSchema = campgroundSchemaJoi;
    } else if (schemaOf == "Review") {
      validateSchema = reviewSchemaJoi;
    }
    const { error } = validateSchema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join(",");
      next(new ExpressError(message, 400));
    } else {
      next();
    }
  };
};

module.exports = validateSchemaUsingJoi;
