const _ = require('lodash')
const dummy = (blogs) => {

    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favouriteBlog = (blogs) => {

    const maxLikes = Math.max(...(blogs.map(blog => blog.likes)))
    if (blogs.length === 0) {
        return []
    } else {
        return blogs.find(blog => blog.likes === maxLikes)
    }

}



const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return []
    } else {
        const blogs_ = _.countBy(blogs, 'author')
        const maxBlogs = _.maxBy(_.toPairs(blogs_), o => o[1])
        return {
            'author': maxBlogs[0], 'blogs': maxBlogs[1]

        }
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return []
    } else {
        const blogs_ = _(_(blogs).groupBy('author')
            .map((author, name) => ({
                author: name,
                likes: _.sumBy(author, 'likes')
            })).value()).maxBy('likes')


        return blogs_
    }
}
module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes


}
