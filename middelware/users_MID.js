function isValidId(req, res, next){
    let id = parseInt(req.params.id);
    if(isNaN(id) || id <= 0){
        res.status(400).json({message: "invalid id"});
        return;
    }
    req.params.id = id;
    next();
}

module.exports = {isValidId};