const router = require("express").Router()
const User = require("../models/user")

const auth = require("../middleware/auth")
const erCatch = require("../middleware/erCatch")
const resetPassword = require("../middleware/resetPassword")

const generateResetToken = require("../services/generateResetToken")
const sendEmail = require("../services/sendEmail")

const { validateRegister, validateLogin, validateEmail } = require("../validation/userValidation")
const bcrypt = require("bcryptjs")

require("dotenv").config()

router.post("/register", erCatch(async (req, res) => {
    const { error } = validateRegister(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    
    const emailExists = await User.findOne({ email: user.email })
    if (emailExists) return res.status(400).json({ error: "Email already in use" })

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT))
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()

    const token = user.generateAuthToken()
    return res.status(200).json({ token: token })
}))

router.post("/login", erCatch(async (req, res) => {
    const { error } = validateLogin(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json({ error: "Invalid email" })

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).json({ error: "Invalid password" })

    const token = user.generateAuthToken()
    return res.status(200).json({ token: token })
}))

router.delete("/delete", auth, erCatch(async (req, res) => {
    const user = await User.findOneAndDelete({ email: req.body.email }).select("-_id -password -__v")
    if (!user) return res.status(404).json()({ error: "User not found" })

    res.status(200).send("User deleted")
}))

router.post("/reset_request", erCatch(async (req, res) => {
    const { error } = validateEmail(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json({ error: "Failed to send mail" })

    const resetToken = generateResetToken(req.body.email)
    const link = `${process.env.SITE_URL}/reset?token=${resetToken}`

    sendEmail(req.body.email, link, function (data) {
        if (!data.success) return res.status(200).json({ error: "Failed to send mail" })

        res.status(200).send()
    })
}))

router.put('/reset', [auth, resetPassword], erCatch(async (req, res) => {
    const { error } = validatePassword(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const user = await User.findOne({ email: req["user"].email })
    if (!user) return res.status(404).json({ error: "Email not found." })

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT))
    user.password = await bcrypt.hash(req.body.password, salt)

    await User.findOneAndUpdate({ email: user.email },
        {
            name: user.name,
            email: user.email,
            password: user.password
        },
        { new: true })

    res.status(200).send("Password updated")
}))

router.get("/users", auth, erCatch(async (req, res) => {
    res.status(200).send()
}))

module.exports = router