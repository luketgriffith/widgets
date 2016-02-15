var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  gravatar: {type: String, default: ''}
});

UserSchema.methods.picture = function(size){
  if(!this.size) size = 200;
  if(!this.name) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.name).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro'
}

module.exports = mongoose.model('User', UserSchema);