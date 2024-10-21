const express = require('express')
const morgan = require('morgan')
const app = express()

app.listen(5000)

app.use(morgan('tiny'))

app.get('/', (req, res) => {
    res.send('<p>Hello world</p>')
})


