require('../src/db/mongoose')
const User = require('../src/models/user')

// ObjectId("ObjectId("5dc7512ea9b73c3d70b0ff93")")

// User.findByIdAndUpdate("5dc7512ea9b73c3d70b0ff93",{age: 31, name: 'Vanessa'}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age: 31})
// }).then((age31)=>{
//     console.log(age31)
// }).catch((err)=>{
//     console.log(err)
// })

const updateAgeAndCount = async (id, age) =>{
    const user = await User.findByIdAndUpdate(id, { age })
    // console.log(user)
    // console.log(user['name'])    
    const count = await User.countDocuments({age})

    return count
}

updateAgeAndCount("5dc7512ea9b73c3d70b0ff93", 21).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})