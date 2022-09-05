var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');

/* GET users listing. */
router.get('/', function(req, res, next) {
 
  productHelpers.getAllProducts().then((products)=>{
    console.log(products);
    res.render('admin/view-products', {admin:true ,products});
  })
});

// product adding page for admin
router.get('/add-product',(req,res)=>{
  res.render('admin/add-product')
})
//products are added from admin side
router.post('/add-product',(req,res)=>{
  productHelpers.addProduct(req.body,(id)=>{
    console.log(id);
    let image = req.files.Image;
    image.mv('public/images/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render('admin/add-product')
      }else{
        console.log(err);
      }
    })
  })
})

router.get('/delete-product/:id',(req,res)=>{
  let prodId = req.params.id;
  productHelpers.deleteProduct(prodId).then((response)=>{
    res.redirect('/admin')
  })
})

module.exports = router;
