import {Router} from 'express';
import { home } from '../controllers/homeController.js';
import cUser from '../controllers/userController.js';
import Usuarios from '../models/mUser.js';
import cAuth from '../controllers/authController.js';
import cAdmin from '../controllers/adminController.js';
import cNews from '../controllers/newsController.js';
import { body } from 'express-validator';
import cCurso from '../controllers/cursoController.js';
import { upload } from '../controllers/userController.js';
import cCourseFe from '../controllers/frontend/courseControllerFE.js';
import cUserFe from '../controllers/frontend/userControllerFE.js';
import cNewsFe from '../controllers/frontend/newsControllerFE.js';
import cComments from '../controllers/frontend/commentsController.js';
import cRuta from '../controllers/frontend/rutaController.js';
import cSearch from '../controllers/frontend/searchController.js';

const routes= Router();

//AREA PUBLICA

routes.get('/',home);

//crear y confirmar cuentas
routes.get('/crear-cuenta',cUser.formCrearCuenta)
routes.post('/crear-cuenta', cUser.crearCuenta)
routes.get('/confirmar-cuenta/:correo', cUser.confirmarCuenta)


//Mostrar ruta de aprendizaje

routes.get('/ruta',
    cRuta.showRoutes
)



//mostrar cursos

routes.get('/show-course/:slug',
    cCourseFe.showCourse
)


//confirmar la asistencia a curso

routes.post('/confirmar-asistencia/:slug',
    cCourseFe.confirmAttendance
)

//mostrar asistentes del curso

routes.get('/asistentes/:slug',
    cCourseFe.showAttendees
)

//mostrar perfiles front end

routes.get('/usuarios/:id',
    cUserFe.showUser
)

//mostrar noticias en el frontend
routes.get('/news/:id',
    cNewsFe.showNews
)

//comentarios de noticias

routes.post('/news/:id',
cComments.addComments
)

// Elimina comentarios news
routes.post('/delete-comments',
    cComments.deleteComments
)

//mostrar categoria de noticas

routes.get('/categoria-news/:categoria',
    cNewsFe.mostrarCategoria
)

//mostrar categoria de cursos 

routes.get('/categoria-courses/:categoria', 
    cCourseFe.mostrarCategorias
)

// BUSQUEDA
routes.get('/busqueda', 
cSearch.searchResult
)

//INICIAR SESSION
routes.get('/iniciar-sesion', cUser.getSigninForm)
routes.post('/iniciar-sesion', cAuth.autenticarUser)



//AREA PRIVADA *CON AUTENTIFICACION

//cerrar sesion

routes.get('/log-out',
    cAuth.usuarioAutenticado,
    cAuth.logOut
)

//Panel de administracion

// Panel de administración: primero autenticación, luego acceso al panel
routes.get('/administracion', cAuth.usuarioAutenticado, cAdmin.panelAdmin);

// nuevas noticias

routes.get('/nueva-noticia', cAuth.usuarioAutenticado, cNews.formNews)

routes.post('/nueva-noticia',
    cAuth.usuarioAutenticado,
    cNews.subirImagen
    , [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .trim().escape(),
    body('url')
        .optional()
        .isURL().withMessage('Debe ser una URL válida')
        .trim().escape(),
    body('categoriaId')
        .notEmpty().withMessage('Debes seleccionar una categoría')
], cNews.crearNews);

//editar noticias

routes.get('/editar-new/:newId',
    cAuth.usuarioAutenticado,
    cNews.formEditNew
)
routes.post('/editar-new/:newId',
    cAuth.usuarioAutenticado,
    cNews.editNew
)

//Editar Imagen noticias

routes.get('/imagen-new/:newId',
    cAuth.usuarioAutenticado,
    cNews.formEditImg
)

routes.post('/imagen-new/:newId',
    cAuth.usuarioAutenticado,
    cNews.subirImagen,
    cNews.editImg
)

// Eliminar noticias

routes.get('/eliminar-new/:newId',
    cAuth.usuarioAutenticado,
    cNews.formDeleteNews

)
routes.post('/eliminar-new/:newId',
    cAuth.usuarioAutenticado,
    cNews.deleteNews

)
// mostrar all news admin
routes.get('/show-all',
    cAuth.usuarioAutenticado,
    cAdmin.showAdmin
)
//nuevo curso

routes.get('/nuevo-curso',
    cAuth.usuarioAutenticado,
    cCurso.formNewCurso

)

routes.post('/nuevo-curso',
    cAuth.usuarioAutenticado,
    cCurso.sanitizeCourses,
    cCurso.createCourses
)

//editar Curso

routes.get('/edit-course/:id',
    cAuth.usuarioAutenticado,
    cCurso.formEditCourse,
)
routes.post('/edit-course/:id',
    cAuth.usuarioAutenticado,
    cCurso.editCourse
)

//eliminar curso

routes.get('/delete-course/:id',
cAuth.usuarioAutenticado,
cCurso.formDeleteCourse
)
routes.post('/delete-course/:id',
    cAuth.usuarioAutenticado,
    cCurso.deleteCourse
    )

//editar perfil

routes.get('/edit-profile/',
cAuth.usuarioAutenticado,
cUser.formEditProfile
)
routes.post('/edit-profile/',
    cAuth.usuarioAutenticado,
    cUser.editProfile
)

routes.get('/edit-password/',
    cAuth.usuarioAutenticado,
    cUser.formEditPassword
    )
routes.post('/edit-password/',
    cAuth.usuarioAutenticado,
    cUser.editPassword
    )
routes.get('/img-profile',
    cAuth.usuarioAutenticado,
    cUser.formUploadImg
)
routes.post('/img-profile', cAuth.usuarioAutenticado, upload, cUser.uploadImg);

    




export default routes;