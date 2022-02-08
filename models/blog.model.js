const mongodb = require('mongodb')
const getDB = require('../util/db-mongo').getDB

module.exports = class Blogs {
    constructor(_id, title, content,author, image, date, liked, comments) {
        this._id = _id
        this.title = title
        this.content = content
        this.author = author
        this.image = image
        this.date = date
        this.liked = liked
        this.comments = comments
    }

    save(){
       const db = getDB()
        return db.collection('blogs').insertOne(this)
    }

    saveComment(id){
        const db = getDB()
        const objectId = new mongodb.ObjectId(id)
        return db.collection('blogs').updateOne(
            {_id: objectId },
            {$addToSet : {comments: this.comments}}
        )
    }

    edit(id){
        const db = getDB()
        const objectId = new mongodb.ObjectId(id)
        // return db.collection('blogs').updateOne({ _id: objectId }, {$set: this })
        return db.collection('blogs').updateOne(
            { _id: objectId }, 
            {$set: {title: this.title, content: this.content, author: this.author, image: this.image, date: this.date} 
        })
    }

    editLiked(id){
        const db = getDB()
        const objectId = new mongodb.ObjectId(id)
        // return db.collection('blogs').updateOne({ _id: objectId }, {$set: this })
        return db.collection('blogs').updateOne(
            { _id: objectId }, 
            {$inc: {liked: 1} 
        })
    }


    static deleteById(id){
        const db = getDB()
        const objectId = new mongodb.ObjectId(id)
        return db.collection('blogs').deleteOne({ _id: objectId })
    }
    deleteCommentById(id){
        const db = getDB()
        const objectId = new mongodb.ObjectId(id)
        return db.collection('blogs').updateOne(
            { _id: objectId },
            { $pull: {comments : {uniqueId : id }
        }})
    }

    //fetch all blogs
    static fetchAll(){
        const db = getDB()
        return db.collection('blogs').find().toArray()     
    }

    static findById(id) {
        const db = getDB()
        const objectId = new mongodb.ObjectId(id)
        return db.collection('blogs').find({ _id: objectId }).next()
    }
}