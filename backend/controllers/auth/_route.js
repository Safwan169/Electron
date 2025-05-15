const express =require('express')
const login = require('./login')
const register = require('./register')
const  google  = require('./google')
const router=express.Router()
router.post('/login',login)

router.post('/register',register)
router.get('/google', google );


module.exports = router