var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
var userdata = require("./users")
var passport = require("passport")
const localStrategy = require("passport-local")
// var ExpressPeerServer = require('peer').ExpressPeerServer;
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true, // Set to true for debugging
});

passport.use(new localStrategy(userdata.authenticate()))

// var options = {
//   debug: true
// }
var server = require('http').createServer(router);



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/home', function(req, res, next) {
  res.render('index');
});


router.get('/profile',async (req,res,next)=>{
  try {
    var loggedInUser= await userdata.findOne({username:req.session.passport.user})
    res.render("profile",{loggedInUser})
    // console.log(loggedInUser)
  } catch (error) {
    console.log(error)
  }

  
})


router.post('/register', function(req, res, next) {
  
  var userdets= new userdata({
   username:req.body.username,
   name:req.body.name,

  })
 userdata.register(userdets,req.body.password)
 .then(function(){
   passport.authenticate("local")(req,res,function(){
     res.redirect("/profile")
    console.log("done")
   })
 })
 .catch(function(err){
  console.log(err)
 })
 });

// Login page---->
router.get("/loginpage",(req,res)=>{
  res.render('loginpage')
})


// login ===>
 router.post("/login",passport.authenticate("local",{
   successRedirect:"/profile",
   failureRedirect:"/"
 }),function(req,res){}) 

// Logout===>
router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
 
// Creating a random room id===>
router.get("/meeting",isLoggedIn, function(req, res, next) {
  const roomUuid = uuidv4();
  res.redirect(`/meeting/${roomUuid}`);
});
router.get("/meeting/:room", isLoggedIn,async function(req,res,next){
  var currentUser=await userdata.findOne({
    username:req.user.username
  })
  console.log(currentUser)
  res.render('room',{roomId:req.params.room,username:currentUser})
})
router.use('/peerjs', peerServer);


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    next()
  }
  else{
    res.redirect("/")
  }
}

module.exports = router;
