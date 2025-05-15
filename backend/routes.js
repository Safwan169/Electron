const express=require('express')
const router=express.Router()
const AuthRoute=require('./controllers/auth/_route')

router.use('/auth',AuthRoute)



module.exports = router