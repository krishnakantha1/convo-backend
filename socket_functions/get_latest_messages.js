const pool = require("../DB_config/postgresql")

/*
    data -> {
                user_id,
                group_id,
                re_gtoken
            }
*/
const handleGetLatestMessages = async (data, socket) => {
    const { user_id, group_id, re_gtoken } = data

    if(!group_id || !user_id || !re_gtoken){
        socket.emit("cnvo_error", { error : true, message : "user details not present." })
        return
    }

    try{
        const r = await pool.query("select * from get_latest_message($1,$2)",[user_id, group_id])

        /*
            parameter position as per function -> 
                1) r_message_id
                2) r_user_id    
                3) r_user_name 
                4) r_group_id   
                5) r_message_text   
                6) r_message_type   
                7) r_message_created_on 
                8) r_replyed_message_id
                9) r_replyed_message_user_id
                10) r_replyed_message_username
                11) r_replyed_message_text

                12) success_message
                13) error_message

                NOTE: All are inout parameters. so expect the result to have same names as columns.
        */
        socket.join(group_id);
        socket.emit("cnvo_latest_messages_of_group",{data:r.rows, re_gtoken})
    }catch(e){
        socket.emit("cnvo_error",{error:true,message:"error in connecting to Database."})
    }
}

module.exports.handleGetLatestMessages = handleGetLatestMessages