var catePath = require('./categorypath.json');
var original = require('./wanna.json');
var request = require('request');
var ori = [];
var wanna = require('./wannaarray.json');
var Product = require('./../models/product');
var WalmartCategoriesRequested = require('./../models/walmartCategoriesRequested');
var MissingUPC = require('./../models/missingUPC');
var Name = require('./../models/name');
// aazSIOoFihlimMzyBH77LkBhuJg1o-uX
//key->value pair for categoryID and categoryPath
var map_path_id = [];
// console.log(catePath);

var fs = require("fs");
var fileContent = "hello";

Object.keys(original).forEach((d) => {
    ori.push(original[d]);
});
catePath.forEach((parent) => {
    parent.children.forEach((child1) => {
        // console.log(child1.id);
        if (ori.includes(child1.id)) {
            // console.log('wowww  ', child1.id)
            map_path_id[child1.id] = child1.path;
        }
        if (child1.children) {
            child1.children.forEach((child2) => {
                if (ori.includes(child2.id)) {
                    // console.log('wowww  child2', child2.id)
                    map_path_id[child2.id] = child2.path;
                }
                // console.log('wowww  child2', child2.id);
            })
        }
    })
});


module.exports.add = () => {

    var arr = []
    for (var i = 0; i < 10; i++) {

        let na = {
            name: "Name",
            crush: "Crushed"
        }
        arr.push(arr);
    }
    Name.insertMany(arr)
        .then(() => {
            console.log('wooo done ', arr.lengh);
        })
        .catch(() => {
            console.log('cant fill');
        })

}
module.exports.fetch = () => {
    console.log('on fetch');

    var done = false;
    var i = 0;
    var wr = [];
    var itemsPerPage = 1000;
    ori.forEach((id) => {
        // console.log('looping ', id);
        var categoryName = null;
        Object.keys(wanna[0]).every(cate => {
            if (wanna[0][cate] == id) {
                categoryName = cate;
                // console.log('got the cateogry ', cate);
                return false;
            }
            
            return true;
        });
        // console.log(map_path_id[id]);//path
        //forEach id do a query to get all products with this categorypath
        // console.log(body);
        //count the item 
        Product.count({
                "walmartCategoryPath": map_path_id[id]
            }, (err1, count1) => {
                // console.log('onproduct')
            })
            .then((number) => {
                i++;

                let request = {
                    categoryName: categoryName,
                    categoryId: id,
                    productDataRetrieved: true,
                    productDataRetrievedDate: Date.now(),
                    productsInserted: true,
                    numPages: "" + Math.ceil(number / 100), //divide it by 100
                    numItems: "" + number, //response Item number;
                    hasError: false
                };
                console.log(request);
                wr.push(request);
            })
            .then(()=>{
                if(i == ori.length && !done){
                    console.log('done with pushing ', wr.length);
                    fs.writeFile("./sample.json", JSON.stringify(wr), (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        };
                        console.log("File has been created");
                    });
                    done = true;
                }
                // break;
            })

    })
}







// WalmartCategoriesRequested.insert({
//          categoryName: categoryName,
//          categoryId: id,
//          productDataRetrieved: true,
//          productDataRetrievedDate: Date.now(),
//          productsInserted: true,
//          numPages: Math.ceil( number / 100), //divide it by 100
//          numItems: number, //response Item number;
//          hasError: false
//      }, function (err, category) {
//          if (err) return console.log(err);
//          console.log('complete creating walmart');
//          // res.end();
//      });