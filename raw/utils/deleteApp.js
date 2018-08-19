const fs = require('fs');
const xtpl = require('xtpl');
const argv = require('yargs').argv
const shell = require('async-shelljs')
const {promisify} = require('util')
const {BoException} = require('./exception')


let renderFile = promisify(xtpl.renderFile)
let fileExists = promisify(fs.exists)
let writeFile = promisify(fs.writeFile)

let {name} = argv
if (!name) {
    console.log('--name is required')
    shell.exit(0)
}

async function deleteApp(name){
    console.log('Deleting app -- '+name+'...');
    let target = `./configs/webpack.config.${name}.js`
    if (!await fileExists(target)){
        throw new BoException('No such app called '+name, `Config for ${name} hasn't existed, please check the appname.`)
    }
    let {stdout, stderr}=await shell.exec(`rm -r ./src/${name}&rm ./configs/webpack.config.${name}.js`)
    if(!stderr){
        console.log(`Finish to remove app -- ${name}`)
        return stdout
    }
    else throw new BoException('Copy src file error',stderr)
    
    return
}

deleteApp(name).then((stdout)=>{
    console.log(stdout)
}).catch((err)=>console.log(err))

