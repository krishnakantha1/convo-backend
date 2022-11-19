const pool = require("../DB_config/postgresql");


const logUser = async (socketID, userID, socket) => {
    if(!socketID || !userID){
        return
    }

    try{
        //this query will save the user connection in DB and return the list of groups that the user is present in
        const r = await pool.query("select * from user_connection_open($1,$2)",[socketID,userID])
        
        if(r.rowCount>0){
            r.rows.forEach( (row) =>{
                const { r_group_id } = row
                socket.to(r_group_id).emit("cnvo_user_online", { r_group : r_group_id, r_data : row })
            })
        }
    }catch(e){
        console.log(e)
    }
}

module.exports.logUser = logUser