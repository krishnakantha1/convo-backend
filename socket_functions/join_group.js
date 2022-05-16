const pool = require("../DB_config/postgresql");


const handleJoinGroup = async (data, socket) => {
    const { userID , group_id } = data

    if(!userID || !group_id){
        socket.emit("cnvo_error",{ error : true, message : "user details not present." })
        return;
    }

    try{
        const r = await pool.query("call user_join_group($1,$2,$3,$4,$5,$6,$7)",[ userID, group_id, "", "", "", "" ,"" ])

        if(!r.rows[0].p_err_buf){
            const { p_gid, p_user_name, p_group_name, p_about } = r.rows[0]
            socket.broadcast.to(p_gid).emit("cnvo_new_created_message", [{ r_message_type : "SYS", 
                                                                    r_message_text : `${p_user_name} Joined`, 
                                                                    r_message_id : `${-Date.now()}`}]);
            

            socket.emit("cnvo_join_group_success", { group_data : { group_id : p_gid, group_name : p_group_name, group_about : p_about } })
            
            socket.to(p_gid).emit("cnvo_user_online",{ r_group : p_gid, r_data : { r_group_id : p_gid,
                                                                                    r_user_id : userID,
                                                                                    r_user_name : p_user_name,
                                                                                    r_status : true
                                                                                 } })
        }else{
            socket.emit("cnvo_join_group_error", {error : true, message : r.rows[0].p_err_buf })
        }
    }catch(e){
        console.log(e)
        socket.emit("cnvo_error", {error : true, message : "error in connecting to Database." })
    }
}

module.exports.handleJoinGroup = handleJoinGroup