import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyUser = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        req.user = null;
        return next();
    }
    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        req.user = null;
        next();
    }
};

export default verifyUser;
