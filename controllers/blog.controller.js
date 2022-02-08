const Blogs = require('../models/blog.model');
const Joi = require("joi");

const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');


//========Render top page
exports.getTopPage =  (req, res) => {
    Blogs.fetchAll().then((blogs)=>{
        const shortDesc = blogs.map(p => ({ ...p, content: `${p.content.slice(0, 150)}...` }))

        res.render('page/blog-list',{
            pageTitle: 'all blogs',
            blogs:shortDesc,

        })
    }).catch(err => console.log(err))
}

//========Render create
exports.getCreat = (req,res)=>{
    res.render('page/create-edit-blog',{
        pageTitle: 'Create a new blog',
        editing: false
    })
}

//========Render a blog article
exports.getBlogById = (req, res)=>{
    const pickedBlogId = req.params.id
    Blogs.findById(pickedBlogId).then((blogs)=>{

        console.log(' get a blog detail' , blogs)

        res.render('page/blog-page',{
            pageTitle: 'blog',
            blogs:blogs
        })
    }).catch(err => console.log(err))
}

//========liked an article
exports.postLikeOfBlog =(req,res)=>{
    console.log('liked req.body', req.body)

    const pickedBlogId = req.params.id

    const UpdateBlog = new Blogs();
    UpdateBlog.editLiked(pickedBlogId).then(()=>{
        res.redirect(`/api/blogs/${pickedBlogId}`)
    }).catch(err=>console.log(err))
}

//========Comment in an article
exports.postComment = (req,res)=>{
    const comments = req.body;

    const pickedBlogId = req.params.id
    comments.commentId = pickedBlogId
    comments.uniqueId = uuidv4();

    console.log('new comments ob:', comments)

    const updatedBlog = new Blogs(pickedBlogId, null, null, null, null, null, null, comments);
    updatedBlog.saveComment(pickedBlogId).then(()=>{
        res.redirect(`/api/blogs/${pickedBlogId}`)
    }).catch(err=>console.log(err))

}

//========Comment delete) 
exports.postCommentDelete = (req,res)=>{
    const pickedBlogId = req.params.id
    console.log('delete comment pushed')
    console.log('delete req.body', req.body)

    const updatedBlog = new Blogs();

    updatedBlog.deleteCommentById(pickedBlogId).then(()=>res.redirect(`/api/blogs/${pickedBlogId}`)).catch(err=>console.log(err))
}

//========Post create
exports.postCreateBlog = (req, res)=>{
    //Input validation
    const { error } = validateInput(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let localDate = new Date()
    const offset = localDate.getTimezoneOffset()
    localDate = new Date(localDate.getTime() - (offset*60*1000))   
    const createdDate =  localDate.toISOString().split('T')[0]

    const commentArray = []
    const initLiked = 0

    const{_id, title, content,author, image, date, liked, comments} = req.body;
    const blog = new Blogs(null, title, content, author, image, createdDate, initLiked, commentArray);
    blog.save();
    res.redirect('/api/blogs');
}

//========Render Edit
exports.getEdit = (req,res)=>{
    const editMode = req.query.edit
    if(!editMode) res.redirect('/')

    const pickedBlogId = req.params.id
    Blogs.findById(pickedBlogId).then(blogs=>{

        console.log('edit render blog', blogs)
        res.render('page/create-edit-blog',{
            pageTitle: 'Edit the blog',
            editing: editMode,
            blogs:blogs
        })
    }).catch(err=>console.log(err))
}

//========Post Edit
exports.postEdit = (req,res)=>{
    //Input validation
    const {error} = validateInput(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let localDate = new Date()
    const offset = localDate.getTimezoneOffset()
    localDate = new Date(localDate.getTime() - (offset*60*1000))   
    const createdDate =  localDate.toISOString().split('T')[0]

    const pickedBlogId = req.params.id

    const{_id, title, content,author, image, date, liked, comments} = req.body;

    console.log('edit req.body:', req.body)
    
    const UpdateBlog = new Blogs(pickedBlogId, title, content, author, image, createdDate, comments);
    console.log('updateBlog:', UpdateBlog)
    UpdateBlog.edit(pickedBlogId).then(()=>{
        res.redirect('/api/blogs')
    }).catch(err=>console.log(err))
}

//========delete post
exports.postDeletePost = (req,res)=>{
    const pickedBlogId = req.params.id
    Blogs.deleteById(pickedBlogId).then(()=>res.redirect('/api/blogs')).catch(err=>console.log(err))
}

//========validation
function validateInput(input){
    //not null not ' ' 
    const schema = Joi.object({
      title: Joi.string().min(3).required(),
      content: Joi.string().allow(''),
      author: Joi.string().min(3).required(),
      image: Joi.string().allow(''),
      date: Joi.date().iso().allow(''),
      liked: Joi.number().allow(''),
      comments: Joi.object([{
          name:Joi.string(),
          comment:Joi.string()
      }]),

    });
    return schema.validate(input);
  }
