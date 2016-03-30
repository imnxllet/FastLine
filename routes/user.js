var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

mongoose.connect('localhost:27017/csc309', {
  user: '',
  pass: ''
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Connected to MongoDB');
});


var userSchema = new Schema({
  username:  String,
  password: String,
  comments: [{ truck: String, body: String, date: Date }],
  comment_rating:[{}],
  history: [{truck: String, quantity: Number, food: String, amount: Number, date: Date }],
  facebook: {
    id: String,
  },
  truck:{name: String, 
    address: String, 
    hours: String, 
    phone: Number, 
    rating: Number, 
    type_of_food: String,
  menu: [{ price: Number, food: String }]}
});



userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
  if(!this.password){
    return false;
  }

  return bcrypt.compareSync(password, this.password);
}

var User = mongoose.model('User', userSchema);

/*console.log(new User());
var testUser = new User();
          testUser.username = 'test@test.com';
          testUser.password = testUser.generateHash('testtest');
          testUser.truck.name = 'mi';*/


/*testUser.save(function (err) {
    if (err) {
      console.log(err);
      return;
    }});

console.log('usersave!/');*/

/*User.findById(testUser._id, function(err, user) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('\n\n Found book instance: ' + user);
 });*/
 

module.exports = User;