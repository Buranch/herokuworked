const express = require('express');
var mongoose = require('mongoose');
const fetch = require('./fetch');

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

module.exports  = createExpressApp;