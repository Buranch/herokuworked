
const mongoose = require('mongoose');
// const createApp = require('./create-express-app');
var port = process.env.PORT || 3000;
var Product = require('./models/product');

var dbFeeder = require('./categories/dbFeeder');
//==============================================================DB connection++++++++++++++++++++++++++++++++++++++++++++++++++=
// DB_CONN = 'mongodb://mbelachew:root@ds119700-a0.mlab.com:19700,ds119700-a1.mlab.com:19700/rodmisc?replicaSet=rs-ds119700';
// DB_CONN = 'mongodb://buranch:mLab130879@ds153869.mlab.com:53869/walmert'
// DB_CONN = 'mongodb://mbelachew:root@ds119700-a0.mlab.com:19700,ds119700-a1.mlab.com:19700/rodmisc?replicaSet=rs-ds119700'
// DB_CONN = 'mongodb://buranch:mLab130879@ds153869.mlab.com:53869/walmert'
DB_CONN = 'mongodb://localhost:27017/walmart'
mongoose.connect(DB_CONN, (err, result) => {
    if (err) {
        console.log("Error while connecting to the DB");
    }
    else {
        console.log("Connected with the DB");
        mongoose.Promise = global.Promise;
        var db = mongoose.connection;

        dbFeeder.fetch();
        // console.log('num ', num);
        /*
        createApp(db)
            .listen(port, () => {
            console.log("Server Running...", port);
        })*/

    }
});








