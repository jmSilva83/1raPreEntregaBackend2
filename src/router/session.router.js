// import { Router } from 'express';
// import passport from 'passport';
// import jwt from 'jsonwebtoken';
// import { usersService } from '../managers/index.js';
// import AuthService from '../services/AuthService.js';

// const sessionRouter = Router();

// sessionRouter.post('/register', async (req, res, next) => {
//     const { firstName, lastName, email, age ,password } = req.body;
//     if (!firstName || !lastName || !email || !password) {
//         res.status(400).send({ status: 'error', error: 'Incomplete values' });
//     }
//     const user = await usersService.getUserByEmail(email);
//     if (user) {
//         return res.status(400).send({status:'error',error:'User already exists'})
//     };
//     let parsedDate;
//     if (age) {
//         parsedDate = new Date(age).toISOString();
//     }
//     const authService = new AuthService()
//     const hashedPassword = await authService.hashPassword(password);
//     const newUser = {
//         firstName,
//         lastName,
//         email,
//         age:parsedDate,
//         password:hashedPassword
//     };

//     const result = await usersService.createUser(newUser);
//     res.send({ status: 'success', message:'Registered', payload: result });
// });

// sessionRouter.post('/login', (req, res, next) => {
//     passport.authenticate('login', async (err, user, info) => {
//         try {
//             if (err || !user) {
//                 return res
//                     .status(400)
//                     .json({ message: info.message || 'Login failed' });
//             }
//             req.login(user, { session: false }, async (error) => {
//                 if (error) return next(error);

//                 const body = {
//                     id: user._id,
//                     email: user.email,
//                     role: user.role,
//                 };
//                 const token = jwt.sign({ user: body }, 'tokenjms', {
//                     expiresIn: '1h',
//                 });

//                 return res
//                     .cookie('token', token, { httpOnly: true })
//                     .json({ token });
//             });
//         } catch (error) {
//             return next(error);
//         }
//     })(req, res, next);
// });

// sessionRouter.get('/logout', (req, res) => {
//     req.session.destroy((error) => {
//         if (error) return res.status(500).send({status:'error',error:"Couldn't close session"});
//         res.redirect('/login')
//     });
// });

// sessionRouter.get(
//     '/current',
//     passport.authenticate('jwt', { session: false }),
//     (req, res) => {
//         res.json({ user: req.user });
//     }
// );


// export default sessionRouter;


import { Router } from "express";

import { usersService } from "../managers/index.js";
import AuthService from "../services/AuthService.js";
import passport from "passport";

//Un router de session se suele utilizar para operaciones concernientes a la sesión del usuario como:
// Registro, Login, ThirdPartyAuth, Current (Acceder a la info de la sesión actual);

const sessionsRouter = Router();

sessionsRouter.post('/register',passport.authenticate('register',{failureRedirect:'/api/sessions/registerFail',failureMessage:true}),async(req,res)=>{
    res.send({status:"success",message:"Registered"})
})
sessionsRouter.get('/registerFail',(req,res)=>{
    console.log("Algo tronó");
    res.send("error");
})

sessionsRouter.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/failureLogin',failureMessage:true}),async(req,res)=>{
    res.send({status:"success",message:"logged in"});
})

sessionsRouter.get('/failureLogin',(req,res)=>{
    console.log(req.session);
    if(req.session.messages.length>4){
        //Aquí implemento lógica de bloqueo.
        return res.send("Excediste el número de intentos fallidos")
    }
    res.send("error");
})

sessionsRouter.get('/github',passport.authenticate('github'),(req,res)=>{})

sessionsRouter.get('/githubcallback',passport.authenticate('github'),(req,res)=>{
    res.redirect('/profile');
})

sessionsRouter.get('/current',async(req,res)=>{
    if(!req.user){
        return res.status(401).send({status:"error",error:"Not logged in"});
    }
    res.send(req.user);
})

sessionsRouter.get('/logout',async(req,res)=>{
    console.log("Ok");
    req.session.destroy(error=>{
        if(error) return res.status(500).send({status:"error",error:"Couldn't close session"})
            res.redirect('/login')
        })
})

export default sessionsRouter;