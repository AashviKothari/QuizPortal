const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const db = require("./config/dbConfig")
const userRoute = require("./routes/userRoutes")
const examRoute = require("./routes/examRoutes")
const reportRoute = require("./routes/reportRoutes")

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use("/api/users",userRoute)
app.use("/api/exams",examRoute)
app.use("/api/reports",reportRoute)

app.listen(PORT,()=>{
    console.log(`Server is running on PORT: ${PORT}`)
})

