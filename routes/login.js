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
	if(!req.user.truck.name){
		res.render('edit.html', { user: req.user,message: req.flash('updateMessage')});
	}else{
		res.render('update.html', { user: req.user,message: req.flash('updateMessage')});
	}
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

router.post('/update-seller', isLoggedIn, function(req, res){
	var user_to_update = req.user;

	console.log(req.body);
    user_to_update.truck.name = req.body.name;
    user_to_update.truck.address = req.body.address;
    user_to_update.truck.hours = req.body.hour;
    user_to_update.truck.phone = req.body.phone;
    user_to_update.truck.type_of_food = req.body.type;
	
	user_to_update.save(function(err){
		if(err)
			throw err;
		return;
	});

	console.log('user modified!');
	req.flash('updateMessage', 'User info Updated!');
	res.redirect('/profile/edit');
});

router.post('/update-menu', isLoggedIn, function(req, res){
	//var user_to_update = req.user;
	//console.log(req.user);
	var menu = [];
	User.findOne({'username': req.user.username}, function(err, user_to_update) {
	    if (err) {
	      res.status(500).send(err);
	      console.log(err);
	      return;
	    }
	    if (!user_to_update) {
	      res.status(404).send('Not found.');
	      return;
	    }
		for(var param in req.body){
		//var menu = JSON.stringify(req.body[param]).split(",");
    	var menuitem = {};
    	menuitem.food = req.body[param][0];
    	menuitem.price = req.body[param][1];
    	//console.log(menuitem);
    	menu.push(menuitem);
	    }
	    console.log(menu);
	    user_to_update.truck.menu = menu;
	    user_to_update.save(function(err){
			if(err)
				throw err;
			return;
		});

	    console.log('user\'s menu updated!');
	    req.flash('updateMessage', 'Menu updated!');
	    res.redirect('/profile/edit');
	});		
});

router.get('/trucklist', isLoggedIn, function(req, res){
	//Find all books.
	User.find({'truck.name': {$exists: true}},function(err, trucks) {
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

router.get('/menu/:name', isLoggedIn, function(req, res){
   var truckname = req.params.name;
   User.findOne({'truck.name': truckname}, function(err, truck) {
    if (err) {
      res.status(500).send(err);
      console.log(err);
      return;
    }

    // If the book is not found, we return 404.
    if (!truck) {
      res.status(404).send('Not found.');
      return;
    }

    // If found, we return the info.
    //console.log(truck); 
    res.render('menu.html', { user: req.user, truck: truck});
  });
});

router.post('/addcomment/:name', isLoggedIn, function(req, res){
    var truckname = req.params.name;
    console.log(truckname);
    if(req.body.comment){
    	User.findOne({'truck.name': truckname}, function(err, truck) {
		    if (err) {
		      res.status(500).send(err);
		      console.log(err);
		      return;
		    }
		    if (!truck) {
		      res.status(404).send('Not found.');
		      return;
		    }

		    var comment = {user: req.user.username, body: req.body.comment, date: Date.now()};	
			truck.truck.comments.push(comment);
			truck.save(function(err){
				if(err)
					throw err;
				return;
			    });
				console.log(req.body.comment + ' comment added!');
				res.redirect('/menu/' + truckname);
			
			});	
	}else{
		var truck_edit = req.truck;
		console.log('NO comment !!!');
		res.redirect('/menu/' + truck_edit.truck.name);
	}
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