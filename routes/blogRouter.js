const express = require('express');
const router = express.Router();
const Joi = require("joi");
const Blogs = require('../models/blog.model');

//========Render top page
router.get("/", (req, res) => {
    // res.send(blogs);
    Blogs.fetchAll().then((blogs)=>{
        const shortDesc = blogs.map(p => ({ ...p, content: `${p.content.slice(0, 150)}...` }))

        res.render('page/blog-list',{
            pageTitle: 'all blogs',
            blogs:shortDesc
        })
    }).catch(err => console.log(err))
});


//========Render a blog article
router.get('/:id', (req, res)=>{
    const pickedBlogId = req.params.id
    Blogs.findById(pickedBlogId).then((blogs)=>{

        console.log(' get a blog detail' , blogs)

        res.render('page/blog-page',{
            pageTitle: 'blog',
            blogs:blogs
        })
    }).catch(err => console.log(err))
})
//========Render create
router.get('/create',(req,res)=>{
    res.render('page/create-edit-blog',{
        pageTitle: 'Create a new blog',
        editing: false
    })
})
//========Post create
router.post('/create', (req, res)=>{
    //Input validation
    const { error } = validateInput(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let localDate = new Date()
    const offset = localDate.getTimezoneOffset()
    localDate = new Date(localDate.getTime() - (offset*60*1000))   
    const createdDate =  localDate.toISOString().split('T')[0]


    const{_id, title, content, author, image, date} = req.body;
    const blog = new Blogs(null, title, content, author, image, createdDate);
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
    //Input validation
    const {error} = validateInput(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const pickedBlogId = req.params.id
    const{title, content, author} = req.body;
    const updateBlog = new Blogs(pickedBlogId, title, content, author);
    updateBlog.edit(pickedBlogId).then(()=>res.redirect('/api/blogs')).catch(err=>console.log(err))
})
//========delete
router.post('/delete/:id', (req,res)=>{
    const pickedBlogId = req.params.id
    Blogs.deleteById(pickedBlogId).then(()=>res.redirect('/api/blogs')).catch(err=>console.log(err))
})
//========validation
function validateInput(input){
    const schema = Joi.object({
      title: Joi.string().min(3).required(),
      content: Joi.string(),
      author: Joi.string().min(3).required(),
      image: Joi.link().ref(ref),
      date: Joi.date().iso(),
    });
    return schema.validate(input);
  }


  module.exports = router;