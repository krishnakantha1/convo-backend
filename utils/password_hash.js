const bcrypt = require("bcrypt")

const hashPassword = async (req,res,next) => {

    try{
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(req.body.password,salt)

        if(hashed){
            req.body.hashed_password = hashed
            next()
        }
    }catch(e){
        res.status(500).json({
            error:true,
            message:"error in hashing password. Please try later."
        }).send()
    }
}

module.exports.hashPassword = hashPassword