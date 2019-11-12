const express = require('express')
const router = new express.Router()

const User = require('../models/user')

router.get('/test', (req,res)=>{
    res.send('from /test router')
})

// app.post('/users', (req, res)=>{        // Create a user
//     const user = new User(req.body)
//     user.save().then((result)=>{
//         res.status(201).send(user)
//     }).catch((err)=>{
//         res.status(400).send(err)     // 400: Bad request
//     })
// })


router.post('/users', async (req, res)=>{        // Create a user. Same as above, but with async/awai
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


router.get('/users', async (req, res)=>{         // Retrieve all users. Same as above, but with async/awai
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

router.get('/users/:id', async (req, res)=>{     // Retrieve a user. Same as above, but with async/awai
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

router.patch('/user/:id', async (req,res)=>{                   // Update a user by ID
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


router.delete('/users/:id',async (req, res)=>{       // Delete a user
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


module.exports = router