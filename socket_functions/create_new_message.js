const pool = require("../DB_config/postgresql")

// data -> { userID, group_id, message_text, reply_id(*optional*) }
const handleNewMessage = async (data, socket, io)=>{
    const { userID, group_id, message_text, replyed_to_message_id } = data
    if(!userID || !group_id || !message_text){
        socket.emit("cnvo_error",{error:true,message:"mandotory required data to save message is missing."})
        return
    }

    try{ 
         /*
            parameter position as per procedure -> 
                1) r_message_id
                2) r_user_id    [req]
                3) r_user_name 
                4) r_group_id   [req]
                5) r_message_text   [req]
                6) r_message_type   [req]
                7) r_message_created_on 
                8) r_replyed_message_id
                9) r_replyed_message_user_id
                10) r_replyed_message_username
                11) r_replyed_message_text

                12) success_message
                13) error_message

                NOTE: All are inout parameters. so expect the result to have same names as columns.
        */
        const r = await pool.query("CALL insert_new_message($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
                        [null,userID,"",group_id,message_text,(replyed_to_message_id?"RPLY":"MSG"),null,replyed_to_message_id,null,null,null,null,null])
        /*
            returned message -> same as above format.
        */
        if(r.rows[0].p_err_buf){
            socket.emit("cnvo_error",{error:true,message:r.rows[0].p_err_buf})
        }else{
            io.in(group_id).emit("cnvo_new_created_message", r.rows)
        }
        

    }catch(e){
        console.log(e)
        socket.emit("cnvo_error",{error:true,message:"error in connecting to Database."})
    }
}


module.exports.handleNewMessage = handleNewMessage