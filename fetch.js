const http = require('http');
const API_KEY = "nfqjq9x4ab2ff6r3e35hezac";
// nfqjq9x4ab2ff6r3e35hezac
// const API_KEY = "p83jh8v8n6nc2bj3v625nqbb"//brand new
// const API_KEY = "2aqapxyrrj6mfv4ptecp6vqd"; //Buranch
var categories = require('./categories/walmart_categories_requested');
var categoriesArray = require('./categories/walmart_categories_requested');

var Product = require('./models/product');
var ProductsMissingUPC = require('./models/missingUPC');
var mongoose = require('mongoose').Schema;
var WalmartCategoriesRequested = require('./models/walmartCategoriesRequested');
console.log('fetch.js');
categories = JSON.parse(JSON.stringify(categories[0]));
console.log(categories, "/n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

var newURL = `/v1/paginated/items?category=976759_1071964_976779&maxId=996770109&apiKey=${API_KEY}&format=json`
var resume = true;

const express = require('express');
const router = express.Router();
var keys = Object.keys(categories).map(function (key) {

  // console.log(categories[keys]);
  return categories[key];
});
// categories

console.log(keys, "/n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");


router.get('/', (req, res) => {
  res.send('everything works fine');
});

router.get('/refresh', (req, res) => {
  console.log("told by mike to wake up");
  // requestLoop()
  res.send('wooooo');
})


router.get('/start', (req, res) => {
  requestLoop();
  res.send('started');
})
var requestLoop = () => {
  var allData = [];
  var BASE_URL = "http://api.walmartlabs.com/"
  console.log(keys);
  var categoryId = keys.pop();
  console.log('going for', categoryId);
  //on paginated request never use categoryId, it's response is corrupted
  var url = `v1/paginated/items?category=${categoryId}&apiKey=${API_KEY}&format=json`
  var arr = [BASE_URL + url];
  console.log('url ', arr[0]);

  if(resume){
    arr[0] = BASE_URL + newURL;
    console.log('new url  ', arr[0]);
  }

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
              condition = true; //
              try {
                var body = JSON.parse(Buffer.concat(bodyChunks));
                // console.log(body,"asdasdfs")
                console.log("Body Parsed")
              } catch (err) {
                //this is body to json parse error
                //we assume it happnens when walmert API stop responding
                console.log("Body Parse error")
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
                    http.get('https://mighty-caverns-28086.herokuapp.com/refresh', function (res) {
                        res.on('end', ()=>{
                          console.log('woke myself up');
                        })
                    });
                  }

                }
              }
              //this means walmert API is working fine;
              if (condition) {
                try {
                  console.log(body['items'].length);
                  //if you fetch 800, take a breath and added them to database
                  //goal is to minimuize memory usage
                  if (allData.length > 8) {
                    addWalmartProducts(categoryId, allData, false);
                    allData = []
                    console.log("ADDED 800 Datas to the DB")
                    //we were thinking about walking this app right here



                  }
                } catch (err) {
                  //end of the cateogry nextPage.
                  console.log('End of journey for a single Category');
                  console.log(allData.length + ' each 100 product');
                  addWalmartProducts(categoryId, allData, true);
                  allData = [];

                  //current categoryID should be updated
                  categoryId = keys.pop();
                  // console.log('keys.pop() ', nextCategoryId);
                  if (categoryId) {
                    arr.push(BASE_URL + `v1/paginated/items?category=${categoryId}&apiKey=${API_KEY}&format=json`);
                    console.log('proved')
                  } else {
                    //if there is no next CategoryId stop 
                    console.log("++++++FINISHED+++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    return;
                  }
                  return;
                }

                //which means still have nextPage
                arr.push(BASE_URL + body.nextPage);
                console.log(body.nextPage);
                allData.push(body['items']);
                console.log('added 100 ', allData.length);
                // console.log(allData)
                // console.log("+++++++++++++++++++++++++++++++++GOTTEN ITEMS+++++++++++++++++++++++++++++++++");
                // console.log('Time  ', (Date.now() - trackTime) / 1000);
              }

            })
      });
    } else {}
  }, 300);





}

const addWalmartProducts = (id, data, createWalmertRequested) => {
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
        // console.log("id ", product.itemId);
        // console.log('addingOne ', product.upc);
        productArray.push(productInfo);

      } else {
        // console.log('addingONe Missing ', product.upc);


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
  Product.insertMany(productArray, 
    {ordered: false})
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
      console.log(err.message);
      require('./mock-data/walmart_categories_requested.json')
    });

  var categoryName = null;

  Object.keys(categoriesArray[0]).every(cate => {
    if (categoriesArray[0][cate] == id) {
      categoryName = cate;
      // console.log('got the cateogry ', cate);
      return false;
    }
    return true;
  });
  if (createWalmertRequested) {
    console.log('about to create walemertRquested');

    WalmartCategoriesRequested.insert({
      categoryName: categoryName,
      categoryId: id,
      productDataRetrieved: true,
      productDataRetrievedDate: Date.now(),
      productsInserted: true,
      numPages: fullArray.length,
      numItems: counter,
      hasError: hasError
    }, function (err, category) {
      if (err) return err;
      console.log('complete creating walmart');
      // res.end();
    });
  }
}

requestLoop();

module.exports = router;