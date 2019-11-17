const express = require('express')
const router = new express.Router()

const Task = require('../models/task')
const auth = require('../middleware/auth')

// app.post('/tasks' ,(req,res)=>{             // Creat a task
//     const task = new Task(req.body)
//     task.save().then((result)=>{
//         res.status(201).send(task)
//     }).catch((err)=>{
//         res.status(400).send(err)   // 400: Bad request
//     })

// })

router.post('/tasks', auth, async (req,res)=>{          // Creat a task. Same as above but using async/await 
    const task = new Task({
        ...req.body, 
        owner: req.user._id
    })
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

//GET /tasks
//GET /tasks?completed=true
//GET /tasks?completed=non_true (false)
//GET /tasks?limit=10&skip=10    --> For pagination
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res)=>{             // Retrieve all tasks. Same as above but using async/await

    try{
        // const tasks = await Task.find({owner:req.user._id})
        const match = {}
        const sort ={}

        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc'?-1:1
            console.log(sort)
        }

        await req.user.populate({
            path: 'tasks',              // 'path' property is treated a column named 'tasks' ref to Task model
            match: match,               // 'match' property is treated as condition 
            options: {                  //  'options' property mongoose built-in options   
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort:sort             
            }
        }).execPopulate()

        const tasks = req.user.tasks

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

router.get('/tasks/:id', auth, async (req, res)=>{           // Retrieve a task. Same as above but using asyn/await
    const _id = req.params.id
 //   console.log(req.user)

    try{
         //const task = await Task.findById(_id)      
        const task = await Task.findOne({_id, owner:req.user._id})   //To use findOne() by task._id and task.owner

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res)=>{              // Update a task by ID
    const allowed = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValid = updates.every((update)=>allowed.includes(update))
    if(!isValid){
        return res.status(404).send({Error: 'Invalid updates!'}) // 400 Bad Request such as unknown field update 
    }
    
    try{
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        const task = await Task.findOne({_id: req.params.id, owner:req.user._id })

        if(!task){
            return res.status(404).send()         //404 Not Found
        }
        updates.forEach((update)=>task[update] = req.body[update])
        await task.save()
        res.send(task)                            // OK
    }catch(e){
        return res.status(400).send()             // 400 Bad Request such as invalid update data
    }
})         

router.delete('/tasks/:id', auth, async (req, res)=>{          // Delete a task
    try{
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id })
        if(!task){
            return res.status(404).send()       //404 Not Found
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)                 // 500 Internal Server Error
    }
})



module.exports = router