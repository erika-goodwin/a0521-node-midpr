const mongodb = require('mongodb')
const getDB = require('../util/db-mongo').getDB

module.exports = class Blogs {
    constructor(title, content) {
        this.title = title
        this.content = content
    }

    save(){
       const db = getDB()
        return db.collection('blogs').insertOne(this)
    }

    edit(id){
        const db = getDB()
        const objectId = new mongodb.ObjectId(id)
        // return db.collection('blogs').updateOne({ _id: objectId }, {$set: this })
    }

    static deleteById(id){
        const db = getDB()
        const objectId = new mongodb.ObjectId(id)
        // return db.collection('blogs').deleteOne({ _id: objectId })
    }

    //fetch all blogs
    static fetchAll(){
        const db = getDB()
        return db.collection('blogs').find().toArray()     
    }

    static findById(id) {
        const db = getDB()
        const objectId = new mongodb.ObjectId(id)
        // return db.collection('blogs').find({ _id: objectId }).next()
    }
}