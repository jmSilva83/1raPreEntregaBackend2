import BaseRouter from "./BaseRouter.js";

class ViewsRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], (req, res) => {
            res.render('Home');
        });

        this.get('/register', ['PUBLIC'], (req, res) => {
            res.render('Register');
        });

        this.get('/login', ['PUBLIC'], (req, res) => {
            res.render('Login');
        });

        this.get('/profile', ['USER'], (req, res) => {
            if (!req.user) {
                return res.redirect('/login');
            }
            res.render('Profile', { user: req.user });
        });

        this.get('/current', ['USER'], (req, res) => {
            if (!req.user) {
                return res.sendUnauthorized();
            }
            res.sendSuccess('User data retrieved successfully', req.user);
        });

        this.get('/logout', ['USER'], async (req, res) => {
            res.clearCookie('Wake Up Neo...');
            res.sendSuccess('Logged out successfully');
        });
    }
}

const viewsRouter = new ViewsRouter();
export default viewsRouter.getRouter();
