import {ConfigStore} from '../../utils/ConfigStore'
const config = require('../../configs/webpack.config.key1')

let cs = new ConfigStore()

cs.addConfig(config)

console.log(1)
