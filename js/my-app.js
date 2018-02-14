let $$ = Dom7;

let app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    // name: 'My App',
    // // App id
    // id: 'com.myapp.test',
    // // Enable swipe panel
    // panel: {
    //     swipe: 'left',
    // },
    // // Add default routes
    // routes: [{
    //     path: '/about/',
    //     url: 'about.html',
    // }]
    // ... other parameters
});

let mainView = app.views.create('.view-main');

// $$('button').click(e => {
//     e.stopPropagation();
// });
// 
// $$('a').click(e => {
//     e.stopPropagation();
//     e.preventDefault();
// });

let el = document.querySelector('a.item-link');
let elClone = el.cloneNode(true);

el.parentNode.replaceChild(elClone, el);