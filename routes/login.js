var express = require('express');
var router = express.Router();
var User = require('./User.js');
var passport = require('passport');
require('../config/passport.js')(passport)

/*Get home page.*/
router.get('/', function(req, res){
  res.render('login.html', { message: req.flash('loginMessage')});
});

router.get('/truck.jpg', function(req, res) {
  res.sendFile('truck.jpg');
});


router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash: true
	}));

router.get('/register', function(req, res){
  res.render('register.html',{ message: req.flash('signupMessage')});
});

router.post('/signup-customer', passport.authenticate('local-signup-customer', {
	successRedirect: '/home',
	failureRedirect: '/register',
	failureFlash: true
}));

router.post('/signup-seller', passport.authenticate('local-signup-seller', {
	successRedirect: '/home',
	failureRedirect: '/register',
	failureFlash: true
}));

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/home',
                                      failureRedirect: '/' }));


router.get('/home', isLoggedIn, function(req, res){
		res.render('index.html', { user: req.user });
	});
 //res.send('Username '+ username+ ' password '+ password);

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

router.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.html', { user: req.user });
	});


function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		console.log('is logged in!');
		return next();
	}
    console.log('is not logged in!');
	res.redirect('/');
}

module.exports = router;