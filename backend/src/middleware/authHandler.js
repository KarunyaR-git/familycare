const jwt = require('jsonwebtoken'); 
const secret_key = 'familycare_Secret'
async function authHandler(req, res, next) {
    const header = req.headers.authorization || null;
    if(header && header.startsWith('Bearer ')) {
        try{
            const token = header.split(' ')[1];
            const isValidUser = jwt.verify(token, secret_key);
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