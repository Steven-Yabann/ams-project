const http = require("http")
const fs = require('fs')

const server = http.createServer((req, res) => {
    console.log(req.url, req.method)

    //set header content type
    res.setHeader('Content-Type', 'text/html')

    res.write('<p>hello, ninjas</p>')
    res.write('<p>hello, once again</p>')
    res.end()
})


server.listen(3000, 'localhost', () => {
    console.log('Listening for requests on port 3000')
})
