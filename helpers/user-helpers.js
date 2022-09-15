const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt');
const objectId = require('mongodb').ObjectId;//Helps to check with the id same as in the db(object_id)


module.exports = {

    doSignup : (userData)=>{
       //Create an user db in database
        return new Promise(async(resolve,reject)=>{
            userData.password = await bcrypt.hash(userData.password,10)//Hashing the password
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data)
            })
        })

    },

    doLogin : (userData)=>{
        //verify the user has an account or not
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            //checks if the email is present or not
            if(user){
                //Checks the password correct or not
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log('login success');
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    }else{
                        console.log('login failed');
                        // resolve({status:false})
                        reject()
                    }
                })
            }else{
                console.log('login failed');
                reject()

                // resolve({status:false})
            }
        })
    },

    addToCart : (proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            //Collects the cart of user from the database
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            //Checks wether the cart of the user is present or not
            if(userCart){
                //If user has already an cart the data will insert/push into the products array
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:objectId(userId)},
                {
                    $push : { products : objectId(proId)}
                }
                ).then((response)=>{
                    resolve()
                })
            }else{
                //If user has no cart it will create an new cart
                let cartObj = {
                    user : objectId(userId),
                    products :[ objectId(proId) ]
                }

                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    //
    getCartProducts : (userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match : { user : objectId(userId)}
                },
                {
                    $lookup : {
                        from : collection.PRODUCT_COLLECTION,
                        let : { prodList : '$products'},
                        pipeline : [
                            {
                                $match : {
                                    $expr : {
                                        $in : ['$_id','$$prodList']
                                    }
                                }
                            }
                        ],
                        as : 'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    },
    //To get the no of items present in the cart
    getCartCount : (userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count = 0;
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            //To check if the cart is present or not if cart exist it will take the length of the product array
            if(cart){
                count = cart.products.length //The length will assign to the count variable
            }
            resolve(count)
        })
    }

}