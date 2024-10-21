require('dotenv').config()
const express = require('express')
const adminRoutes = require('./routes/admin')
const libraryRoutes = require('./routes/library')
const studentRoutes = require('./routes/student')
const teacherRoutes = require('./routes/teacher')

// express app
const app = express()

//middleware
app.use(express.json())

app.use((res, req, next) => {
    console.log(req.path, req.method)
    next()
})


//routes
app.use('/api/admin', adminRoutes)
app.use('/api/library', libraryRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/teacher', teacherRoutes)


//listen for requests
app.listen(process.env.PORT, () => {
    console.log("Connected to server")
})



