import _ from 'lodash';
import printMe from './printMe.js';

// __webpack_public_path__='http://localhost:3000/key1/'

let app=document.getElementById('app')
let mark = document.getElementById('mark')

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

updateApp();
// document.body.appendChild(component());

 if (module.hot) {
   module.hot.accept('./printMe.js', function() {
     console.log('Accepting the updated printMe module!');
     updateApp();
   })
 }