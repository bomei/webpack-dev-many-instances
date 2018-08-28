'use strict'

import webpack from 'webpack'


class Hook{
    constructor(middlewareNme, action, func){
        this.middlewareNme=middlewareNme
        this.action=action
        this.func=func
    }
}

export default class CompilerManager{
    constructor(){
        this.configShelf=new Map()
        this.compilerShelf = new Map()
        this.hooks = {
            add: new Array(),
            delete: new Array()
        }
    }

    register(middlewareNme, action, func){
        if(action != 'add' && action!='delete') return `${action} not supported`
        this.hooks[action].push(new Hook(middlewareNme, action,func))
    }

    addConfig(config, unique){
        if(!config.name) return 'Config.name is required!'
        if(this.compilerShelf.has(config.name) && unique) return `${config.name} has existed!`
        let compiler = webpack(config)
        this.compilerShelf.set(config.name,{config,compiler})
        // this.hooks.add.forEach((hook)=>{
        //     hook.func(config.name)
        // })
    }

    deleteConfig(name){
        if(!this.compilerShelf.has(name)) return `${name} not exists`
        // this.hooks.delete.forEach((hook)=>{
        //     hook.func(name)
        // })
        this.compilerShelf.delete(name)
    }

    get(name){
        return this.compilerShelf.get(name)
    }
}
