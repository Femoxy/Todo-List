const joi = require("@hapi/joi");

const userValidation = (data) => {
    try {
        const validateUser = joi.object({
            username: joi.string().trim().required().min(3).max(30)
              .regex(/^[/^[a-zA-Z0-9]+$/).messages({
                'string.empty': 'username cannot be empty',
                'string.min': 'Minimum 3 characters required',
                'any.pattern.base': 'username should only contain letters and numbers',
                'any.required': 'username is required'
              }),
            email: joi.string().email({ tlds: { allow: false } }).required().trim().messages({
              'string.empty': 'Email cannot be empty',
              'any.required': 'Email is required',
            }),
            password: joi.string().required().min(6)
            .regex(/^[A-Za-z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/).messages({
              'string.empty': 'Password cannot be empty',
              'string.min': 'Minimum 6 characters required',
              'any.pattern.base': 'Password should contain letters, numbers, and special characters',
              'any.required': 'Password is required',
            }),
        
          })
          return  validateUser.validate(data);

    } catch (error) {
        message: "validator error: " +error.message
        
    }
}

const validateLogin = (data) => {
    const validateUserlogin = joi.object({
        email: joi.string().email({ tlds: { allow: false } }).required().trim().messages({
            'string.empty': 'email cannot be empty',
            'any.required': 'Email is required',
          }),
        password: joi.string().required().min(6)
        .pattern(new RegExp(/^[A-Za-z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/)).messages({
            'string.empty': 'Password cannot be empty',
            'string.min': 'Minimum 6 characters required',
            'any.pattern.base': 'Password should contain letters, numbers, and special characters',
            'any.required': 'Password is required',
          }),
      

    })
    return validateUserlogin.validate(data);
};



module.exports = {
    userValidation, 
    validateLogin

};