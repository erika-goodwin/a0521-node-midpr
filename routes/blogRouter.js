const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blog.controller')

//========Render top page
router.get("/",blogController.getTopPage);

//========Render create
router.get('/create', blogController.getCreat);


//========Render a blog article
router.get('/:id', blogController.getBlogById)

//========liked an article
router.post('/:id/liked', blogController.postLikeOfBlog)



//========Comment in an article
router.post('/:id/comment', blogController.postComment)

//========Comment delete) 
router.post('/:id/delete', blogController.postCommentDelete)


//========Post create
router.post('/create', blogController.postCreateBlog)

//========Render Edit
router.get('/edit/:id', blogController.getEdit)

//========Post Edit
router.post('/edit/:id', blogController.postEdit)


//========delete Post
router.post('/delete/:id', blogController.postDeletePost)



module.exports = router;