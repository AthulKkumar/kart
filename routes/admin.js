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

router.get('/edit-product/:id',async(req,res)=>{
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})
})

router.post('/edit-product/:id',(req,res)=>{
  let id = req.params.id;

  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    let image = req.files.Image;
    if(req.files.Image){
      
      image.mv('public/images/product-images/'+id+'.jpg')
      res.redirect('/admin')

    }else{
      res.redirect('/admin')
    }
  })
})

module.exports = router;
