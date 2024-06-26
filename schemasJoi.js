const Joi = require("joi");

const campgroundSchemaJoi = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().required(),
        fileName: Joi.string().required(),
      })
    ),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array()
});

const reviewSchemaJoi = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});

module.exports = {
  campgroundSchemaJoi,
  reviewSchemaJoi,
};
