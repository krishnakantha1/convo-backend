const bcrypt = require("bcrypt")

const pool = require("../DB_config/postgresql")
const { basic_error_response } = require("../utils/error_response")
const { packUser } = require("../utils/JWT")

//login with email and password
const loginUser = async (req,res) =>{
    const {email,password} = req.body

    try{
        //get user details from Database.
        const {rows} = await pool.query("select * from get_password($1)",[email])

        //only one will be found if user credientials are valid.
        if(rows.length===1){
            const {d_id,d_name,d_email,d_password} = rows[0]
            const password_matched = await bcrypt.compare(password,d_password)

            //given password matches the hashed password in Database.
            if(password_matched){
                //prepare responce.
                const user = packUser({
                    username:d_name,
                    email:d_email,
                    password:password,
                    id:d_id
                })

                res.json({
                    error:false,
                    data:user
                })
            }else{
                //password didnt match.
                basic_error_response(res,"email or password didnt match")
            }
        }else{
            //user credientials dosent exist.
            basic_error_response(res,"email dosent exist.")
        }
         
    }catch(e){
        //Database call has problem.
        basic_error_response(res,"problem occured in DB server. try again later")
    }
    
}

const loginUserFromJWT = async (req,res)=>{

}




module.exports.loginUser = loginUser
module.exports.loginUserFromJWT = loginUserFromJWT