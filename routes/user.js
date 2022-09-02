var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  let products = [
    {
      name:'iphone',
      Image:'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages-na.ssl-images-amazon.com%2Fimages%2FI%2F71hmFz8tp5L._SL1500_.jpg&f=1&nofb=1',
      description:'very good'
    },
    {
      name:'iphone13',
      Image:'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.FVE_Qacuojl_JWxGoL09fgAAAA%26pid%3DApi&f=1',
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
  res.render('index', {products});
});

module.exports = router;
