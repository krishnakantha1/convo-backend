const express = require("express");

const http = require("http");
const socketIO = require("socket.io");

const env = require("dotenv");
const cors = require("cors");

env.config({ path: "./.env" });

const pool = require("./DB_config/postgresql");
//postgres://ndqtlwfhcbtvoj:6940174e66b5d5491d0c9a84ad7d1ddaabf21e6cdecb2b1b9e7d91dd032dba88@ec2-54-225-214-37.compute-1.amazonaws.com:5432/dcsgt2a34v1or8


const app = express();
app.use(cors());
app.use(express.json());


//--------------------------------------------------------------------
const {userManagement} = require("./routes/user_management")
app.use("/users/",userManagement);
//---------------------------------------------------------------------

app.get("/",(req,res)=> res.json({
  status: "up and running",
  dbms_url : process.env.DATABASE_URL
}))

const server = http.createServer(app);

const io = socketIO(server,{
  cors: {
    origin: "*",
    methods: ["GET"]
  }
});


const { logUser } = require("./socket_functions/log_user")
const { getGroups } = require("./socket_functions/get_groups")
const { handleNewMessage } = require("./socket_functions/create_new_message")
const { handleGetLatestMessages } = require("./socket_functions/get_latest_messages")
const { handleGetPreviousMessageChunks } = require("./socket_functions/get_previous_message_chunks")
const { handleCreateGroup } = require("./socket_functions/create_new_group")
const { handleJoinGroup } = require("./socket_functions/join_group")
const { handleCloseGroup } = require("./socket_functions/user_closed_group")
const { handleGetAllUsers } = require("./socket_functions/get_all_members_of_group")
const { logConnectionClose } = require("./socket_functions/log_connection_close")
const { handleLeaveGroup } = require("./socket_functions/leave_group")

io.on("connection",(socket)=>{
  
  logUser(socket.id,socket.handshake.query.user_id,socket)


  // data -> { userId }
  socket.on("cnvo_get_groups_for_user",(data)=>{
      if(data.userID){
        g_userId = data.userID
      }
      getGroups(data,socket)
  })

  // data -> { userID, group_id, message_text, reply_id(*optional*) }
  socket.on("cnvo_new_user_message", (data) => handleNewMessage(data, socket, io))

  socket.on("cnvo_get_latest_messages", (data) => handleGetLatestMessages(data, socket))

  socket.on("cnvo_get_previous_message_chunks", (data) => handleGetPreviousMessageChunks(data, socket))

  socket.on("cnvo_create_group_for_user", (data) => handleCreateGroup(data, socket))

  socket.on("cnvo_join_group_for_user", (data) => handleJoinGroup(data, socket))

  socket.on("cnvo_user_closed_group", (data) => handleCloseGroup(data, socket))

  socket.on("cnvo_get_members_for_group", (data) => handleGetAllUsers(data, socket))

  socket.on("cnvo_user_leave_group", (data) => handleLeaveGroup(data, socket))

  socket.on("disconnecting", ()=> {
        const group_id = Array.from(socket.rooms).find((g) => g.startsWith("GROUP#"))
        const g_userId = socket.handshake.query.user_id
        
        if( group_id && g_userId ){
          handleCloseGroup({ user_id : g_userId, group_id }, socket)
        }

        logConnectionClose(socket.id, socket.handshake.query.user_id, socket)

      })
})


const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
  pool.query("truncate table cnvo_user_connections cascade")
});
