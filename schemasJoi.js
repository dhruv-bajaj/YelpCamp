const Joi = require("joi");

const campgroundSchemaJoi = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

const reviewSchemaJoi = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(0).max(5),
  }).required(),
});

module.exports = {
  campgroundSchemaJoi,
  reviewSchemaJoi,
};
