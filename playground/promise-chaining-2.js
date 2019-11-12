Task = require('../src/models/task')
require('../src/db/mongoose')

// ObjectId("5dc75afad7835b61945b4b83")

// Task.findByIdAndDelete("5dc8e035691ae2e02f2c699d").then((task)=>{
//     console.log(task)
//     return Task.countDocuments({completed: false})          // <-- chaining
// }).then((taskcount)=>{
//     console.log(taskcount)
// }).catch((err)=>{
//     console.log(err)
// })

const deleteTaskAndCount = async (id) =>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})

    return count
}

//bjectId("5dc8ffa1691ae2e02f2c6d56")
deleteTaskAndCount("5dc8ffa1691ae2e02f2c6d56").then((count)=>{
    console.log(count)
}).catch((err)=>{
    console.log(err)
})