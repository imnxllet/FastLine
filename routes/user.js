var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var userSchema = new Schema({
  username:  String,
  password: String,
  info:[{name: String, address: String, hours: String, phone: Number}],
  profilePic: { data: Buffer, contentType: String },
  rating: Number,
  comments: [{ truck: String, body: String, date: Date }],
  comment_rating:[{ truck: String, rate: Number, date: Date }]
  user_type: String,
  type_of_food: String,
  menu: [{ price: Number, food: String }],
  history: [{truck: String, quantity: Number, food: String, amount: Number, date: Date }],
});

var User = mongoose.model('User', userSchema);


//add method below.

module.exports = User;