const express = require('express')
const Student = require("../models/studentModel")

const router = express.Router()

router.post('/', async(req, res) => {
    console.log(req.body)
})

module.exports = router
