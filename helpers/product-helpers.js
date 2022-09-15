const db = require('../config/connection');
const collection = require('../config/collections');
const { response } = require('express');
const objectId = require('mongodb').ObjectId;

module.exports = {
    //adding product fuction
    addProduct :  (product,callback)=>{
        db.get().collection('product').insertOne(product).then(()=>{
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
    //Deleting the product
    deleteProduct : (prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(prodId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    //Function for acquring the details of an product
    getProductDetails : (proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    //Function for update the product
    updateProduct : (proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(proId)},{
                $set :{
                    name : proDetails.name,
                    category : proDetails.category,
                    price : proDetails.price,
                    description : proDetails.description
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
}