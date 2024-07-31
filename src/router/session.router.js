import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                return res
                    .status(400)
                    .json({ message: info.message || 'Login failed' });
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error);

                const body = {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                };
                const token = jwt.sign({ user: body }, 'tokenjms', {
                    expiresIn: '1h',
                });

                return res
                    .cookie('token', token, { httpOnly: true })
                    .json({ token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ user: req.user });
    }
);

router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) return res.status(500).send('Oops');
        res.send('Deslogueado :)');
    });
});

export default router;
