const pool = require("../DB_config/postgresql")


/*
   data = { userId }
*/
const getGroups = async (data,socket) => {
    const { userID } = data

    //userID not present in request
    if(!userID){
      socket.emit("cnvo_error",{error:true,message:"user details not present."})
      return  
    }

    try{
      const r = await pool.query("select * from get_groups_for_user($1)",[userID])
      /* 
        data = [{group_id, group_name, about}...]
      */
      socket.emit("cnvo_user_groups",{group_list:r.rows})
    }catch(e){
       socket.emit("cnvo_error",{error:true,message:"error in connecting to Database."})
    }
   
}


module.exports.getGroups = getGroups