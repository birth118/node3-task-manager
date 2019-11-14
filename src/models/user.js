const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


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
    }]
})

// Instances of Models are documents. Documents have many of their own built-in instance methods.
// For a specific user instance
userSchema.methods.generateAuthToken  = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'secret')
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token

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


// Middleware - pre/post of mongoDB 'model.save()' action
userSchema.pre('save', async function(next) {        // arrow function won't working here!
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()                                             // What is this for?
})

const User = mongoose.model('User', userSchema);

module.exports = User