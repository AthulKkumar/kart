const { response } = require('express');
var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');

//Middleware
//To check the user loged in or not
let verifyLogin = (req, res, next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user = req.session.user;//Checks if the user is logged in or not
  let cartCount = null;
  //It will only display the count if the userr exist
  if(user){
    //Used to display the no of items in the cart button
    cartCount = await userHelpers.getCartCount(req.session.user._id)
  }  
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-product', {products, user, cartCount});
  })  
});
//user login page
router.get('/login', (req, res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('user/user-login',{'loginErr':req.session.loginErr})
    req.session.loginErr = false
  }
});
//user signup page
router.get('/signup', (req, res)=>{
  res.render('user/user-signup');
})

router.post('/signup', (req, res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    req.session.loggedIn = true;
    req.session.user = response.user;
    res.redirect('/')

  })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response){
      req.session.loggedIn = true;
      req.session.user = response.user;
      // console.log(req.session.user);
      res.redirect('/')
    }
  }).catch(()=>{
    req.session.loginErr = true;
    res.redirect('/login')

  })
})
//logout for user
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/')
})

//If the user clicks in the cart option
router.get('/cart',verifyLogin,async(req,res)=>{
  let products = await userHelpers.getCartProducts(req.session.user._id)
  let totalPrice = await userHelpers.getTotalAmount(req.session.user._id)
  // console.log(products);
  res.render('user/user-cart',{products,user:req.session.user,totalPrice})
})

//If the user clicks in the Add to cart button
router.get('/add-to-cart/:id',verifyLogin,(req, res)=>{
  //Sending the productId and user Id as an parameter 
  userHelpers.addToCart(req.params.id, req.session.user._id).then((response)=>{  
    res.json({status:true})//Sending an respone to the user (ajax)
  })

})
//To change the product quantity in the users cart
router.post('/change-product-quantity',(req, res)=>{

  userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total = await userHelpers.getTotalAmount(req.session.user._id)
    res.json(response)
  })
})
//Will display the place the order page to fill details
router.get('/place-order', verifyLogin, async(req, res)=>{
  let total = await userHelpers.getTotalAmount(req.session.user._id)//Get the total amount of the products
  res.render('user/place-order',{total, user: req.session.user})
})
//To place the order
router.post('/place-order', async(req, res)=>{
  let products = await userHelpers.getCartProductList(req.body.userId)//Get the products only 
  let totalPrice = await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body,products,totalPrice).then(()=>{

  })
  console.log(req.body);
})
module.exports = router;
