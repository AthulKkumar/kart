const { ObjectID, ObjectId } = require('bson');
const db = require('../config/connection')

module.exports = {

    addProduct : (product,callback)=>{
        console.log(product);
        db.get().collection('product').insertOne(product).then((data)=>{
            console.log(data);
            callback(data.insertedId)
        })
    }
}