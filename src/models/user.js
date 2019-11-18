const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

// DDL - user collection
// Collection: User, mongoose, then, will pluralise to 'users' 

const userSchema = new mongoose.Schema({   
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    email: {
        type: String, 
        unique: true,
        required: true, 
        trim: true, 
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    age:  {
        type: Number, 
        default:0, 
        validate(value){            // custom validate
            if (value < 0){
                throw new Error('Age number should be positive number')
            }
         }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password should not include "password"')
            }
        }

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer                // For binary image
    }
},{
    timestamps: true
}
)

// virtual relationship user <---> tasks as 'Parent'
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'  
})

// Instances of Models are documents. Documents have many of their own built-in instance methods.
// For a specific user instance
userSchema.methods.generateAuthToken  = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token

}

// To re-crate a uer profile to be shared to client browser
// userSchema.methods.getPublicProfile = function(){
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password   // The JavaScript delete operator removes a property from an object;
//     delete userObject.tokens

//     return userObject
// }

//If an object being stringified (ex, via http ) has a property named toJSON whose value is 
//a function, then the toJSON() method customizes JSON stringification behavior:
//This will be applied to all 'user' instance going to client browser by being stingified
//This function will be used by JSON stringification behavior being controlled by Express
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password   // The JavaScript delete operator removes a property from an object;
    delete userObject.tokens
    delete userObject.avatar

    return userObject
} 

 
// To add static functions to your model
userSchema.statics.findByCredentials  = async (email,passwd) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatched =  await bcrypt.compare(passwd, user.password)
    if(!isMatched){
        throw new Error('Unable to login')
    }
    
    return user

}


// Middleware - pre/post of mongoDB 'model.save()' action - akind tigger before saving
userSchema.pre('save', async function(next) {        // arrow function won't working here! because using 'this' 
    const user = this

    if(user.isModified('password')){            // isModified() mongoose function
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()                                             // What is this for?
})

// Middleware: To delete all tasks of the user when the user is deleted
userSchema.pre('remove', async function(next){
    const user = this

    try{
        await Task.deleteMany({owner: user._id})
    }catch(e){
        throw new Error('deleteMany by user failed')
    }

    next()
})


const User = mongoose.model('User', userSchema);

module.exports = User