const express = require('express')
require('./db/mongoose')      // Simply to connect to mongoDBdatabase:task-manager-api

const userRouter = require('./routers/user')    // Refer user router
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())     // http body data will be treated as JSON format
app.use(userRouter)         // Here to activate the user router 
app.use(taskRouter)         // Here to activate the task router 

app.listen(port, ()=>{
    console.log('Server up: ' + port)
})

