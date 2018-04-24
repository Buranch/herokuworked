
const http = require('http');

setInterval(()=>{
    http.get('https://mighty-caverns-28086.herokuapp.com/refresh', (res)=>{
        res.on('end', ()=>{
            console.log('waked him up');
        })
    })

},1000*60);