import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Ruta para mostrar el perfil
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.render('profile', { user: req.user });
});

// Ruta para actualizar el perfil
router.post('/profile/update', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { firstName, lastName, email, birthDate, password } = req.body;
    // Lógica para actualizar el perfil del usuario en la base de datos
    // ...
    res.redirect('/profile');
});

export default router;
