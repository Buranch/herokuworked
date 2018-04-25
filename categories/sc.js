var categories = require('./allC.json');
var original = require('./wanna.json');

var ids = [];
var ori = []
Object.keys(original).forEach((d) => { 
    ori.push(original[d]);
 })
categories.forEach(function (obj) {
    if (ori.includes(obj.categoryId)) {
        // console.log('good it exists ', obj.categoryId)
        // console.log('not includes');
        // console.log(obj.categoryId)
        // ids.push(obj.categoryId)
    } else {
        console.log('wooo we have problem with ', obj.categoryId);
        // console.log(obj.categoryId, ' already exists');
        return;
    }
});

