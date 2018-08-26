let m=new Map()

m.set('hello',{doo:['do','h'],he:'he'})

let {doo, he}=m.get('hello')

console.log(doo,he)
console.log(m.get('hello'))
doo.push('waht')
console.log(doo,he)
console.log(m.get('hello'))