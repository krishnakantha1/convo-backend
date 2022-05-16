
const createIDfromUser = (req,res,next) =>{
    req.body.userid = getIDfromString(req.body.username,"")
    next()
}


const getIDfromString = (strData,prefix)=>{
    const now = Date.now().toString()
    const space = 'aBcDeFgHij'
    const arr = []
    for(let i=0;i<now.length;i++){
        arr.push(space[now[i]])
    }

    return prefix+strData.split(" ").join("_")+'#'+arr.join('')
}

const createIDfromGroupName = (strData)=>{
    return getIDfromString(strData,"GROUP#")
}

module.exports.createIDfromUser = createIDfromUser
module.exports.createIDfromGroupName = createIDfromGroupName