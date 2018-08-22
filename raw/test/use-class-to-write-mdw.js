class Middleware{
    constructor(mark){
        this.mark=mark
    }

    mdw(req,res,next){
        // console.log(this.mark)
        res.append('slay','bo')
        next()
    }

    endpoint(req,res){
        // console.log(this.mark)
        // res.append('hello','end')
        res.send('endpoint of express')
    }
}

// let m = new Middleware('helo')

// m.mdw('d',new Array(),()=>{console.log('next')})


import express from 'express'

const app = express()
let m = new Middleware('hello')

app.use(m.mdw.bind(m))

app.get('*',m.endpoint.bind(m))

// Serve the files on port 3000.
app.listen(5000, function () {
    console.log('Example app listening on port 5000!\n')
})