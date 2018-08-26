const wrapper = require('../lib/middleware')
const ConfigStore = require('../../utils/ConfigStore')
const config = require('../../configs/webpack.config.vue1')

let cs = Object.create(ConfigStore)

cs.addConfig(config)

console.log(cs)


class WB{
    constructor(req,res,next){
        this.req=req
        console.log(req,res,next)
    }

    close(){
        console.log(this.req)
    }
}