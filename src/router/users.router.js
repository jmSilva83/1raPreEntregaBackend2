import { Router } from 'express';
import { usersService } from '../managers/index.js';

const router = Router();

router.get('/', async (req, res) => {
    const result = await usersService.getUsers();

    res.send({ status: 'success', payload: result });
});

router.post('/', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        res.status(400).send({ status: 'error', error: 'Incomplete values' });
    }

    const newUser = {
        firstName,
        lastName,
        email,
        password,
    };

    const result = await usersService.createUser(newUser);
    res.send({ status: 'success', payload: result });
});

export default router;
