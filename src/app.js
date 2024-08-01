import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import config from './config/connectionString.config.js';
import initializePassportConfig from './config/passport.config.js';

import viewsRouter from './router/views.router.js';
import productsRouter from './router/products.router.js';
import cartsRouter from './router/carts.router.js';
import sessionRouter from './router/session.router.js';
import __dirname from './utils.js';


const app = express();
const PORT = process.env.PORT || 8080;
const CONNECTION_STRING = config.MONGO_URI;
const connection = mongoose.connect(CONNECTION_STRING);
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = new Server(server);

// Setup view engine
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Middleware setup
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(session({
    secret: 'wake up Neo..',
    resave: false,
    saveUninitialized: false,
    store:MongoStore.create({
        mongoUrl: CONNECTION_STRING,
        ttl:60*60*24
    })
}))

initializePassportConfig();
app.use(passport.initialize());
app.use(passport.session());

// Routes setup
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/', viewsRouter);

app.use('*', (req, res) => {
    res.status(404).render('404');  
});

io.on('connection', (socket) => {
    console.log('Socket connected');
});
