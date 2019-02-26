const express = require('express');
const hbs = require('hbs');
const app = express();
const path = require('path');
const fs = require('fs');
// or operator will set port 3000 if we don't find a environment variable
const port = process.env.PORT || 3000;

/*
    Install latest version of git from https://www.git-scm.com/download/win
    Read the free book, 'pro-git 2nd edition 2014'

    configure...
    git config --global user.name "Neil Stackman"
    git config --global user.email neil@omniledger.co.uk

    test with... git --version
    initialise folder with... git init (results in a hidden folder called '.git', the repository)
    check with... git status

    add files that you want to check with... git add x
    e.g. git add 'package.json', git add 'public/', git add 'views/',  git add 'server.js'

    remove files that you don't want to check with a file called '.gitignore'
    e.g. node_modules/,*.log

    commit/save a change to your repository with... git commit -m "message for this commit"

now you have a local git repository recording changes to your code

    https://help.github.com/en/articles/connecting-to-github-with-ssh
    ... will describe generating an SSH key to let github be your online repository

    use 'git bash' instead of windows 'cmd' and navigate to current directory

    ssh-keygen -t rsa -b 4096 -C 'neil@omniledger.co.uk'
    check with... ls -al ~/.ssh
    shows you have created... 'id_rsa' (private key) and 'id_rsa.pub' (public key) files

    eval "$(ssh-agent -s)"... shows SSH agent is running e.g. Agent pid 7240

    ssh-add ~/.ssh/id_rsa... adds our key pair to the SSH agent

    connect/create a github identity... user: omniledger-neil, email: neil@omniledger.co.uk
    add contents of your id_rsa.pub file to the ssh key in your github profile (settings)

    ssh -T git@github.com... checks your connection and should result in a 'successfully authenticated' message

    manually create a new repository on github and you will be shown the command to connect to it
    e.g. git remote add origin https://github.com/omniledger-neil/udemy_completenode_webserver.git
    
    the command to add all 'modified' files to your repository, commit and push to remote
    git add.
    git commit -m "message"
    git push

    the initial command to push your committed local changes to your remote github repository...
    git push -u origin master

*/

/*
    Deploying app to the web can be achieved, for free, with heroku...
    https://dashboard.heroku.com/apps

    Download and install command line tools from...
    https://devcenter.heroku.com/articles/heroku-cli

    to check installation                   heroku --help
    to log in to heroku account             heroku login, user:neil@omniledger.co.uk
    to add your public key to heroku        heroku keys:add
    to check connection to heroku server    ssh -v git@heroku.com

    deploying to another server means that your port will be a variable, so change your app.listen

    you need to add the default 'start' script to your package.json so that the app does
    not start with 'node server.js' anymore, instead 'npm start' will kick things off

    create app on heroku, and register as a remote location...    heroku create
    push remotely to the new, heroku, location...                 git push heroku

    we now have a URL we can use,  https://sleepy-atoll-58646.herokuapp.com/
    ... or we can open the cached url on the terminal with 'heroku open'
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