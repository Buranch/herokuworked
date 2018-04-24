var UPCstudy = require('./models/UPCstudy');

var upcArry = []

for(var i = -98; i > -110; i--){
    let name = `Wow 1 ${i}`;
    let upc = {
        upc: i,
        name: name
    }
    upcArry.push(upc);
}

UPCstudy.insertMany(upcArry, {
    ordered: false
})
.then((s)=>{
    console.log('wer are done ');

})
.catch((err)=>{
    console.log(err.message);
})
console.log('upc');




