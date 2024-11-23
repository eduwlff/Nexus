import Categorias from "../../models/mCategorias.js";
import Courses from "../../models/mCursos.js";

const cRuta= {
    showRoutes: async(req,res)=>{
    const consultas= [];
    consultas.push(Categorias.findAll({}))
    const [categorias] = await Promise.all(consultas); 

    // console.log(categorias);

   
    res.render('ruta-aprendizaje', {
        nombrePagina: `Ruta de Aprendizaje`,
        categorias
    })
    }
}

export default cRuta;