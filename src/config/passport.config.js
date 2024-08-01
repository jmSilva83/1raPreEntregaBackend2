// // src/config/passport.js
// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
// import bcrypt from 'bcrypt';
// import usersModel from '../managers/mongo/models/user.model.js';

// // Estrategia de registro
// passport.use(
//     'register',
//     new LocalStrategy(
//         { usernameField: 'email', passReqToCallback: true },
//         async (req, email, password, done) => {
//             try {
//                 const { firstName, lastName, age } = req.body;
//                 const userExists = await usersModel.findOne({ email });
//                 if (userExists) {
//                     return done(null, false, {
//                         message: 'Email already taken',
//                     });
//                 }
//                 const newUser = new User({
//                     firstName,
//                     lastName,
//                     email,
//                     age,
//                     password,
//                 });
//                 await newUser.save();
//                 done(null, newUser);
//             } catch (err) {
//                 done(err);
//             }
//         }
//     )
// );

// // Estrategia de login
// passport.use(
//     'login',
//     new LocalStrategy(
//         { usernameField: 'email' },
//         async (email, password, done) => {
//             try {
//                 const user = await usersModel.findOne({ email });
//                 if (!user || !bcrypt.compareSync(password, user.password)) {
//                     return done(null, false, {
//                         message: 'Invalid credentials',
//                     });
//                 }
//                 done(null, user);
//             } catch (err) {
//                 done(err);
//             }
//         }
//     )
// );

// // Estrategia JWT
// passport.use(
//     new JWTStrategy(
//         {
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             secretOrKey: 'tokenjms',
//         },
//         async (payload, done) => {
//             try {
//                 const user = await usersModel.findById(payload.id);
//                 if (!user) {
//                     return done(null, false);
//                 }
//                 done(null, user);
//             } catch (err) {
//                 done(err);
//             }
//         }
//     )
// );

import passport from 'passport';
import local from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { usersService } from '../managers/index.js';
import AuthService from '../services/AuthService.js';

const LocalStrategy = local.Strategy;

const initializePassportConfig = () => {
    passport.use(
        'register',
        new LocalStrategy(
            { usernameField: 'email', passReqToCallback: true },
            async (req, email, password, done) => {
                const { firstName, lastName, birthDate } = req.body;
                if (!firstName || !lastName) {
                    return done(null, false, { message: 'Incomplete values' });
                }
                const user = await usersService.getUserByEmail(email);
                if (user) {
                    return done(null, false, {
                        message: 'User already exists',
                    });
                }
                let parsedDate;
                if (birthDate) {
                    parsedDate = new Date(birthDate).toISOString();
                }
                const authService = new AuthService();
                const hashedPassword = await authService.hashPassword(password);
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    birthDate: parsedDate,
                    password: hashedPassword,
                };
                const result = await usersService.createUser(newUser);
                return done(null, result._id);
            }
        )
    );

    passport.use(
        'login',
        new LocalStrategy(
            { usernameField: 'email' },
            async (email, password, done) => {
                const user = await usersService.getUserByEmail(email);
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect credentials',
                    });
                }
                const authService = new AuthService();
                const isValidPassword = await authService.validatePassword(
                    password,
                    user.password
                );
                if (!isValidPassword) {
                    return done(null, false, {
                        message: 'Incorrect credentials',
                    });
                }
                //Ya no creo la sesión aquí
                return done(null, user._id);
            }
        )
    );

    passport.use(
        'github',
        new GithubStrategy(
            {
                clientID: 'v23linKW8MDiEVRiESo',
                clientSecret: '31d834c46c4cdbdc77148bf22fbeb4ac21ace8d8',
                callbackURL:
                    'http://localhost:8080/api/sessions/githubcallback',
            },
            async (token, refreshToken, profile, done) => {
                console.log(profile);
                const userInfo = profile._json;
                if (!userInfo) {
                    return done(null, false, {
                        message: 'Error loging from Github',
                    });
                }
                const user = await usersService.getUserByEmail(userInfo.email);
                //si el usuario ya existe
                if (user) {
                    return done(null, user._id);
                }
                const newUser = {
                    firstName: userInfo.name.split(' ')[0],
                    lastName: userInfo.name.split(' ')[1],
                    password: '',
                    email: userInfo.email,
                };
                const result = await usersService.createUser(newUser);
                return done(null, result._id);
            }
        )
    );

    passport.serializeUser((userId, done) => {
        //Serializar un usuario significa, brindar el dato necesario para que passport pueda OBTENER después al usuario completo
        done(null, userId);
    });
    passport.deserializeUser(async (userId, done) => {
        const user = await usersService.getUserById(userId);
        const userSession = {
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
        };
        done(null, userSession);
    });
};

export default initializePassportConfig;
