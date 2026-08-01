const jwt = require('jsonwebtoken'); 
async function authHandler(req, res, next) {
    const header = req.headers.authorization || null;
    if(header && header.startsWith('Bearer ')) {
        try{
            const token = header.split(' ')[1];
            const isValidUser = jwt.verify(token, process.env.JWT_SECRET);
            req.user = isValidUser;
            return next();
        } catch(err) {
            const error = new Error('Unauthorized access');
            error.statusCode = 401;
            return next(error); 
        }
    } else {
        const error = new Error('Unauthorized access');
        error.statusCode = 401;
        return next(error);
    }
}

module.exports = authHandler;