const jwt = require("jsonwebtoken");
const { basic_error_response } = require("./error_response");

const packUser = (user) => {
    const userData = {
      username: user.username,
      email: user.email,
      password: user.password,
    };
    let token = jwt.sign(userData, process.env.PRIVATEKEY);
    return {
      token,
      username: user.username,
      id: user.id,
    };
};

const parseToken = (req,res,next)=>{
    const { token } = req.body

    try{
        const dataFromToken = jwt.verify(token, process.env.PRIVATEKEY)
        req.body.email = dataFromToken.email
        req.body.password = dataFromToken.password

        next()
    }catch(e){
        basic_error_response(res,"wrong token")
    }



}


module.exports.packUser = packUser
module.exports.parseToken = parseToken


