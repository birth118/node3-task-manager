const express = require('express')
require('./db/mongoose')      // Simply to connect to mongoDBdatabase:task-manager-api

const userRouter = require('./routers/user')    // Refer user router
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

const multer = require('multer')
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {         // To define a callback function abot type of file to handle
        // if(!file.originalname.endsWith('.pdf')){
        if(!file.originalname.match(/\.(doc|docx)$/)){       // regex        
            return cb(new Error('File must be a Word doc'))
        }
        cb(undefined, true)

        // cb(new Error('File must be a PDF')) // Error
        // cb(undefined, true)                 // Success
        // cb(undefined, false)                // Not accept - silently

    }
})
app.post('/upload', upload.single('upload'), (req,res)=>{   //'upload' will be used as a key in http body request
    res.send()
})

app.use(express.json())     // http body data will be treated as JSON format
app.use(userRouter)         // Here to activate the user router 
app.use(taskRouter)         // Here to activate the task router 

app.listen(port, ()=>{
    console.log('Server up: ' + port)
})


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const jwt = require('jsonwebtoken')

const myFunction = async () => {
    const token = jwt.sign({_id:'1234'}, 'secret',{ expiresIn:'7 days'})      // signing/encoded by base64
//    console.log(token)

    const payload = jwt.verify(token,'secret')
//   console.log(payload)
}

// myFunction()

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const pet ={
    name: 'Hal',
    age: 6
}

//If an object being stringified (ex, via http ) has a property named toJSON whose value is 
//a function, then the toJSON() method customizes JSON stringification behavior:

// pet.toJSON = function(){
//     console.log(this)
//     delete this.name
//     return this
// }

// console.log(JSON.stringify(pet))

// >>>>>>>>>>>>>>>>>>> Referencial Integrity(RI) >>>>>>>>>>>>>>>>>>>

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () =>{

//     // *RI: task (child)  --> user (parant)
//     // const task  = await Task.findById("5dce44863579b91de0241272")
//     // await task.populate('owner').execPopulate()        // This uses 'owner' field in Task collection that ref 'User'
//     // console.log(task.owner)
    
//     // *RI: user (parent) --> task (child) 
//     try{
//         const user  = await User.findById('5dce42e555d82628dc132ec0')
//         await user.populate('tasks').execPopulate()           // This uses *virtual* 'task' fields in Users collection that ref 'Task'
//         console.log(user.tasks)

//     }catch(e){

//     }
// }


// main()

// >>>>>>>>>>>>>>>>>>>>>> multer multipart: file upload>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>