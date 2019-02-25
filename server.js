const express = require('express');
const hbs = require('hbs');
const app = express();
const path = require('path');
const fs = require('fs');

/*
    Install latest version of git from https://www.git-scm.com/download/win
    Read the free book, 'pro-git 2nd edition 2014'

    test with... git --version
    initialise folder with... git init (results in a hidden folder called '.git', the repository)
    check with... git status

    add files that you want to check with... git add x
    e.g. git add 'package.json', git add 'public/', git add 'views/',  git add 'server.js'

    remove files that you don't want to check with a file called '.gitignore'
    e.g. node_modules/,*.log

    commit/save a change to your repository with... git commit -m 'message for this commit'
*/

/*
 By default nodemon only watches changes to js files.
 Don't start with... nodemon server
 Use... nodemon server -e js,hbs
*/

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
   
app.get('/help', (req, res) => {
    res.render('help.hbs',{
        "pageTitle" : "Help Page"
    });
});

app.get('/bad', (req, res) => {
    res.send({"errorMessage" : "BAD" });
    res.setHeader('HTTP/1.1','404')
});

app.listen(3000, () => {
    console.log('Server is available on Port: 3000');
});