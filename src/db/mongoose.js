const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify : false
})

//DDL
// const Tasks = mongoose.model('Tasks', {  //Collection: Tasks
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })


// DML

// const user = new User({
//     name: ' Jono Smith' , 
//     email: 'Mike@Fisy.com   ',
//     password: 'Password01',
//     address: '3 street'

// })

// user.save().then((result)=>{
//     console.log(result)
// }).catch((err)=>{
//     console.log(err)
// })


// const task  = new Tasks({
//     description: 'Send Hello to mom    '
// })

// task.save().then((result)=>{
//     console.log(result)   
// }).catch((err)=>{
//     console.log(err)
// })

