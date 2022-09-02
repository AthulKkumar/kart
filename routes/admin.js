var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');

/* GET users listing. */
router.get('/', function(req, res, next) {

  let products = [
    {
      name:'iphone',
      Image:'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages-na.ssl-images-amazon.com%2Fimages%2FI%2F71hmFz8tp5L._SL1500_.jpg&f=1&nofb=1',
      description:'very good'
    },
    {
      name:'iphone13',
      Image:'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.McCR-XnfLp3otnU1HUlwKwHaLR%26pid%3DApi&f=1',
      description:'very good'
    },
    {
      name:'iphone12',
      Image:'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.3G2Gs9ySmlklfWgTinD1hgHaF7%26pid%3DApi&f=1',
      description:'very good'
    },
    {
      name:'iphone11',
      Image:'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.mcgw0YshuZOABiYVNsiqQwAAAA%26pid%3DApi&f=1',
      description:'very good'
    },
  ]

  res.render('admin/view-products', {admin:true ,products});
});
// product adding page for admin
router.get('/add-product',(req,res)=>{
  res.render('admin/add-product')
})

router.post('/add-product',(req,res)=>{
  // console.log(req.body)
  // console.log(req.files);
  productHelpers.addProduct(req.body,(id)=>{
    let image = req.files.Image;
    image.mv('../public/images/product-images'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render('admin/add-product')
      }
    })
  })
})

module.exports = router;
