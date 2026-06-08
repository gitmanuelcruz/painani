const vm_carga_layout = () => {
   let html = '';
   let botones = '';
   let titulo = `Registro de Notificaciones por Layout`;
   html +=  `<div class="row mb-0">
               <div class="col-sm-12">
                  <div class="alert alert-light-info">
                     <h5><i class="fa-solid fa-info-circle me-2"></i>Formato del Archivo</h5>
                     <p class="mb-2 text-dark">El archivo debe contener las siguientes columnas en este orden:</p>
                     <ol class="mb-2">
                        <li class="text-dark"><span class="fw-bold">Num. Oficio:</span> Numero de oficio debe ser unico (NO debe existir en la plataforma)</li>
                        <li class="text-dark"><span class="fw-bold">Fecha del Oficio:</span> la fecha del oficio debe llevar este formato <b>"dd-mm-yyyy"</b></li>
                        <li class="text-dark"><span class="fw-bold">Domicilio:</span> Domicilio donde se notificar&aacute;</li>
                        <li class="text-dark"><span class="fw-bold">Referencia Ubicaci&oacute;n:</span> Referencia de la ubicaci&oacute;n a notificar</li>
                     </ol>
                     <hr>
                     <div class="row">
                        <div class="col-sm-6">
                           <p class="mb-0 p-font-msg-1-2"><span class="fw-bold">Formato de archivo layout:</span> .xlsx</p>
                        </div>
                        <div class="col-sm-6 text-end">
                           <button type="button" class="btn btn-light-success" btn="btn" id="bt_descargar_formatoxlayout">
                              <i class="fa-solid fa-download me-2"></i>Descargar Formato de Layout
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <form method="post" class="app-form frm-modal-rlc" id="frmRegLayout" name="frmRegLayout" novalidate onsubmit="return false">
               <div class="row mb-2">
                  <div class="col-sm-12">
                     <label class="form-label">Layout de Oficios</label>
                     <input type="file" class="form-control" id="vm_archivo_layout" name="vm_archivo_layout"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" required/>
                     <div class="invalid-feedback">Layout de oficios requerido</div>
            		</div>
               </div>
            </form>
            <div class="overlay" id="overlay2"></div>`;

   botones +=  `<button type="button" class="btn btn-info me-1" btn="btn" id="bt_guardar_xlayout">
                  <i class="fa-solid fa-floppy-disk me-2"></i>Guardar
               </button>
               <button type="button" class="btn btn-secondary me-1" btn="btn" id="bt_clean_frmxlayout">
                  <i class="fa-solid fa-eraser me-2"></i>Limpiar
               </button>
               <button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" id="bt_cerrar_regxlayout">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modalLG('frmNotificaciones', titulo, html, 'formlg_scrollable', botones, 'cerrarVMRegistroxLayout()');
   //
   $("#bt_descargar_formatoxlayout").on("click", function () {
      descargar_formato_layout();
   });
   //
   $("#bt_guardar_xlayout").on("click", function () {
      validxLayout();
   });
   //
   $("#bt_clean_frmxlayout").on("click", function () {
      cleanFrmxLayout();
   });
   //
   $("#bt_cerrar_regxlayout").on("click", function () {
      cerrarVMRegistroxLayout();
   });
}
//!
const cerrarVMRegistroxLayout = () => {
   closeModalLG();
   recargaPaginadoPrincipal();
}
//!
const descargar_formato_layout = () => {
   document.forms["frmNotificaciones"].action = contexto+nameController+"/descargarFormatoLayout";
   document.forms["frmNotificaciones"].target = "";
   document.forms["frmNotificaciones"].submit();
}
//!
const cleanFrmxLayout = () => {
   $("#frmRegLayout").removeClass('frm-modal-rlc was-validated').addClass('frm-modal-rlc');
   $("#vm_archivo_layout").val('');
}
//!
const validxLayout = () => {
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal-rlc');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0){
      confirmarcionRegxLayout();
   }
}
//!
const validarArchivosLayout = () => {
   let msg = '';
   let extension = ['.xlsx'];

   if($.trim($("#vm_archivo_layout").val()).length > 0){
      if(verifcar_peso_archivo('vm_archivo_layout', 15)) {
         msg +="<li>El archivo .xlsx no puede pesar m&aacute;s de 15MB</li>";
      }
      if(!comprueba_extension($("#vm_archivo_layout").val(), extension)){
         msg +="<li>Solo se permite archivo .xlsx</li>";
      }
   }

   return msg;
}
//!
const confirmarcionRegxLayout = () => {
   const msg = validarArchivosLayout();
   if (msg.length > 0) {
      Swal.fire({
         title: 'Verificar Datos',
         html: '<ul class="p-font-msg-1">'+msg+'</ul>',
         icon: 'warning',
         showDenyButton: true,
         denyButtonText: 'Aceptar',
         showConfirmButton: false
      });
   }
   else {
      const mensaje = '<p class="p-font-msg-1-2">\u{BF}Confirma que el layout es correcto?</p>';
      Swal.fire({
         title: 'Confirmaci&oacute;n',
         html: mensaje,
         icon: 'warning',
         showCancelButton: true,
         cancelButtonText: 'Cancelar',
         cancelButtonColor: '#d33',
         confirmButtonColor: '#3085d6',
         confirmButtonText: 'Si, confirmar',
      }).then((result) => {
         if (result.isConfirmed) {
            guardarLayout();
         }
      });
   }
}
//!
const guardarLayout = () => {
   $.ajax({
      type: 'post',
      url: contexto+nameController+'/guardarLayout',
      async: true,
      processData: false,
      contentType: false,
      dataType:'JSON',
      data: new FormData($("#frmRegLayout")[0]),
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlayprincipal").show();
         $("#bt_guardar_xlayout").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Guardar');
         targetPrincipal = document.getElementById('frmNotificaciones');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         if (data.respuesta == false) {
            if(parseInt(data.error) == 1) {
               $('button[btn="btn"]').prop('disabled',false);
               spinnerPrincipal.stop();
               $("#overlayprincipal").hide();
               vmObservacionesLayout(data.usuario);
            }
            else if(parseInt(data.error) == 2) {
               Swal.fire({
                  title: 'VALIDACION',
                  html: '<p class="p-font-msg-1-2">'+data.mensaje+'</p>',
                  icon: 'warning',
                  showDenyButton: true,
                  denyButtonText: 'Aceptar',
                  showConfirmButton: false
               });
            }
            else {
               Swal.fire({
                  title: 'HA OCURRIDO UN ERROR!',
                  html: '<p class="p-font-msg-1-2 text-danger">'+data.mensaje+'</p>',
                  icon: 'error',
                  showDenyButton: true,
                  denyButtonText: 'Aceptar',
                  showConfirmButton: false
               });
            }
         }
         else {
            Swal.fire({
               title: '¡ P r o c e s o &nbsp;&nbsp; E x i t o s o !',
               html: '<p class="p-font-msg-1-2 text-dark">'+data.mensaje+'</p>',
               icon: 'success',
               showCancelButton: false,
               allowOutsideClick: false,
               allowEscapeKey: false,
               allowEnterKey: false,
               confirmButtonColor: '#3085d6',
               confirmButtonText: 'Aceptar',
            }).then((result) => {
               if (result.isConfirmed) {
                  cerrarVMRegistroxLayout();
               }
            });
         }
      },
      error: function (xhr, ajaxOptions, thrownError) {
         Swal.fire({
            title: 'HA OCURRIDO UN ERROR!',
            html: '<p class="p-font-msg text-danger">'+thrownError+'</p>',
            icon: 'error',
            showDenyButton: true,
            showConfirmButton: false,
            denyButtonText: "Aceptar"
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         $("#bt_guardar_xlayout").html('<i class="fa-solid fa-floppy-disk me-2"></i>Guardar');
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
const vmObservacionesLayout = (usuario) => {
   let html = '';
   let botones = '';
   const titulo = 'Observaciones de la Carga del Layout de Oficios';
   $("#overlay2").show();
   //
   html +=  `<input type="hidden" id="hid_user_reg" value="${usuario}"/>
            <div class="row">
               <div class="col-sm-12">
                  <div class="table-responsive-sm">
                     <table class="table table-sm table-hover" id="tblObservaciones" width="100%">
                        <thead class="table-secondary">
                           <tr class="p-font-msg-09">
                              <th width="5%"  class="text-center">#</th>
                              <th width="90%" class="text-start">Observaciones</th>
                           </tr>
                        </thead>
                        <tbody></tbody>
                     </table>
                  </div>
               </div>
            </div>`;

   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" id="bt_cerrar_vm_observ">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modalXL('frmNotificaciones', titulo, html, 'formxl_scrollable_error', botones, 'cerrarVMObservaciones()');
   getConsultaObservacionesPag();
   //
   $("#bt_cerrar_vm_observ").on("click", function () {
      cerrarVMObservaciones();
   });
}
//!
const cerrarVMObservaciones = () => {
   $("#overlay2").hide();
   tblObservLayout.barraDibujada = false;
   closeModalXL();
}
//!
const getConsultaObservacionesPag = () => {
   const usuarioRegistro = $("#hid_user_reg").val();
   tblObservLayout.setTablaHTML("tblObservaciones");
   tblObservLayout.setUrl(contexto+nameController+"/observacionesLayoutPag");
   tblObservLayout.setRegistrosPagina(10);
   tblObservLayout.setColumnas("consecutivo,observaciones");
   tblObservLayout.setColTipos("text,text");
   tblObservLayout.setAlineacion("center,left");
   tblObservLayout.fontSize = "0.83rem";
   tblObservLayout.parametros = "user_registro="+usuarioRegistro;
   tblObservLayout.loadJSON();
}