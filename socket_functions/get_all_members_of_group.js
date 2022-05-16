const pool = require("../DB_config/postgresql");


const handleGetAllUsers = async (data, socket)=> {
    const { r_token, group_id } = data
    
    if(!group_id){
        socket.emit("cnvo_error",{ error : true, message : "user details not present." })
        return;
    }

    try{
        const r = await pool.query("select * from get_online_user_for_group($1)",[group_id])

        socket.emit("cnvo_all_members_of_group",{ r_token, r_members : r.rows })
    }catch(e){
        console.log(e)
        socket.emit("cnvo_error", {error : true, message : "error in connecting to Database." })
    }
}

module.exports.handleGetAllUsers = handleGetAllUsers