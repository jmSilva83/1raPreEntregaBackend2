import BaseRouter from './BaseRouter.js';
import jwt from 'jsonwebtoken';
import { passportCall } from '../middlewares/passportCall.js';

class SessionsRouter extends BaseRouter {
    init() {
        this.post(
            '/register',
            ['PUBLIC'],
            passportCall('register'),
            (req, res) => {
                res.sendSuccess('Registered successfully');
            }
        );

        this.post(
            '/login',
            ['PUBLIC'],
            passportCall('login'),
            async (req, res) => {
                console.log(req.user);
                const sessionUser = {
                    name: `${req.user.firstName} ${req.user.lastName}`,
                    role: req.user.role,
                    id: req.user._id,
                };
                const token = jwt.sign(sessionUser, 'InToTheMatrix', {
                    expiresIn: '1d',
                });
                res.cookie('Wake Up Neo...', token).sendSuccess(
                    'Logged in successfully'
                );
            }
        );

        this.get('/current', ['USER'], (req, res) => {
            if (!req.user) {
                return res.sendUnauthorized();
            }
            res.sendSuccess('User data retrieved successfully', req.user);
        });

        this.get('/logout', ['USER'], async (req, res) => {
            res.clearCookie('Wake Up Neo...');
            res.redirect('/');
        });
    }
}

const sessionsRouter = new SessionsRouter();
export default sessionsRouter.getRouter();
