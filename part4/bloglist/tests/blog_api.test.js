const bcrypt = require('bcrypt')

const mongoose = require('mongoose')
const { test, describe, after, beforeEach, before } = require('node:test')


const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const _ = require('lodash')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

before(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: "rooty", passwordHash })

    await user.save()

    const login = await api
        .post('/api/login')
        .send({ username: "rooty", password: "secret" })


    helper.initialBlogs.map(h => Object.assign(h, { "user": user._id.toString() }))
    token = login.body.token


})

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared blog list')


    await Blog.insertMany(helper.initialBlogs)
    console.log('done')

})

describe('get methods', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]
        const response = await api
            .get(`/api/blogs/${blogToView.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(response.body, blogToView)
    })
})


describe('post/put methods', () => {
    test('a valid blog can be added', async () => {
        const blog = {
            title: 'Dry',
            author: 'John',
            url: 'duck.com',
            likes: 7
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await helper.blogsInDb()


        const contents = response.map(blog => _.omit(blog, ['__v', 'id', 'user']))

        assert.strictEqual(response.length, helper.initialBlogs.length + 1)

        assert.deepStrictEqual(_.find(contents, blog), blog)


    })

    test('likes of a blog can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]
        blogToView.likes = 10
        await api
            .put(`/api/blogs/${blogToView.id}`)

            .set('Authorization', `Bearer ${token}`)
            .send(blogToView)
            .expect(201)
        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToView.id)

        assert.strictEqual(blogToView.likes, updatedBlog.likes)
    })


    test('blog with missing fields cannot be added', async () => {
        const blog = {
            'title': 'author',
            'likes': 7
        }

        await api
            .post('/api/blogs')

            .set('Authorization', `Bearer ${token}`)
            .send(blog)
            .expect(400)

        const response = await helper.blogsInDb()

        assert.strictEqual(response.length, helper.initialBlogs.length)
    })
})

describe('delete methods', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${blogToView.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        const ids = blogsAtEnd.map(blog => blog.id)
        assert(!ids.includes(blogToView.id))
        assert(blogsAtEnd.length, helper.initialBlogs.length - 1)

    })
})

describe('property methods', () => {
    test('unique property of the blog is named "id"', async () => {
        const blogsAtStart = await helper.blogsInDb()
        assert(_.every(blogsAtStart, blog => _.has(blog, 'id')))

    })

    test('no likes defaults to 0', async () => {
        const blog = {
            'title': 'ayo',
            'author': 'Bruh',
            'url': 'hey.com'
        }
        const newBlog = Blog(blog)
        assert(newBlog['likes'] === 0)
    })
})



after(async () => {
    await mongoose.connection.close()
})


