let $$ = Dom7;

let app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },
    // Add default routes
    routes: [{
        path: '/detail/',
        url: 'detail.html',
    }]
    // ... other parameters
});

let mainView = app.views.create('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

/*
let el = document.querySelector('a.item-link');
let elClone = el.cloneNode(true);

el.parentNode.replaceChild(elClone, el);
*/
