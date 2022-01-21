const mongodb = require('mongodb')
const getDB = require('../util/db-mongo').getDB

module.exports = class Blogs {
    constructor(_id, title, content,author, image, date, liked) {
        this._id = _id
        this.title = title
        this.content = content
        this.author = author
        this.image = image
        this.date = date
        this.liked = liked
    }

    save(){
       const db = getDB()
        return db.collection('blogs').insertOne(this)
    }

    edit(id){
        const db = getDB()
        const objectId = new mongodb.ObjectId(id)
        // return db.collection('blogs').updateOne({ _id: objectId }, {$set: this })
        return db.collection('blogs').updateOne({ _id: objectId }, {$set: {title: this.title, content: this.content, author: this.author, image: this.image, date: this.date} })
    }

    editLiked(id){
        const db = getDB()
        const objectId = new mongodb.ObjectId(id)
        // return db.collection('blogs').updateOne({ _id: objectId }, {$set: this })
        return db.collection('blogs').updateOne({ _id: objectId }, {$set: {liked: this.liked} })
    }

    static deleteById(id){
        const db = getDB()
        const objectId = new mongodb.ObjectId(id)
        return db.collection('blogs').deleteOne({ _id: objectId })
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