const express = require('express');
var mongoose = require('mongoose');
// const fetch = require('./fetch');

var Product = require('./models/product');
// const a = require('./upc');

function createExpressApp(db){
    const app = express();
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type , Authorization, Accept");
        next();
    });
    console.log("api");
    app.use(fetch);
    return app;
}


var num = Product.find(null, (err, done)=>{
    // console.log(done);
}).count();

console.log('num ', num);

module.exports  = createExpressApp;