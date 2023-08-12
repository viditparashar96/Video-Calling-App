const io = require( "socket.io" )();
const userSchema=require("./routes/users.js")
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on( "connection", async function( socket ) {
    console.log( "A user connected ");
    socket.on('join-room',async (roomid,peerid,loggedInUser)=>{
        // console.log(roomid ,peerid)
        socket.join(roomid)
        socket.to(roomid).emit("userconnected",peerid,loggedInUser)
        // finding the current user and adding the socket id in database-->
        var currentUser=await userSchema.findOne({
            username:loggedInUser
        })
        
        currentUser.currentSocketId = socket.id
        await currentUser.save()
        // Removal of socket id form database after logging out  -->
        socket.on("disconnect",async () => {
            currentUser.currentSocketId=""
            await currentUser.save()

            socket.to(roomid).emit("userdisconneted",peerid,loggedInUser)


        });
        console.log(currentUser)


    // chatting systummmmmmm------>
    socket.on("new-chat",(msg,name)=>{
        io.emit("newmessages",msg,name)
    })




    })

   


});
// end of socket.io logic

module.exports = socketapi;