import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import App from './page/App';
import registerServiceWorker from './registerServiceWorker';

// String.prototype.startsWith=function(str){
//         if(str==null||str==""||this.length==0||str.length>this.length)
//                 return false;
//         if(this.substr(0,str.length)==str)
//                 return true;
//         else
//                 return false;
//         return true;
// }


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

