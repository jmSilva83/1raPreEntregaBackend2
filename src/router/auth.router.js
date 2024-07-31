import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userModel from '../managers/mongo/models/user.model.js';
import passport from 'passport';

const router = Router();

// Registro de usuarios
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, age, password, cart, role } =
            req.body;
        const user = new userModel({
            firstName,
            lastName,
            email,
            age,
            password,
            cart,
            role,
        });
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Login de usuarios
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign(
        { id: user._id, role: user.role },
        'tokenjms',
        { expiresIn: '1h' }
    );
    res.cookie('jwt', token, { httpOnly: true });
    res.send('Login successful');
});

// Ruta protegida para obtener datos del usuario actual
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json(req.user);
    }
);

export default router;
