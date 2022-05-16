const pool = require("../DB_config/postgresql")

const { basic_error_response } = require("../utils/error_response")
const { packUser } = require("../utils/JWT")


const RegisterUser = async (req,res)=>{
    const {userid,username,email,password,hashed_password} = req.body
    
    pool.query("call create_user_with_details($1,$2,$3,$4,$5,$6)",[userid,username,email,hashed_password,"",""]).then(({rows:[{p_msg,p_err_buf}]})=>{
        if(p_msg && p_msg.length>0){
            const user = packUser({
                username:username,
                email:email,
                password:password,
                id:userid
            })

            res.json({
                error:false,
                data:user
            })
        }else{
            basic_error_response(res,p_err_buf)
        }
    })
    .catch((e)=>{
        basic_error_response(res,"problem occured in DB server. try again later")
        console.log(e)
    })
}


module.exports.RegisterUser = RegisterUser