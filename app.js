import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes/route.js';
import expressEjsLayouts from 'express-ejs-layouts';
import db from './config/db.js';
import Usuarios from './models/mUser.js';
import { error } from 'console';
import flash from 'connect-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { check, validationResult } from 'express-validator';
import passport from './config/passport.js';
import Categorias from './models/mCategorias.js';
import News from './models/mNews.js';
import Courses from './models/mCursos.js';
import Comentarios from './models/mComentarios.js';


// config BD
db.sync({ alter: true })
  .then(() => console.log('DB sincronizada y conectada'))
  .catch((error) => console.log('Error al sincronizar la DB:', error));



const __dirname = path.resolve(path.dirname(new URL(import.meta.url).pathname).substring(1));

// Configura dotenv para leer el archivo .env
dotenv.config({ path: 'variables.env' });
const app= express();

// body parser leer formularios
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// validacion con bastantes funciones 


app.use(expressEjsLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key:process.env.KEY,
    resave: false,
    saveUninitialized: false,
}));

//inicializar passport

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


//Middleware (usuario logueado, flash messages fecha actual)

app.use((req,res,next)=>{
    res.locals.usuario= req.user ? {...req.user} : null;
    res.locals.mensajes= req.flash();
    const fecha= new Date();
    res.locals.year= fecha.getFullYear();
    next();
})

// routing
app.use(routes);


const port=5000;

app.listen(process.env.PORT,()=>{
    console.log(`el servidor funciona en  http://localhost:${port}`)
})