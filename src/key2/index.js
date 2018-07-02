import _ from 'lodash';
import printMe from './printMe.js';

let app=document.getElementById('app')
let mark = document.getElementById('mark')
mark.innerHTML='2222222222'
function updateApp() {
  // var element = document.createElement('div');
  // var btn = document.createElement('button');

  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  // btn.innerHTML = 'Click me and check the console!';
  // btn.onclick = printMe;

  // element.appendChild(btn);

  // return element;
  app.innerHTML = printMe()
}

// document.body.appendChild(component());

 if (module.hot) {
   module.hot.accept('./printMe.js', function() {
     console.log('Accepting the updated printMe module!');
     updateApp();
   })
 }