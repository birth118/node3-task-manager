const express = require('express')
require('./db/mongoose')      // Simply to connect to mongoDBdatabase:task-manager-api
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())     // http body data will be treated as JSON format




// app.post('/users', (req, res)=>{        // Create a user
//     const user = new User(req.body)
//     user.save().then((result)=>{
//         res.status(201).send(user)
//     }).catch((err)=>{
//         res.status(400).send(err)     // 400: Bad request
//     })
// })


app.post('/users', async (req, res)=>{        // Create a user. Same as above, but with async/awai
    const user = new User(req.body)
    try{
         await user.save()
         res.status(201).send(user)
    }catch(err){
         res.status(400).send(err)     // 400: Bad request such as validation error
    }
})


// app.get('/users', (req, res)=>{         // Retrieve all users
//     User.find({}).then((users)=>{
//         res.status.send(users)
//     }).catch((err)=>{
//         res.status(500).send()
//     })
// })


app.get('/users', async (req, res)=>{         // Retrieve all users. Same as above, but with async/awai
    try{
        const users = await User.find({})
        res.status(200).send(users)
    }catch(e){
        res.status(500).send()
    }    
})


// app.get('/users/:id', (req, res)=>{     // Retrieve a user

//     const _id  = req.params.id
//     User.findById(_id).then((user)=>{
//         if(!user){
//             return res.status(404).send()   //404 Not Found
//         }
//         res.send(user)
//     }).catch((err)=>{
//         res.status(500).send()   // 500 Internal Server Error
//     }) 
// })                       

app.get('/users/:id', async (req, res)=>{     // Retrieve a user. Same as above, but with async/awai
    const _id  = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()   //404 Not Found, *Why doesn't my 404 error work?* Answer below
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)   // 500 Internal Server Error
    }
})                       

// *Why doesn't my 404 error work ?*
// Hi Michael,
// It's just a fluke that Andrew did not get 500. The findById method will throw an error 
// if the id you pass it is improperly formatted so you should see a 500 error most of the time. 
// However, if you pass in an id that is validly formatted, but does not exist 
// in the database then you will get the 404 sent back

app.patch('/user/:id', async (req,res)=>{                   // Update a user by ID
    const updates  = Object.keys(req.body)
    const allowed = [ 'name','age', 'email', 'password']
    const isValidOperation = updates.every((update)=>{      // req.body should include all fields to be updated.
        return allowed.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({Error: 'Invalid updates!'})
    }

    try{
        const user = await User.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true})
        if(!user){
            return res.status(404).send()   // Not found
        }
        res.send(user)          // OK
    }catch(e){
        res.status(400).send(e)    // Validation failed such as validation error
    }
})


app.delete('/users/:id',async (req, res)=>{       // Delete a user
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()   // Not found
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)    // 500 Internal Server Error
    }
})    

// app.post('/tasks' ,(req,res)=>{             // Creat a task
//     const task = new Task(req.body)
//     task.save().then((result)=>{
//         res.status(201).send(task)
//     }).catch((err)=>{
//         res.status(400).send(err)   // 400: Bad request
//     })

// })

app.post('/tasks' , async (req,res)=>{          // Creat a task. Same as above but using async/await 
    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    }catch(err){
        res.status(400).send(err)   // 400: Bad request
    }

})

// app.get('/tasks', (req, res)=>{             // Retrieve all tasks
//     Task.find({}).then((tasks)=>{
//         if(tasks.length<1   ){
//             return res.status(404).send()    // 404 Not Found
//         }
//         res.send(tasks)
//     }).catch((err)=>{
//         res.status(500).send()
//     })
// })


app.get('/tasks', async (req, res)=>{             // Retrieve all tasks. Same as above but using async/await

    try{
        const tasks = await Task.find({})
        if(tasks.length<1   ){
                return res.status(404).send()    // 404 Not Found
        }
        res.send(tasks)
    }catch(e){
        res.status(500).send()
    }
})

// app.get('/tasks/:id', (req, res)=>{           // Retrieve a task
//     const _id = req.params.id
//     Task.findById(_id).then((task)=>{
//         if(!task){
//             return res.status(404).send()
//         }
//         res.send(task)
//     }).catch((err)=>{
//         res.status(500).send(err)
//     })
// })

app.get('/tasks/:id', async (req, res)=>{           // Retrieve a task. Same as above but using asyn/await
    const _id = req.params.id

    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

app.patch('/tasks/:id', async (req, res)=>{              // Update a task by ID
    const allowed = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update)=>allowed.includes(update))
    if(!isValid){
        return res.status(404).send({Error: 'Invalid updates!'}) // 400 Bad Request such as unknown field update 
    }
    
    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task){
            return res.status(404).send()         //404 Not Found
        }
        res.send(task)                            // OK
    }catch(e){
        return res.status(400).send()             // 400 Bad Request such as invalid update data
    }
})         

app.delete('/tasks/:id', async (req, res)=>{          // Delete a task
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()       //404 Not Found
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)                 // 500 Internal Server Error
    }
})

app.listen(port, ()=>{
    console.log('Server up: ' + port)
})

