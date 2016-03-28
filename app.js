var express = require('express');
var app = express();
//var expressValidator = require('express-validator')
var login = require('./routes/login.js');
// set views path, template engine and default layout
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');

//serve static file.
app.use(express.static('public/images'));
/*var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(expressValidator());*/ // this line must be immediately after express.bodyParser()!


//get the index page
app.use('/', login);

//getting the value from a Form input
/*app.post('/signup', function(req, res){

    req.assert('userName', 'User Name is required').notEmpty();   
    req.assert('userPass', 'A password is required').notEmpty();     


    var errors = req.validationErrors();
    var mappedErrors = req.validationErrors(true);

    var myerror1 = mappedErrors.userName.msg;
    var myerror2 = mappedErrors.userPass.msg;

   res.render('serverSideValidation',{errors: {error1: myerror1, error2: myerror2}});
});*/

app.listen(3000);

console.log('Server running on http://localhost:3000');


