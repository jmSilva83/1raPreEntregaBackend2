import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { passportCall } from '../middlewares/passportCall.js';

const sessionsRouter = Router();

sessionsRouter.post('/register', passportCall('register'), async (req, res) => {
    res.send({ status: 'success', message: 'Registered' });
});

sessionsRouter.post('/login', passportCall('login'), async (req, res) => {
    console.log(req.user);
    
    const sessionUser = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role,
        id: req.user._id,
    };
    const token = jwt.sign(sessionUser, 'InToTheMatrix', {
        expiresIn: '1d',
    });
    res.cookie('Wake Up Neo...', token).send({
        status: 'success',
        message: 'logged in successfully'
    });
});

sessionsRouter.get('/current', async (req, res) => {
    if (!req.user) {
        return res
            .status(401)
            .send({ status: 'error', error: 'Not logged in' });
    }
    res.send(req.user);
});

sessionsRouter.get('/logout', async (req, res) => {
    res.clearCookie('Wake Up Neo...');
});

export default sessionsRouter;
