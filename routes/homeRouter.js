const express = require('express');
const router = express.Router();

const Blogs = require('../models/blog.model');


router.get("/", (req, res) => {
    // res.send("hello world");
    res.render('all')
    // res.render('page/home')
  });
  
module.exports = router;