require('dotenv').config()
const express = require('express')
const adminRoutes = require('./routes/admin')
const libraryRoutes = require('./routes/library')
const studentRoutes = require('./routes/student')
const teacherRoutes = require('./routes/teacher')

// express app
const app = express()

//middleware
app.use((res, req, next) => {
    console.log(req.path, req.method)
    next()
})


//routes


//listen for requests
app.listen(process.env.PORT, () => {
    console.log("Connected to server")
})



