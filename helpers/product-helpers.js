const db = require('../config/connection');
const collection = require('../config/collections');
const { response } = require('express');
const objectId = require('mongodb').ObjectId;

module.exports = {
    //adding product fuction
    addProduct :  (product,callback)=>{
        // console.log(product);
        db.get().collection('product').insertOne(product).then(()=>{

            // console.log(product._id);
            callback(product._id)
        });
    
    },
    //viewing all products
    getAllProducts : ()=>{
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products);
        })
    },

    deleteProduct : (prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(prodId)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    }

}