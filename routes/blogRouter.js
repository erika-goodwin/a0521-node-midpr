const express = require('express');
const router = express.Router();
const Joi = require("joi");
const Blogs = require('../models/blog.model');

//Database for now
// const blogs = [
//     {id: 1, title: 'blog 1 title', content: 'qweyukasgdhjbhjsagdhgkdhsakjdka'},
//     {id: 2, title: 'blog 2 title', content: 'qasdsadfzxcvxcbvcxnbvnnmvbncvbm'},
//     {id: 3, title: 'blog 3 title', content: 'jhgngfdxgzfraevfwsfeawefd'},  
// ]

//========Render top page
router.get("/", (req, res) => {
    // res.send(blogs);
    Blogs.fetchAll().then((blogs)=>{
        console.log(blogs)
        res.render('page/blog-list',{
            pageTitle: 'all blogs',
            blogs:blogs
        })
    }).catch(err => console.log(err))
});

// router.get('/:id', (req, res)=>{
//     const blog = blogs.find(b => b.id === parseInt(req.params.id))
//     if(!blog) return res.status(404).send('The blog with the given id was not found')

//     res.send(blog)
// })

//========Render create
router.get('/create',(req,res)=>{
    res.render('page/create-edit-blog',{
        pageTitle: 'Create a new blog',
        editing: false
    })
    // res.send(' Hi hi rendered creat')
})
//========Post create
router.post('/create', (req, res)=>{
    console.log(req.body)
    //Input validation
    const { error } = validateInput(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // const newBlog = {
    //     id: blogs.length + 1,
    //     title: req.body.title,
    //     content: req.body.content
    // };
    // blogs.push(newBlog);
    // res.send(blogs);
    const{_id, title, content, author} = req.body;
    const blog = new Blogs(null, title, content, author);
    blog.save();
    res.redirect('/api/blogs');
})

//========Render Edit
router.get('/edit/:id',(req,res)=>{
    const editMode = req.query.edit
    if(!editMode) res.redirect('/')

    const pickedBlogId = req.params.id
    Blogs.findById(pickedBlogId).then(blogs=>{
        res.render('page/create-edit-blog',{
            pageTitle: 'Edit the blog',
            editing: editMode,
            blogs:blogs
        })
    }).catch(err=>console.log(err))
})
//========Post Edit
router.post('/edit/:id',(req,res)=>{
    console.log(req.body)
    // const blog = blogs.find(b => b.id === parseInt(req.params.id))
    // if(!blog) return res.status(404).send('The blog with the given id was not found')
    
    //Input validation
    const {error} = validateInput(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    // blog.title = req.body.name;
    // blog.content = req.body.content;
    // res.send(blog)
    const pickedBlogId = req.params.id
    const{title, content, author} = req.body;
    const updateBlog = new Blogs(pickedBlogId, title, content, author);
    updateBlog.edit(pickedBlogId).then(()=>res.redirect('/api/blogs')).catch(err=>console.log(err))
    
})
//========delete
router.post('/delete/:id', (req,res)=>{
    // const blog = blogs.find(b => b.id === parseInt(req.params.id));
    // if(!blog) return res.status(404).send('The blog with the given id was not found');

    // const index = blogs.indexOf(blog);
    // blogs.splice(index, 1);
    // res.send(blog);

    const pickedBlogId = req.params.id
    Blogs.deleteById(pickedBlogId).then(()=>res.redirect('/api/blogs')).catch(err=>console.log(err))
})
//========validation
function validateInput(input){
    const schema = Joi.object({
      title: Joi.string().min(3).required(),
      content: Joi.string(),
      author: Joi.string().min(3).required()
    });
    return schema.validate(input);
  }


  module.exports = router;