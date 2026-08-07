const mongoose = require('mongoose')


const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

console.log('connecting to', url)

mongoose.connect(url, { family: 4 }).then(() => {

    console.log('connected to MongoDB')
}).catch(error => {
    console.log('error connecting to MongoDB', error.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },

    number: {
        type: String,
        minLength: 8,
        required: [true, 'User phone number required'],
        validate: {
            validator: function (v) {
                return /\b\d{2,3}-\d+\b/.test(v)

            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
})

personSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person', personSchema)
