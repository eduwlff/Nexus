import Comentarios from "../../models/mComentarios.js"
 import News from "../../models/mUser.js"

const cComments= {

    addComments: async(req,res,next)=>{
        //obtener comentarios
        const {comentarios}= req.body;

            //almaceno en la bd
        await Comentarios.create({
            mensaje: comentarios,
            usuarioId: req.user.id,
            noticiaId: req.params.id
        });

        //redirect a la misma page
        res.redirect('back');
        next();
        
    },

    deleteComments: async (req,res, next)=>{
        //tomar el id del comentario
        const {comentarioId}=req.body;

        //consultar comentario
        const comentario= await Comentarios.findOne({
            where: {id:comentarioId}
        });

        
        
        //verificar si el comentario existe
        if(!comentario){
            res.status(404).send('Accion no valida');
            return next();
        }

        //consultar la noticia del comentario
        // const news= await News.findOne({where : {id: comentario.noticiaId}})
        // verificar que lo borra el creador
//         console.log("Comentario usuario ID: ", comentario.usuarioId);
// console.log("News usuario ID: ", news.usuarioId);
// console.log("Request usuario ID: ", req.user.id);

        if(comentario.usuarioId===req.user.id || req.user.email==='ed.farina@duocuc.cl' ){
            await Comentarios.destroy({where : {
                id: comentario.id
            }}) 
            res.status(200).send('Eliminado correctamante');

            return next();
        }
        else{
            res.status(403).send('te crees hacker?')
        }

    }
}

export default cComments;