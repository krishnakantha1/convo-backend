const pool = require("../DB_config/postgresql")

const { createIDfromGroupName } = require("../utils/create_id")

const handleCreateGroup = async ( data, socket ) => {
    const { userID, group_name, group_about } = data

    if(!userID || !group_name){
        socket.emit("cnvo_error",{ error : true, message : "user details not present." })
        return
    }

    group_id = createIDfromGroupName(group_name)

    try{
        const r = await pool.query("CALL create_group($1,$2,$3,$4,$5,$6)",[ userID, group_id, group_name, group_about, "", "" ])

        if(!r.rows[0].p_err_buf){
            socket.emit("cnvo_create_group_success", { group_data : { group_id, group_name, group_about } })
        }else{
            socket.emit("cnvo_create_group_error", {error : true, message : r.rows[0].p_err_buf })
        }  

    }catch(e){
        console.log(e)
        socket.emit("cnvo_error", {error : true, message : "error in connecting to Database." })
    }

}

module.exports.handleCreateGroup = handleCreateGroup