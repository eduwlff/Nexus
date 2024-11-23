import axios from "axios";
import Swal from "sweetalert2";

document.addEventListener('DOMContentLoaded',()=>{
  const  formsDelete= document.querySelectorAll('.eliminar-comentario');


    //reviar que exist form
    if(formsDelete.length>0){
        formsDelete.forEach(form=>{
            form.addEventListener('submit', deleteComments)
        })
    }
})

function deleteComments (e){
e.preventDefault();

Swal.fire({
    title: "Eliminar Comentario",
    text: "Si eliminas el comentario no se puede recuperar!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, borrar!",
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {

            // tomar el id del comentario
        const comentarioId= this.children[0].value;
        console.log(comentarioId);

            //crear el objeto
        const datos= {
            comentarioId
        }


        //pasar los datos
        axios.post(this.action,datos)
.then(respuesta=>{
    console.log(respuesta);

    this.parentElement.parentElement.remove();
}).catch((error)=>{
    if(error.response.status===404 || error.response.status===403){
        Swal.fire('Error', error.response.data, 'error')
    }
})
      Swal.fire({
        title: "Borrado!",
        text: "Tu comentario ha sido borrado.",
        icon: "success"
      });
    }
  });


}