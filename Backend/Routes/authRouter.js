import { Router } from "express";
import { signupValidation, loginValidation } from '../Middlewares/Validation.js';
import { signup, login } from '../Controllers/AuthController.js';

const router = Router();

router.post('/', (req, res) => {
    res.send('Auth route');
});

router.post('/signup', signupValidation, signup);

router.post('/login', loginValidation, login);

export default router;
