const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
require('dotenv').config()

let db

exports.mongoConnect = (callback) => {
    // MongoClient.connect(process.env.MONGODB_URL)
    MongoClient.connect('mongodb+srv://erikahashizume:Shellvoerika6011@cluster0.fqisx.mongodb.net')
    .then(client => {
        console.log(' Connected to Database')
        db = client.db('node-blog')
        callback()
    })
    .catch(err =>{
        // if(err) throw err
        console.log('Error in mongo connect', err)
    })
}

// module.exports = mongoConnect
exports.getDB = ()=>{
    if(db){
        return db
    }
    throw 'No database found'
}