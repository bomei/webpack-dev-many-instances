const fs=require('fs')

var filenames = fs.readdirSync('./configs')
var configs=Array()
filenames.forEach(function(file){
    configs.push(require('./configs/'+file))
})

module.exports=configs