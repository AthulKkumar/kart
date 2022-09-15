const { response } = require('express');
var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');

//Middleware
//To check the user loged in or not
let verifyLogin = (req,res,next)=>{
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
    res.render('user/view-product', {products,user,cartCount});
  })  
});
//user login page
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('user/user-login',{'loginErr':req.session.loginErr})
    req.session.loginErr = false
  }
});
//user signup page
router.get('/signup',(req,res)=>{
  res.render('user/user-signup');
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    req.session.loggedIn = true;
    req.session.user = response.user;

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
  console.log(products);
  res.render('user/user-cart',{products,user:req.session.user})
})

//If the user clicks in the Add to cart button
router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  //Sending the productId and user Id as an parameter 
  console.log('api call');
  userHelpers.addToCart(req.params.id,req.session.user._id).then((response)=>{  
    res.json({status:true})
  })

})

module.exports = router;
