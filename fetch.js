//buranch added a comment
const http = require('http');
// const API_KEY = "rfpemd28x2vpds2t2ju52uyx";
const API_KEY = "2aqapxyrrj6mfv4ptecp6vqd";//Buranch
var categories = require('./categories/walmart_categories_requested');
var categoriesArray = require('./categories/walmart_categories_requested');

var Product = require('./models/product');
var ProductsMissingUPC = require('./models/missingUPC');
var mongoose = require('mongoose').Schema;
var WalmartCategoriesRequested = require('./models/walmartCategoriesRequested');



categories = JSON.parse(JSON.stringify(categories[0]));
console.log(categories, "/n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

const  express = require('express');
const router = express.Router();
var keys = Object.keys(categories).map(function (key) {
  return categories[key];
});

console.log(keys, "/n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");


  
router.get('/', (req, res) => {
  console.log("go");
  requestLoop()
})

var requestLoop = () => {
  var allData = [];

  // var trackTime = Date.now();

  console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++ WE ARE NOW WORKING ON +++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
  console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")


  var BASE_URL = "http://api.walmartlabs.com/"
  console.log(keys,'asdadsasdfadsffsd')
  var categoryId = keys.pop();
  var url = `v1/paginated/items?category=${categoryId}&apiKey=${API_KEY}&format=json`
  var arr = [BASE_URL + url];
  var clearId = setInterval(function () {
    if (arr.length != 0) {
      var nextPage = arr.pop();
      var req = http.get(nextPage, function (res) {
        var bodyChunks = [];
        res.on('data', function (chunk) {
          bodyChunks.push(chunk);
        })
          .on('end',
            function () {
              condition = true;
              try {
                var body = JSON.parse(Buffer.concat(bodyChunks));
                // console.log(body,"asdasdfs")
                
                console.log("not reached")
              }
              catch (err) {
                console.log("Error")
                var endTime = new Date();
                var startTime = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate() + 1, 1, 0, 10, 0);
                console.log("GOT HERE")
                console.log(endTime)
                console.log(startTime)

                while (condition) {
                  if (new Date() > startTime) {
                    arr.push(nextPage);
                    condition = false;
                    console.log("Ended for a DAY")

                  }

                }
              }


              if (condition) {

                try {
                  console.log(body['items'].length);
                  if(allData.length > 8){
                    addWalmartProducts(categoryId, allData);
                    allData = []
                    console.log("ADDED 500 Datas to the DB")
                    
                  }
                }
                catch (err) {
                  console.log('End of journey for a single Category');
                  console.log("++++++++++++++++++++++++++++++++++++++++",allData.length,"++++++++++++++++++++++++++++++++++++++++");
                  addWalmartProducts(categoryId, allData);
                  allData=[];
                  var nextCategoryId = keys.pop();
                  if (nextCategoryId) {
                    arr.push(BASE_URL + `v1/paginated/items?category=${nextCategoryId}&apiKey=${API_KEY}&format=json`);

                  } else {
                    
                    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++FINISHED+++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    
                    return;
                  }
                  return;
                }

                arr.push(BASE_URL + body.nextPage);
                console.log(body.nextPage);
                allData.push(body['items']);
                // console.log(allData)
                console.log("+++++++++++++++++++++++++++++++++GOTTEN ITEMS+++++++++++++++++++++++++++++++++");
                // console.log('Time  ', (Date.now() - trackTime) / 1000);
              }

            })
      });
    }
    else {

    }
  }, 300);





}

const addWalmartProducts = (id, data) => {
  console.log('in update walmart category', id);
  var body = data;
  let fullArray = body;
  let counter = 0;
  let productArray = [];
  let missingArray = [];
  let hasError = false;

  fullArray.map((prodArray, index) => {
    prodArray.map((product, i) => {
      if (product.upc) {
        counter++;
        let productInfo = {
          upc: product.upc,
          item_ids: {
            source: 'walmart',
            id: product.itemId
          },
          item_name: product.name,
          item_description_short: product.shortDescription,
          item_description_long: product.longDescription,
          price: product.salePrice,
          price_msrp: product.msrp,
          imp_size: product.size,
          walmartCategoryPath: product.categoryPath,
          brand_name: product.brandName,
          image_thumbnail: product.thumbnailImage,
          image_large: product.largeImage,
          dateAdded: Date.now(),
          hasError: false
        };
        console.log("id ", product.itemId);
        console.log('addingOne ', product.upc);
        productArray.push(productInfo);

      } else {
        console.log('addingONe Missing ', product.upc);


        // missing upc codes
        missingArray.push({
          item_name: product.name,
          item_ids: {
            source: 'walmart',
            id: product.itemId
          },
          brand_name: product.brandName,
          walmartCategoryPath: product.categoryPath,
          image_thumbnail: product.thumbnailImage,
          image_large: product.largeImage,
          dateAdded: Date.now()
        })
      }

    });

  });
  Product.insertMany(productArray)
    .then(function () {
      console.log('total items: ', counter);

    })
    .catch((err) => {
      console.log('product err');

      console.log(err.message);
    });


  ProductsMissingUPC.insertMany(missingArray)
    .then(function () {
      console.log('total missing items: ', missingArray.length);
    })
    .catch((err) => {
      console.log('missing err');
      console.log(err.message); require('./mock-data/walmart_categories_requested.json')
    });

  var categoryName = null;
  
  Object.keys(categoriesArray[0]).every(cate => {
    if (categoriesArray[0][cate] == id) {
      categoryName = cate;
      console.log('got the cateogry ', cate);
      return false;
    }
    return true;
  });
  WalmartCategoriesRequested.update({categoryId: id},
    {
    categoryName: categoryName,
    categoryId: id,
    productDataRetrieved: true,
    productDataRetrievedDate: Date.now(),
    productsInserted: true,
    numPages: fullArray.length,
    numItems: counter,
    hasError: hasError
  },
  {upsert: true}, function (err, category) {
    if (err) return err;
    console.log('complete creating walmart');
    // res.end();
  });
}


module.exports = router;
