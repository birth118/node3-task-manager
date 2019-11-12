const validator = require('validator')
const mongoose = require('mongoose')

// DDL - user collection
const User = mongoose.model('User', {   // Collection: User, mongoose, then, will pluralise to 'users' 
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    email: {
        type: String, 
        required:true, 
        trim:true, 
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

    }
});

module.exports = User