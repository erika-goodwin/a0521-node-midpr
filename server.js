const express = require('express');
const app = express();

const path = require('path')
const bodyParser = require('body-parser')

const mongoConnect = require('./util/db-mongo').mongoConnect

// const { off } = require('process');

//Route
const homeRoute = require('./routes/homeRouter')
const blogRoute = require('./routes/blogRouter')

//Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

//========Route========
app.use('/', homeRoute)
app.use('/api/blogs', blogRoute)

app.use((req,res,next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found'})
})

//PORT
const PORT = process.env.PORT || 8000;
// app.listen(PORT, ()=>console.log(`Listening port ${PORT}`))
mongoConnect(()=>{
    app.listen(PORT)
})