
const pool = require("../DB_config/postgresql")


const logConnectionClose = async (socketID, userID, socket) => {
    if(!socketID || !userID){
        return
    }

    try{
        const r = await pool.query("select * from user_connection_close($1,$2)",[ socketID, userID ])

        if(r.rowCount>0){
            r.rows.forEach( (row) =>{
                const { r_groups } = row
                socket.to(r_groups).emit("cnvo_user_offline", { r_group : r_groups, r_user_id : userID })
            })
        }

    }catch(e){
        console.log(e)
    }
}

module.exports.logConnectionClose = logConnectionClose