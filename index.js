const express = require('express');
const path=require('path');
const cors = require('cors')
const sessions = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config({ path: '.env' })

var db = require('./config/db');
var api_paths = require('./routes/api_routes');

const app = express();

const port = process.env.PORT || 3000;


app.set('view engine','ejs');

app.use(cors())

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    resave: false,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://biswajit_dev_01:biswajitdev@cluster0.oodta.mongodb.net/twitter_posts?retryWrites=true&w=majority' }),
    cookie:{expires:false}
}));

app.use(express.urlencoded({extended:false}))

app.use('/', api_paths.route);

app.use('/static',express.static(path.join(__dirname,'public')));

app.use('*', function (req, res) {
    res.status(404).json({
        success: 'false',
        message: 'Page not found',
        error: {
            statusCode: 404,
            message: 'You reached a route that is not defined on this server',
        },
    });
});


app.listen(port, function () {
    db.connect.then(async () => {
            console.log(path.join(__dirname,'public'))
            console.log('Connection has been established successfully.');
            console.log(`\nServer listening on port ${port} \nvisit http://localhost:${port}`);
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            console.log(`\nServer listening on port ${port} \nvisit http://localhost:${port}`);
            process.exit(1);
        });

})