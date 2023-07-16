const jwt = require("jsonwebtoken")

module.exports = function(req,res,next) {
    try{
       const token = req.headers.authorization.split(' ')[1];
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.body.userid=decoded.userid;
       next();
    }
    catch(error){
      res.send({
        message: error.message,
        data: error,
        success: false
      })
    }
}