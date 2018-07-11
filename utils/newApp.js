const fs = require('fs')
const xtpl = require('xtpl')
const argv = require('yargs').argv
const shell = require('async-shelljs')
const {promisify} = require('util')
const {BoException} = require('./exception')
let renderFile = promisify(xtpl.renderFile)
let fileExists = promisify(fs.exists)
let writeFile = promisify(fs.writeFile)

let {name, type} = argv
if (!name) {
  console.log('--name is required')
  shell.exit(0)
}
if(!type) type = 'default'


async function renderConfig(type, name){
  console.log('Generatintg new config file for '+name+'...')
  let target = `./configs/webpack.config.${name}.js`
  if (await fileExists(target)){
    throw new BoException('File exists',`Config for ${name} has existed, please try another appname.`)
  }
  let configTemplateFileName = `./templates/new.config.${type}.xtpl.js`
  let content
  try{
    content = await renderFile(configTemplateFileName, {
      appName: `\'${name}\'`
    })
  }catch(err){
    throw new BoException('Xtpl render error', err)
  }
    
  try{
    let res = true
    res=await writeFile(target,content)
    if(!res)
      console.log(`Write config to ${target} OK.`)
  } catch (err){
    throw new BoException('Write file error',err)
  }
  return
}

async function copySrcFiles(name, type){
  console.log('Moving src files to ./src/'+name)
  let {stdout, stderr}=await shell.exec(`cp -r ./templates/new.src.${type} ./src/${name}`)
  if(!stderr){
    console.log(`Moving ${name} files to finished.`)
    return stdout
  }
  else throw new BoException('Copy src file error',stderr)
}

renderConfig(type, name).then(()=>{
  copySrcFiles(name, type)
    .then((stdout)=>console.log(stdout))
    .catch((err)=>console.log(err))
}).catch((err)=>console.log(err))

