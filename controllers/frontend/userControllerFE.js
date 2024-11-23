import News from "../../models/mNews.js";
import Usuarios from "../../models/mUser.js"
import Courses from "../../models/mCursos.js";
import Comentarios from "../../models/mComentarios.js";


const cUserFe= {

    showUser: async (req,res,next)=>{
        const consultas=[]

        //consultas al mismo tiempo

        consultas.push(Usuarios.findOne({where: {id:req.params.id} }));

        consultas.push(News.findAll({where: {usuarioId: req.params.id}}));
        consultas.push(Courses.findAll({where: {usuarioId: req.params.id}}));
        consultas.push(Comentarios.findAll({where: {usuarioId: req.params.id}}));
        

        const [usuario,news,courses,comentarios]= await Promise.all(consultas);

        

        if(!usuario){
            res.redirect('/');
            return next();
        }

        let countNews= 0;
        news.forEach(el=>{
            countNews=countNews+1;
        })
        let countCourses=0;
        courses.forEach(el=>{
            countCourses=countCourses+1;
        })
        let countComments=0;
        comentarios.forEach(el=>{
            countComments=countComments+1;
        })

        console.log(`este user tiene ${countCourses} cursos y ${countNews} news 
            y ${countComments} comentarios`);
        let username=`@${usuario.nombre}`;
        console.log(username)


        //mostrar la vista

        res.render('mostrar-perfil',{
            nombrePagina : `Perfil Usuario de ${usuario.nombre}`,
            usuario,
            news,
            courses,
            countCourses,
            countNews,
            countComments
        })

    }

}


export default cUserFe