require("dotenv").config()
const signale = require("signale")

const express = require("express")
const app = express()
app.use(express.json())

const routes = require("./startup/routes")
routes(app)

const mongoose = require("mongoose")

mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true })
const db = mongoose.connection
db.on("error", (error) => signale.error(error))
db.once("open", () => signale.success("Connected to MongoDB!"))

const PORT = process.env.PORT
app.listen(PORT, () => {
    signale.info(`Listening on port ${PORT}`)
})