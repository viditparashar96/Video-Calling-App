var mongoose = require("mongoose")

const plm = require("passport-local-mongoose")

mongoose.connect("mongodb+srv://viditsharma818:Terabaapbc1@cluster0.psozdat.mongodb.net/user?retryWrites=true&w=majority").then(()=>{
  console.log("connection successful")
}).catch((err)=>{
  console.log("connection Unsuccessful: ",err.message)

})


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