const db = require('../config/connection');
const collection = require('../config/collections');
const bcrypt = require('bcrypt');
const objectId = require('mongodb').ObjectId;//Helps to check with the id same as in the db(object_id)


module.exports = {

    doSignup: (userData) => {
        //Create an user db in database
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)//Hashing the password
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data)
            })
        })

    },

    doLogin: (userData) => {
        //verify the user has an account or not
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            //checks if the email is present or not
            if (user) {
                //Checks the password correct or not
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log('login success');
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    } else {
                        console.log('login failed');
                        // resolve({status:false})
                        reject()
                    }
                })
            } else {
                console.log('login failed');
                reject()

                // resolve({status:false})
            }
        })
    },

    addToCart: (proId, userId) => {
        //Creates an proObj to check the no/quantity of the product
        let proObj = {
            item: objectId(proId),
            quantity: 1
        }

        return new Promise(async (resolve, reject) => {

            //Collects the cart of user from the database
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            //Checks wether the cart of the user is present or not

            if (userCart) {

                let proExist = userCart.products.findIndex(product => product.item == proId)
                console.log(proExist);
                //Checks if the user added the same product or not 
                if (proExist != -1) {
                    db.get().collection(collection.CART_COLLECTION)
                        .updateOne({ user: objectId(userId), 'products.item': objectId(proId) },
                            {
                                $inc: { 'products.$.quantity': 1 }
                            }
                        ).then((response) => {
                            resolve()
                        })

                } else {
                    //If the user added new product it will push into the porducts array
                    // If user has already an cart the data will insert/push into the products array
                    db.get().collection(collection.CART_COLLECTION)
                        .updateOne({ user: objectId(userId) },
                            {
                                $push: { products: proObj }
                            }
                        ).then((response) => {
                            resolve()
                        })
                }

            } else {

                //If user has no cart it will create an new cart
                let cartObj = {
                    user: objectId(userId),
                    products: [proObj]
                }

                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
                    resolve()
                })
            }
        })
    },
    //Where it takes the items that added in the product
    getCartProducts: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) } //Matche the userId whit the users cart
                },
                {
                    $unwind: '$products' //Deconstructs an products from the cart to output a document for each element.
                },
                {
                    //Uses to display only nesscesary elements
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    //Uses to JOIN the product collection with the inputed documents and creates an array of product
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] } //Uses to convert the product array into an object
                    }
                }
                // {
                //     $lookup : {
                //         from : collection.PRODUCT_COLLECTION,
                //         let : { prodList : '$products'},
                //         pipeline : [
                //             {
                //                 $match : {
                //                     $expr : {
                //                         $in : ['$_id','$$prodList']
                //                     }
                //                 }
                //             }
                //         ],
                //         as : 'cartItems'
                //     }
                // }
            ]).toArray()

            resolve(cartItems)
        })
    },
    //To get the no of items present in the cart
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0;
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectId(userId) })
            //To check if the cart is present or not if cart exist it will take the length of the product array
            if (cart) {
                count = cart.products.length //The length will assign to the count variable
            }
            resolve(count)
        })
    },
    //Function for change the product quantity  
    changeProductQuantity: ({ cart, product, count, quantity }) => {
        count = parseInt(count)
        
        return new Promise((resolve, reject) => {
            //Checks if the product quantity is 1 an again pressing the decrement/minus button
            if (count == -1 && quantity == 1) {

                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({ _id: objectId(cart) },
                        {
                            $pull: { products: { item: objectId(product) } } //Uses to remove an product from an array
                        }
                    ).then((response) => {
                        resolve({removeProduct:true})
                    })

            } else {
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne({ _id: objectId(cart), 'products.item': objectId(product) },
                        {
                            $inc: { 'products.$.quantity': count } //Uses to increment the product quantity
                        }
                    ).then((response) => {
                        resolve({status:true})
                    })
            }
        })
    },
    //To get the total amount of the products in the cart
    getTotalAmount:(userId)=>{
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) } //Matche the userId whit the users cart
                },
                {
                    $unwind: '$products' //Deconstructs an products from the cart to output a document for each element.
                },
                {
                    //Uses to display only nesscesary elements
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    //Uses to JOIN the product collection with the inputed documents and creates an array of product
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] } //Uses to convert the product array into an object
                    }
                },
                {
                    //Uses to get the total amount of the items
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:['$quantity', {$toInt:'$product.price'}]}}
                    }
                }
            ]).toArray()
            // console.log(typeof total[0].product.price);
            // console.log(total[0].total);

            resolve(total[0].total)
        })

    },
    //Uses to place the order with the details
    placeOrder:(order, products, price)=>{
        return new Promise((resolve, reject)=>{
            let status = order['payment-method'] === 'COD'?'placed':'pending'
            let orderObj = {
                deliveryDetails:{
                    address: order.address1,
                    email: order.email,
                    city: order.city,
                    pincode: order.pincode,
                    date: new Date(),
                    mobile: order.mobile
                },
                userId: objectId(order.userId),
                paymentMethod: order['payment-method'],
                products: products,
                status:status,
                totalPrice: price
            }
            //Insert into order collection
            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
                //Removes the collection from the cart
                db.get().collection(collection.CART_COLLECTION).removeOne({user: objectId(order.userId)})
                resolve()
            })
        })
    },
    //Gets only the products from the cart collection
    getCartProductList:(userId)=>{
        return new Promise((resolve,reject)=>{
            let cart = db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            console.log(cart.products);
            resolve(cart.products)
        })
    }

}