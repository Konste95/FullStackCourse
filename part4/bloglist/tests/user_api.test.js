const bcrypt = require('bcrypt')

const User = require('../models/user')
const mongoose = require('mongoose')
const { test, describe, after, beforeEach } = require('node:test')


const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

//...

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('invalid users are not created', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ml',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        const newUser2 = {
            username: 'mlkk',
            name: 'Matti Luukkainen',
            password: 'ps',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        await api
            .post('/api/users')
            .send(newUser2)
            .expect(400)


        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    })

})
after(async () => {
    await mongoose.connection.close()
})


