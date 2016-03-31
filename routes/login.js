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

router.get('/white.jpg', function(req, res) {
  res.sendFile('white.jpg');
});

router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash: true
	}));

router.get('/register', function(req, res){
  res.render('register.html',{ message: req.flash('signupMessage'),message1: req.flash('signupMessage1')});
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

router.get('/profile/edit', isLoggedIn, function(req, res){
		res.render('edit.html', { user: req.user,message: req.flash('updateMessage')});
	});

router.post('/update-customer', isLoggedIn, function(req, res){
	if(req.body.password.length < 6){
		req.flash('updateMessage', 'Please Enter a password with at least 6 characters!');
		res.redirect('/profile/edit');
		return;
	}
	var user_to_update = req.user;
	console.log(req.user.username);
	console.log(req.body.password);
	var password = user_to_update.generateHash(req.body.password);
	user_to_update.password = password;
	user_to_update.save(function(err){
		if(err)
			throw err;
		return;
	});
	console.log('user modified!');
	req.flash('updateMessage', 'Password updated!');
	res.redirect('/profile/edit');
});

router.get('/trucklist', isLoggedIn, function(req, res){
	//Find all books.
	User.find({truck: {$exists: true}},function(err, trucks) {
      if (err) {
        res.status(500).send(err);
        console.log(err);
        return;
      }
      //console.log(trucks);
      //console.log(req.params.id);
      res.render('trucklist.html', { user: req.user, trucks: turnTruckstoHtmlList(trucks)});
   });
		
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		console.log('is logged in!');
		return next();
	}
    console.log('is not logged in!');
	res.redirect('/');
}

function turnTruckstoHtmlList(trucklist){
    console.log(trucklist.length);
    var result = [];
    for(i=0;i<trucklist.length;i++){
       result.push(trucklist[i]);
    }
    return result;
  }

module.exports = router;