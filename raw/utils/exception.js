class BoException{
    constructor(message, detail){
        this.message=message
        this.name = 'BoException'
        this.detail=detail?detail:''
    }

    toString(){
        return JSON.stringify({
            name: this.name,
            detail: this.detail,
            message:this.message
        })
    }
}

module.exports.BoException = BoException