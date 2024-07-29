import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'; // Importar cookie-parser
import passport from 'passport'; // Importar passport

import authRouter from './router/auth.router.js'; // Importar las rutas de autenticación
import './config/passport.js'; // Importar la configuración de passport
import viewsRouter from './router/views.router.js';
import productsRouter from './router/products.router.js';
import cartsRouter from './router/carts.router.js';
import __dirname from './utils.js';

const app = express();
const PORT = process.env.PORT || 8080;
const CONNECTION_STRING =
    'mongodb+srv://jmsilva06:Jms30478903@clustercoliito06.yawbn0d.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=ClusterColiito06';
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
app.use(cookieParser()); // Usar cookie-parser
app.use(passport.initialize()); // Inicializar passport
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes setup
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', authRouter); // Usar las rutas de autenticación
app.use('/', viewsRouter);

io.on('connection', (socket) => {
    console.log('Socket connected');
});
