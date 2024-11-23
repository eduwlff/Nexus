import Usuarios from "../models/mUser.js";
import { check, validationResult } from 'express-validator';
import enviarEmail from "../handlers/email.js";
import multer from "multer";
import path from 'path';
import fs from 'fs';
import shortid from "shortid";

const __dirname = path.resolve(path.dirname(new URL(import.meta.url).pathname).substring(1));

// Configuración de Multer para el manejo de archivos
const configuracionMulter = {
    storage: multer.diskStorage({
        destination: (req, file, next) => {
            next(null, path.join(__dirname, '../public/MaterialesNexus/archivos/uploads/profiles/'));
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter: (req, file, next) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            next(null, true);
        } else {
            next(new Error('El archivo debe ser una imagen válida'), false);
        }
    }
};

const upload = multer(configuracionMulter).single('imagen');

const cUser={
    formCrearCuenta:(req,res)=>{
        res.render('crear-cuenta', {
            nombrePagina: 'Crea tu Cuenta'
        }
        )
    },
    crearCuenta: async (req, res)=>{
        const usuario= req.body;
        console.log(req.body);

        await check('email', 'Agrega un correo válido').isEmail().run(req);
        await check('password', 'El password no puede ir vacío').notEmpty().run(req);
        await check('confirmar', 'El password confirmado no puede ir vacío').notEmpty().run(req);
        await check('confirmar', 'El password es diferente').equals(req.body.password).run(req);

        // Manejar los errores de validación
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            const erroresExpress = errores.array().map(error => error.msg);
            console.log(erroresExpress); // Puedes manejar los errores según lo necesites
            req.flash('error', erroresExpress);
            return res.redirect('/crear-cuenta');
        }
        try {
            
            const newUser= await Usuarios.create(usuario);

            //url de confirmacion

            const url= `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;


            //enviar mail de confirmacion
            await enviarEmail({
                usuario,
                url,
                subject: 'confirma tu cuenta Nexus',
                archivo : 'confirmar-cuenta'
            });

            req.flash('exito', 'Hemos enviado un E-mail, confirma tu cuenta');  // Mensaje de éxito
            res.redirect('/iniciar-sesion');  // Asegúrate de redirigir después de crear el usuario
    
            console.log('Usuario creado', newUser);
        }
         catch (err) {
           // Asegúrate de manejar correctamente los errores de Sequelize
        if (err.name === 'SequelizeValidationError') {
            const errSequelize = err.errors.map(el => el.message); // Extrae solo los mensajes
           // console.log(errSequelize);

            req.flash('error', errSequelize);
            res.redirect('/crear-cuenta');
        } else {
            // Manejo genérico de errores
            console.error(err);
            res.status(500).send('Error al crear la cuenta');
        }
      
}
},
//confirmar sub del user

confirmarCuenta: async(req,res,next)=>{

    //verficar que el user existe

    const usuario= await Usuarios.findOne({where:{email: req.params.correo}});

    console.log(req.params.correo);
    console.log(usuario);

    //sino existe rediccioonar 
    if(!usuario){
        req.flash('error', 'no existe esa cuenta');
        res.redirect('/crear-cuenta');
        return next();
    }

    //si existe, confirmar sub y rediccionar

    usuario.activo=1;
    await usuario.save();

    req.flash('exito', 'La cuenta se ha confirmado, ya puedes iniciar sesión');
    res.redirect('/iniciar-sesion')

},


getSigninForm: async(req,res)=>{
res.render('iniciar-sesion',{
    nombrePagina : 'Iniciar Sesión'
})
},

formEditProfile: async (req,res)=>{
const user= await Usuarios.findByPk(req.user.id);
res.render('edit-profile',{
    nombrePagina: 'Editar Perfil',
    user
})
},
editProfile: async(req,res)=>{
    const user= await Usuarios.findByPk(req.user.id);
    //leer datos del form

    const {nombre,descripcion,email}= req.body;
    user.nombre=nombre;
    user.email=email;
    user.descripcion=descripcion;

    //guardar en la bd

    await user.save();
    req.flash('exito', 'Cambios Almacenados');
    res.redirect('/administracion');
},
formEditPassword: (req,res)=>{
    res.render('edit-password',{
        nombrePagina:'Cambiar Password'
    })
},

editPassword:async (req,res,next)=> {
const user= await Usuarios.findByPk(req.user.id);

//verificar password anterior
if(!user.validarPassword(req.body.anterior)){
    req.flash('error', 'El password actual es incorrecto');
    res.redirect('/administracion');
    return next();
}

// si el password es correct hashear el nuevo
const hash= user.hashPassword(req.body.nuevo);
console.log(hash);
//asignar el password hasheado 
user.password= hash;
// grabar en la bd
await user.save();
//rediccionar

req.flash('exito', 'Password Modificado Correctamente');
res.redirect('/administracion');
},
formUploadImg: async (req,res)=>{
    const user= await Usuarios.findByPk(req.user.id);

    // mostrar la vista 

    res.render('img-profile',{
        nombrePagina: 'Subir Imagen perfil',
        user
    })
},
uploadImg: async(req,res)=>{
    const user = await Usuarios.findByPk(req.user.id);
    console.log(req.file);
    //si hay img anterior la borra 
    if (req.file && user.imagen) {
        const imgAntPath = path.join(__dirname, '../public/MaterialesNexus/archivos/uploads/profiles/', user.imagen);
        fs.unlink(imgAntPath, error => {
            if (error) {
                console.error(error);
            }
        });
    }
    //alamacena la nueva
    if (req.file) {
        user.imagen = req.file.filename;
    }

    // guardar en bd y redirect
    await user.save();
    req.flash('exito', 'Cambios Almacenados Correctamente');
    res.redirect('/administracion');

}



}


export default cUser;
export { upload };