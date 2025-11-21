function isValidId(req, res, next){
    let id = parseInt(req.params.id);
    if(isNaN(id) || id <= 0){
        res.status(400).json({message: "invalid id"});
        return;
    }
   
    req.params.id = id;
    next();
}

function valuesToUpdate(req, res, next){
    const allowedFields = ['name', 'email'];
    const obj = {};
    allowedFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
            obj[field] = req.body[field];
        }
    });

    const keys = Object.keys(obj);
    if (keys.length === 0) {
        return res.status(400).json({message: "no values to update"});
    }

    req.updateFields = obj;
    next();
}




function isValidUserUpdate(req, res, next){
    let {name, email} = req.body;
    if(!name && !email){
        res.status(400).json({message: "name or email are required"});
        return;
    }
    next();
}


module.exports = {isValidId, valuesToUpdate, isValidUserUpdate};