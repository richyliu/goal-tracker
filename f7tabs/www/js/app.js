// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app = new Framework7({
    root: '#app', // App root element
    id: 'io.liu.habittracker', // App bundle ID
    name: 'Habit Tracker', // App name
    theme: 'auto', // Automatic theme detection
    // App root data
    data: function () {
        let TYPES = {
            SLIDER: Symbol('slider'),
            BOOLEAN: Symbol('boolean')
        };

        let combinedData = {
            user: {
                firstName: 'John',
                lastName: 'Doe',
            },
            // Demo products for Catalog section
            products: [
                {
                    id: '1',
                    title: 'Apple iPhone 8',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
                }, {
                    id: '2',
                    title: 'Apple iPhone 8 Plus',
                    description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
                }, {
                    id: '3',
                    title: 'Apple iPhone X',
                    description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
                },
            ],
            habits: [
                {
                    name: 'Eating fruit',
                    type: TYPES.SLIDER,
                    updateTime: 1000*60*60*22
                }, {
                    name: 'Ate brunch',
                    type: TYPES.BOOLEAN,
                    updateTime: 1000*60*60*16
                }
            ]
        };
        combinedData.TYPES = TYPES;

        return combinedData;
    },
    // App root methods
    methods: {
        helloWorld: function () {
            app.dialog.alert('Hello World!');
        },
    },
    // App routes
    routes: routes,
});

// Init/Create views
var homeView = app.views.create('#view-home', {
    url: '/'
});
var dailyView = app.views.create('#view-daily', {
    url: '/daily/'
});
var settingsView = app.views.create('#view-settings', {
    url: '/settings/'
});

// app.router.navigate('/habits/');
