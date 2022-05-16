const {basic_error_response} = require("./error_response")

/*
logic to validate if a string is an email. can keep on adding rules if needed
*/
const notAnEmail = (email)=>{
    const posOfAt = email.indexOf('@')
    const nextPosOfAt = email.indexOf('@',posOfAt+1)
    const com = email.includes('.com')

    if(posOfAt<=0 || posOfAt==email.length-1 || nextPosOfAt!=-1 || !com){
        return true
    }

    return false
}


/*
logic to validate the json input in the body of the post request.
body must contain 3 named parameter -> username, email, password 
*/
const validateCreateUser = (req,res,next)=>{
    const {username,email,password} = req.body

    if(!username || !email || !password){
        basic_error_response(res,"required paramenter to create user missing.")

    }else if(notAnEmail(email)){
        basic_error_response(res,"email is not an email.")
    
    }else if( username.length<5 || username.length>20 ){
        basic_error_response(res,"username must be of length 5 to 20 (inclusive).")
        
    }else if(password.length<10){
        basic_error_response(res,"password must be of length 10 or greater.")
        
    }else{
        next()
    }
}

/*
logic to validate the json input in the body of the post request.
body must contain 2 named parameter -> email, password
*/
const validateLoginUser = (req,res,next)=>{
    const {email,password} = req.body

    if(!email || !password){
        basic_error_response(res,"required paramenter to login a user are missing.")

    }else{
        next()
    }
}

/*
logic to validate the json input in the body of the post request.
body must contain 1 named parameter -> token
*/
const validateJWT = (req,res,next)=>{
    const {token} = req.body

    if(!token){
        basic_error_response(res,"required paramenter to login a user are missing.")
    }else{
        next()
    }
}

const validateJoinGroupRequest = (req,res,next)=>{
    const { user_id,group_id } = req.body;

    if(!user_id || !group_id){
        basic_error_response(res,"required paramenter to join a group are missing.")
    }else{
        next()
    }
}

module.exports.validateCreateUser = validateCreateUser
module.exports.validateLoginUser = validateLoginUser
module.exports.validateJWT = validateJWT
module.exports.validateJoinGroupRequest = validateJoinGroupRequest