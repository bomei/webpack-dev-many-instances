import printMe from './printMe'

let app = document.getElementById('app')

function updateApp(){
  app.innerHTML = printMe()
}

if (module.hot){
  module.hot.accept(function(){
    updateApp()
  })
  module.hot.dispose(function(){
    
  })
}