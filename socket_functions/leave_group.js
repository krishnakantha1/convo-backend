const pool = require("../DB_config/postgresql")


const handleLeaveGroup = async (data, socket) => {
    const { userID, groupID } = data

    if(!userID || !groupID){
        socket.emit("cnvo_error",{error:true,message:"user details not present."})
        return
    }

    try{
        const r = await pool.query("CALL user_group_leave($1,$2,$3,$4,$5)",[userID, groupID, "", "", ""])

        if(r.rows[0].p_err_buf){
            socket.emit("cnvo_error",{error:true,message:r.rows[0].p_err_buf})
        }else{
            const { r_user_name } = r.rows[0]
            socket.broadcast.to(groupID).emit("cnvo_new_created_message", [{ r_message_type : "SYS", 
                                                                    r_message_text : `${r_user_name} Left`, 
                                                                    r_message_id : `${-Date.now()}`}]);


            socket.to(groupID).emit("cnvo_user_left",{ r_group : groupID, r_user_id : userID })

            socket.emit("cnvo_self_left_group",{ r_group : groupID })
            
        }

        

    }catch(e){
        socket.emit("cnvo_error",{error:true,message:"error in connecting to Database."})
    }
}

module.exports.handleLeaveGroup = handleLeaveGroup