import passport from "passport";
import localStrategy from 'passport-local'
import Usuarios from "../models/mUser.js";

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
},
async(email, password, next)=>{
    // codigo se ejecuta al llenar el formulario
    const usuario= await Usuarios.findOne({
                where:{email, activo:1}});
    //revisar si ixiste el usuario
    if(!usuario) return next(null,false,{
        message: 'Ese usuario no existe'
    });

    //el usuario existe, comparar su password 

    const verificarPass= usuario.validarPassword(password);
    //si el password es incorrecto

    if(!verificarPass) return next(null,false, {
        message: 'Password Incorrecto'
    });

    //todo bien 
    return next(null, usuario);
}

))

passport.serializeUser(function(usuario, cb){
    cb(null,usuario);
});
passport.deserializeUser(function(usuario, cb){
    cb(null, usuario);
})

export default passport;