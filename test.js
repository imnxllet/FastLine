var assert = require('assert');
var http = require('http');
var server = require('./server');
var fs = require('fs');
var request = require('request');
var $ = require('jquery');

//read the main page file
var home = null;
fs.readFile('.login.html', function(err, data){
	if(err){
		home = 'error reading main page:' + JSON.stringify(err, null, 4);
	}
	else{
		home = data;
	}
	return;
});


describe('HTTP Server Test', function(){
  after(function(){
    server.close();
  });
  //testing displaying login page
  describe('test login page', function(){
    it('should return login page', function(done){
      http.get('http://localhost:3000', function(response){
        //assert the status code
        assert.equal(response.statusCode, 200);
        var body = '';
        response.on('data', function(d){
          body += d;
        });
        response.on('end', function(){
          assert.equal(body, home);
          //console.log(body);
          done();
        });
      });
    });
  });

	var Register = require('./config/passport.js');
	var reg = new Register(mongodb://localhost/);
	var Login = require('.routes/login.js');
	var log = new Login(mongodb://localhost/);
	//testing register&login
	describe('test buyer account', function(){
		var user = {
			email:'test@test.com',
			password:{
				plain: '1111'
			}
		}
    var 
		it('create user', function(done){
      reg.serializeUser(function(user, done){
				done();
			});
		});
		it('login successfully', function(done){
        router.get('/home', isLoggedIn, function(req, res){
      	//console.log(msg);
				if(success){done();}
			});
		});
	});
	//testing for home page
	describe('test home page', function(){
	    it('should login', function(done){
	     	userInfo = {email: 'test@test.com', password:{
	          plain:'test'
	    }};
	    var post_data = querystring.stringify({
	        'json' : JSON.stringify(userInfo)
	    });
	    var post_options = {
	       host: 'localhost',
	       port: '3000',
	       path: '/home',
	       cookie: cookie,
	       method: 'POST'
	      };
	    });
	});
	//testing for logout
	describe('test logout', function(){
    it('should logout', function(done){
      var logout = {
       host: 'localhost',
       port: '3000',
       path: '/logout',
       method: 'GET',
      };
      log.get('/logout', function(req, res){
    });
  });

});