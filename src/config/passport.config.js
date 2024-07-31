// src/config/passport.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import usersModel from '../managers/mongo/models/user.model.js';

// Estrategia de registro
passport.use(
    'register',
    new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        async (req, email, password, done) => {
            try {
                const { first_name, last_name, age } = req.body;
                const userExists = await usersModel.findOne({ email });
                if (userExists) {
                    return done(null, false, {
                        message: 'Email already taken',
                    });
                }
                const newUser = new User({
                    first_name,
                    last_name,
                    email,
                    age,
                    password,
                });
                await newUser.save();
                done(null, newUser);
            } catch (err) {
                done(err);
            }
        }
    )
);

// Estrategia de login
passport.use(
    'login',
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await usersModel.findOne({ email });
                if (!user || !bcrypt.compareSync(password, user.password)) {
                    return done(null, false, {
                        message: 'Invalid credentials',
                    });
                }
                done(null, user);
            } catch (err) {
                done(err);
            }
        }
    )
);

// Estrategia JWT
passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'tokenjms',
        },
        async (payload, done) => {
            try {
                const user = await usersModel.findById(payload.id);
                if (!user) {
                    return done(null, false);
                }
                done(null, user);
            } catch (err) {
                done(err);
            }
        }
    )
);
