import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20).required(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('personal', 'home').required(),
});

const dataToValidate = {
  name: 'John Doe',
  phoneNumber: '+380000000005',
  email: 'john.doe@example.com',
  isFavourite: false,
  contactType: 'home',
};

const validationResult = createContactSchema.validate(dataToValidate, {
  abortEarly: false,
});
if (validationResult.error) {
  console.log(validationResult.error.message);
} else {
  console.log('Data is valid!');
}

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.number().min(6).max(18),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('personal', 'home'),
});
