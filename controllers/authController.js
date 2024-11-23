import passport from "passport";

const cAuth={
    autenticarUser: passport.authenticate('local',{
        successRedirect: '/administracion',
        failureRedirect: '/iniciar-sesion',
        failureFlash: true,
        badRequestMessage: 'Ambos campos son obligatorios'
    }),
    usuarioAutenticado:(req,res,next)=>{
        // si el user esta autenticado
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/iniciar-sesion');

    },
    logOut: (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash('exito', 'Cerraste Sesión correctamente');
            res.redirect('/iniciar-sesion');
            next();
        });
    } 
    
}

export default cAuth;