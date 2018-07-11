const fs=require('fs')

var filenames = fs.readdirSync('./configs')
var configs=Array()
filenames.forEach(function(file){
    if(file.indexOf('webpack.config')===0){
        configs.push(require('./configs/'+file))
    }
    
})
// console.log(configs)
module.exports=configs