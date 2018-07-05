const fs = require('fs');
const xtpl = require('xtpl');

var appName = `\'${process.argv[2]}\'`
console.log(appName)
xtpl.renderFile('./utils/newConfig.xtpl',{
    appName: appName
},function(err, content){
    fs.writeFile(`./configs/webpack.config.${appName}.js`,content,function(err,res){
        console.log(err, res)
    })
})