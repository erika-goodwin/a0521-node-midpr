const express = require('express');
const app = express();

const path = require('path')
const bodyParser = require('body-parser')

// const { off } = require('process');

//Route
const homeRoute = require('./routes/home')
const blogRoute = require('./routes/blog')

//Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))



//========Route - HOME========
app.use('/', homeRoute)
//========ROUTE - BLOG========
app.use('/api/blogs', blogRoute)


//PORT
const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>console.log(`Listening port ${PORT}`))