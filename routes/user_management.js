const router = require("express").Router()



const { validateCreateUser,validateLoginUser,validateJWT } = require("../utils/body_data_validator")
const { createIDfromUser } = require("../utils/create_id")
const { hashPassword } = require("../utils/password_hash")
const { RegisterUser } = require("../DB_handle_functions/user_register")
const { loginUser } = require("../DB_handle_functions/user_login")
const { parseToken } = require("../utils/JWT") 


router.route("/register").post(
    validateCreateUser,
    createIDfromUser,
    hashPassword,
    RegisterUser
)

router.route("/login").post(
    validateLoginUser,
    loginUser
)

router.route("/login-with-jwt").post(
    validateJWT,
    parseToken,
    loginUser
)


module.exports.userManagement = router