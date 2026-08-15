const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (_request, response) => {
    const blogs = await Blog.find({}).populate('user', { strictPopulate: false })
    response.json(blogs)
})

blogsRouter.get('/:id', async (_request, response) => {
    id = _request.params.id
    const blog = await Blog.findById(id)
    response.json(blog)
})



blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const user = request.user
    const blog = new Blog({ ...body, user: user._id })
    savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(blog)
})

blogsRouter.delete('/:id', async (request, response) => {
    id = request.params.id
    const blog = await Blog.findById(id)
    if (!blog) {
        return response.status(400).json({ error: "This blog doesn't exist" })
    }
    const user = request.user

    if (blog.user.toString() === user._id.toString()) {
        await Blog.findByIdAndDelete(id)
        response.status(204).end()
    } else {
        response.status(401).json({ error: "Selected blog is authored by someone else" })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    id = request.params.id
    updateLikes = { $set: { 'likes': request.body.likes } }
    result = await Blog.findByIdAndUpdate(id, updateLikes, { returnNewDocument: true })
    response.status(201).json(result)
})



module.exports = blogsRouter

