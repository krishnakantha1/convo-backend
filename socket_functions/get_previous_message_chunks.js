const pool = require("../DB_config/postgresql")

const handleGetPreviousMessageChunks = async (data,socket)=>{
    const { re_gtoken, user_id, group_id, oldest_message_id } = data

    if( !re_gtoken || !user_id || !group_id || !oldest_message_id ){
        socket.emit("cnvo_error",{error:true,message:"user details not present."})
        return
    }

    try{
        const r = await pool.query("select * from get_message_chunks($1,$2,$3)",[user_id, group_id, oldest_message_id])

        socket.emit("cnvo_previous_message_chunks_of_group",{re_gtoken, data : r.rows})
    }catch(e){
        socket.emit("cnvo_error",{error:true,message:"error in connecting to Database."})
    }
}

module.exports.handleGetPreviousMessageChunks = handleGetPreviousMessageChunks