const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  username: {type:String, require: true},
  message: {type: String, require: true}
},{timestamps:true});

const Message = mongoose.model('Message',thingSchema)
module.exports = Message