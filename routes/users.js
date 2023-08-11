var mongoose = require("mongoose")

const plm = require("passport-local-mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/zoom")


var userdata = mongoose.Schema({
  name:String,
  username:String,
  password: String,
  currentSocketId:{
    type:String,
    default:""
  }
})
userdata.plugin(plm);
module.exports = mongoose.model("user",userdata)