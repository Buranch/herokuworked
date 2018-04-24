
var request = require('request');

setInterval(()=>{
    request('https://mighty-caverns-28086.herokuapp.com/refresh', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    });

},1000*60);