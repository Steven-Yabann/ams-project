const http = require("http")
const fs = require('fs')

const server = http.createServer((req, res) => {
    console.log(req.url, req.method)

    //set header content type
    res.setHeader('Content-Type', 'text/html')

    res.write('../frontend/src/App.js')
    // res.write('<p>hello, once again</p>')
    res.end()
})


server.listen(5000, 'localhost', () => {
    console.log('Listening for requests on port 5000')
})
