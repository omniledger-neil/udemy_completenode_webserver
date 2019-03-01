const express = require('express');
const hbs = require('hbs');
const app = express();
const path = require('path');
const fs = require('fs');
// 'or' operator will set port 3000 if we don't find a environment variable...
const port = process.env.PORT || 3000;

// choose a templating engine, e.g. hbs (handlebars)...
app.set('view engine', 'hbs');
// register where to get templates...
hbs.registerPartials(path.join(__dirname, '/views/partials'));
// register helper functions...
hbs.registerHelper('fnCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('fnCurrentUser', () => {
    return 'Neil Stackman';
});
hbs.registerHelper('fnScreamIt', (text) => {
    return text.toUpperCase();
});

// activate maintenance mode, or continue to 'next'
// app.use((req,res,next) => {
//    res.render('maintenance');
// });

// register a middleware function, 'static'...
app.use(express.static(path.join(__dirname, '/public')));

// register your own middleware...
app.use((req,res,next) => {
    var now = new Date().toString();
    var log = `${now}:${req.method}:${req.originalUrl}:${req.baseUrl}:${req.path}:`;
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err){
            console.log('Unable to append to server.log');
        } else {
            next(); // without this line, no app. function below this will start
        }
    });
})

app.get('/', (req, res) => {
    res.render('home.hbs',{
        "pageTitle" : "Home Page"
        ,"welcomeMessage" : "Welcome to the Jungle,"
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs',{
        "pageTitle" : "About Page"
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs',{
        "pageTitle" : "Projects Page"
    });
});

app.get('/help', (req, res) => {
    res.render('help.hbs',{
        "pageTitle" : "Help Page"
    });
});

app.get('/bad', (req, res) => {
    res.send({"errorMessage" : "BAD" });
    res.setHeader('HTTP/1.1','404')
});

app.listen(port, () => {
    console.log(`Server is available on Port: ${port}`);
});