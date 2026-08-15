const Blog = require('../models/blog')

const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Glow',
        author: 'Ada',
        url: 'google.com',
    },
    {
        title: 'Dryer',
        author: 'John',
        url: 'duck.com',
        likes: 7
    }
]

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'Glow',
        author: 'Ada',
        url: 'google.com',
        likes: 10
    })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}


const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
}
