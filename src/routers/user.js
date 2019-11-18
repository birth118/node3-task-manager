const express = require('express')
const router = new express.Router() // You can add middleware and HTTP method routes (such as get, put, post, and so on) to router just like an application.

const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendByeEmail} = require('../emails/account')

const multer = require('multer')
const sharp = require('sharp')


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
         sendWelcomeEmail(user.email, user.name)
         token = await user.generateAuthToken()
         res.status(201).send({user, token})            // auth token goes to browser client
    }catch(err){
         res.status(400).send(err)     // 400: Bad request such as validation error
    }
})

router.post('/users/login',async (req,res)=>{          // find credential by email and passwd
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()    //as a uer instance method
 //       res.send({user:user.getPublicProfile(), token})
        res.send({user, token})
    }catch(e){
        res.status(400).send()  // 400: Bad request
    }
})


router.post('/users/logout',auth, async (req,res)=>{        // Logout the user from single login
    try{
           req.user.tokens = req.user.tokens.filter((item)=> item.token !== req.token) 
           await req.user.save()
           res.send()
    }catch(e){
           res.status(500).send(e)                       // 500 Internal Server Error
    }

})

router.post('/users/logoutAll', auth, async (req, res)=>{      // Logout the user from all login (pc, mobile, ...)
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()

    }catch(e){
         res.status(500).send(e)                       // 500 Internal Server Error  
    }
})

// app.get('/users', (req, res)=>{         // Retrieve all users
//     User.find({}).then((users)=>{
//         res.status.send(users)
//     }).catch((err)=>{
//         res.status(500).send()
//     })
// })

// No loger needed
// router.get('/users', auth, async (req, res)=>{         // Retrieve all users. Same as above, but with async/awai
//     try{                                               // midddle auth.next() runs, then async (req, res)=>{..} runs
//         const users = await User.find({})
//         res.status(200).send(users)
//     }catch(e){
//         res.status(500).send()
//     }    
// })

router.get('/users/me', auth, async (req, res)=>{        //  router.METHOD(path, [callback, ...] callback)
                                                         // Retrieve my profile by sending my auth token from browser client.
                                                         // auth: middleware callback function. midddle auth.next() runs, then async (req, res)=>{..} runs
                                                         // async (req,res=>{..} :  router handler. this runs after auth functiin
        res.status(200).send(req.user)          
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


// No need as router.get('/users/me',..) exists
// router.get('/users/:id', async (req, res)=>{     // Retrieve a user. Same as above, but with async/awai
//     const _id  = req.params.id
//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send()   //404 Not Found, *Why doesn't my 404 error work?* Answer below
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send(e)   // 500 Internal Server Error
//     }
// })                       

// *Why doesn't my 404 error work ?*
// Hi Michael,
// It's just a fluke that Andrew did not get 500. The findById method will throw an error 
// if the id you pass it is improperly formatted so you should see a 500 error most of the time. 
// However, if you pass in an id that is validly formatted, but does not exist 
// in the database then you will get the 404 sent back



// *No need this as noone else will delete me but I will delete myself --> need diffrent router
// router.patch('/user/:id', async (req,res)=>{                   // Update a user by ID
//     const updates  = Object.keys(req.body)
//     const allowed = [ 'name','age', 'email', 'password']
//     const isValidOperation = updates.every((update)=>{      // req.body should include all fields to be updated.
//         return allowed.includes(update)
//     })

//     if(!isValidOperation){
//         return res.status(400).send({Error: 'Invalid updates!'})
//     }

//     try{
//         //const user = await User.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true})

//         const user = await User.findByIdAndUpdate(req.params.id)
//         if(!user){
//             return res.status(404).send()   // Not found
//         }
        
//         updates.forEach((update)=>{
//              user[update] = req.body[update]     // Wow!. user['name'] will return value of 'name' property in user object
//         })
//         await user.save()       
//         res.send(user)          // OK
//     }catch(e){
//         res.status(400).send(e)    // Validation failed such as validation error
//     }
// })

router.patch('/users/me', auth, async (req,res)=>{                   // Update a user profile: me
    const updates  = Object.keys(req.body)
    const allowed = [ 'name','age', 'email', 'password']
    const isValidOperation = updates.every((update)=>{      // req.body should include all fields to be updated.
        return allowed.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({Error: 'Invalid updates!'})
    }

    try{
        const user = req.user
        updates.forEach((update)=>{
             user[update] = req.body[update]     // Wow!. user['name'] will return value of 'name' property in user object
        })
        await user.save()       
        res.send(user)          // OK
    }catch(e){
        res.status(400).send(e)    // Validation failed such as validation error
    }
})

// *No need this as noone else will delete me but I will delete myself --> need diffrent router
// router.delete('/users/:id',auth, async (req, res)=>{       // Delete a user
//     try{
//         const user = await User.findByIdAndDelete(req.params.id)
//         if(!user){
//             return res.status(404).send()   // Not found
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send(e)    // 500 Internal Server Error
//     }
// })    

router.delete('/users/me',auth, async (req, res)=>{       // Delete a user: me
    try{
        await req.user.remove()
        res.send(req.user)
        sendByeEmail(req.user.email, req.user.name)
    }catch(e){
        res.status(500).send(e)    // 500 Internal Server Error
    }
})    

const upload = multer({
    // dest: 'avatars/',                     //To store in the OS filesystm
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb) { 
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be an image'))
        }
        cb(null, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{           // To upload my avatar
//    req.user.avatar = req.file.buffer           // multer retrives the binary buffer data over http form-data body
    const buffer  = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()   // To resize  and reformat to png
    req.user.avatar = buffer 

    await req.user.save()
    res.send()
},(error,req, res, next)=>{                                             // ** To handle the uncaught Error in Express
    res.status(400).send({error: error.message})
})               

router.delete('/users/me/avatar',auth,async (req,res)=>{    //To delete profile avatar
    req.user.avatar = undefined                             //The 'avatar' field will be wiped rather than being set by NULL    
    await req.user.save()
    res.send()

})     

router.get('/users/:id/avatar', async (req, res)=>{

    try{
            const user= await User.findById(req.params.id)
            if(!user || !user.avatar){
                throw new Error()
            }
            res.set('Content-Type','image/png')             // To set REPSONSE header
            res.send(user.avatar)
    }catch(e){
        res.status(404).send(e)              // 404 Not Found
    }
})

module.exports = router