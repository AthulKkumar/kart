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
router.get('/', function(req, res, next) {
  let user = req.session.user;
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-product', {products,user});
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
    // console.log(response);
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

router.get('/cart',verifyLogin,(req,res)=>{
  res.render('user/user-cart')
})

module.exports = router;
