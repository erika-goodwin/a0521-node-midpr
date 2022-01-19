const express = require('express');
const router = express.Router();
const Joi = require("joi");


//Database for now
const blogs = [
    {id: 1, title: 'blog 1 title', content: 'qweyukasgdhjbhjsagdhgkdhsakjdka'},
    {id: 2, title: 'blog 2 title', content: 'qasdsadfzxcvxcbvcxnbvnnmvbncvbm'},
    {id: 3, title: 'blog 3 title', content: 'jhgngfdxgzfraevfwsfeawefd'},  
]

//========get
router.get("/", (req, res) => {
    res.send(blogs);
});
router.get('/:id', (req, res)=>{
    const blog = blogs.find(b => b.id === parseInt(req.params.id))
    if(!blog) return res.status(404).send('The blog with the given id was not found')

    res.send(blog)
})
//========post
router.post('/', (req, res)=>{
    //Input validation
    // const { error } = validateInput(req.body)
    // if(error) return res.status(400).send(error.details[0].message)
    if (!req.body.title || req.body.title.length < 3) {
        res.status(400).send("Title is required and should be minimum 3 characters");
        console.log(req.body)
        return;
      };

    const newBlog = {
        id: blogs.length + 1,
        title: req.body.title,
        content: req.body.content
    };
    blogs.push(newBlog);
    res.send(blogs);
})
//========Put
router.put('/:id',(req,res)=>{
    const blog = blogs.find(b => b.id === parseInt(req.params.id))
    if(!blog) return res.status(404).send('The blog with the given id was not found')

    //Input validation
    const {error} = validateInput(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    blog.title = req.body.name;
    blog.content = req.body.content;
    res.send(blog)
})
//========delete
router.delete('/:id', (req,res)=>{
    const blog = blogs.find(b => b.id === parseInt(req.params.id));
    if(!blog) return res.status(404).send('The blog with the given id was not found');

    const index = blogs.indexOf(blog);
    blogs.splice(index, 1);
    res.send(blog);
})
//========validation
function validateInput(input){
    const schema = Joi.object({
      title: Joi.string().min(3).required(),
      content: Joi.string()
    });
    return schema.validate(input);
  }


  module.exports = router;