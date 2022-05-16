const basic_error_response = (res,message)=>{
    res.json({
        error:true,
        message:message
    }).send()
}


module.exports.basic_error_response = basic_error_response