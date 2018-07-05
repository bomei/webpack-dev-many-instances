const fs = require('fs');
const xtpl = require('xtpl');

var appName = process.argv[2];

console.log('Generate new config file for '+appName);

xtpl.renderFile('./utils/newConfig.xtpl',{
    appName: `\'${appName}\'`
},function(err, content){
    target = `./configs/webpack.config.${appName}.js`
    fs.exists(target,function(exists){
        if(exists){
            console.log(`Config for ${appName} has existed, please try another appname.`)
            return
        }
        fs.writeFile(target, content,function(err){
            if(err){
                console.log('error:', err)
            }
            console.log(`webpack.config.${appName}.js generated in ./configs`)
        })
    })
    
})