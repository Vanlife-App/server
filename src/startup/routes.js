const express = require("express")

const users = require("../routes/users")

module.exports = function (app) {
    app.use(express.json())

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "*")
        res.header("Access-Control-Expose-Headers", "auth-token")
        res.header("Access-Control-Allow-Methods", "*")
        next()
    })

    app.use("/", users)
}