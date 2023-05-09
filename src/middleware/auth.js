const jwt = require("jsonwebtoken")
const signale = require("signale")

module.exports = function (req, res, next) {
    const token = req.header("auth-token")
    if (!token) return res.status(401).json("Access Denied")

    try {
        signale.info(token)
        const verified = jwt.verify(token, process.env.JWT_TOKEN)
        req.user = verified
        next()
    } catch (err) {
        signale.error(err)
        res.status(400).json("Invalid Token")
    }
}