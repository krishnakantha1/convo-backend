const pool = require("../DB_config/postgresql")


const handleCloseGroup = async (data, socket)=>{
    const { user_id, group_id } = data

    if(!user_id || !group_id){
        socket.emit("cnvo_error", { error : true, message : "user details not present." })
        return
    }

    socket.leave( group_id )

    try{
        const r = pool.query("CALL update_user_last_seen_in_group($1,$2,$3)",[user_id,group_id,""])
    }catch(e){
        socket.emit("cnvo_error",{error:true,message:"error in connecting to Database."})
    }
}

module.exports.handleCloseGroup = handleCloseGroup