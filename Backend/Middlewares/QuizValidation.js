import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyUser = (req, res, next) => {
    const auth = req.headers['authorization'];
    //console.log('Authorization Header:', auth);
    if (!auth) {
        req.user = null;
        return next();
    }
    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET_KEY);
        //console.log('Decoded JWT:', decoded);
        req.user = decoded;
        next();
    } catch (err) {
        req.user = null;
        next();
    }
};

export default verifyUser;
