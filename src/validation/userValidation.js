const Joi = require("joi")

const validateRegister = request => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    })
    return schema.validate(request)
}

const validateLogin = user => {
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    })
    return schema.validate(user)
}

const validateEmail = email => {
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).required().email()
    })
    return schema.validate(email)
}

const validatePassword = password => {
    const schema = Joi.object({
        password: Joi.string().min(8).max(255).required()
    })
    return schema.validate(password)
}

module.exports = {
    validateRegister,
    validateLogin,
    validateEmail,
    validatePassword
}