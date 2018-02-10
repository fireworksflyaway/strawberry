/**
 * Created by Mason Jackson in Office on 1/22/18.
 */
let promise1=new Promise(function (resolve, reject) {
        console.log('p1');
        setTimeout(()=>{resolve(1)}, 1000);
})

let promise2=new Promise(function (resolve, reject) {
        console.log('p2');
        setTimeout(()=>{resolve(2)}, 3000);
})
console.log('start');
Promise.all([promise1,promise2])
.then(([p1,p2])=>{
        console.log('All');
        console.log(p1+p2);
});

Promise.race([promise1,promise2])
.then(res=>{
        console.log('Race');
        console.log(res);
});