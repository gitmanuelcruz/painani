const historialNotificacion = (reg) => {
   $('.tooltip_icon_pag').tooltip('hide');
   let html = '';
   let botones = '';
   const titulo = 'Historial de la Notificaci&oacute;n';
   $("#overlay2").show();
   //
   html +=  `<div class="row mb-1">
               <div class="col-sm-3">
                  <figure>
                     <blockquote class="blockquote">
                        <p class="p-font-weight-500 p-font-msg-09">${reg.num_orden}</p>
                     </blockquote>
                     <figcaption class="blockquote-footer fw-bold">Num. Orden</figcaption>
                  </figure>
               </div>
               <div class="col-sm-3">
                  <figure>
                     <blockquote class="blockquote">
                        <p class="p-font-weight-500 p-font-msg-09">${reg.foficio}</p>
                     </blockquote>
                     <figcaption class="blockquote-footer fw-bold">Fecha Oficio</figcaption>
                  </figure>
               </div>
               <div class="col-sm-6">
                  <figure>
                     <blockquote class="blockquote">
                        <p class="p-font-weight-500 p-font-msg-09">${reg.desc_domicilio}</p>
                     </blockquote>
                     <figcaption class="blockquote-footer fw-bold">Domicilio</figcaption>
                  </figure>
               </div>
            </div>
            <hr style="margin-top:0">`;
   html +=  `<div class="table-responsive-sm">
               <table class="table table-sm table-hover" id="tblHistorialNotPaq" width="100%">
                  <thead class="table-secondary">
                     <tr class="p-font-msg-08">
                        <th width="5%"  class="text-start">ID Paquete</th>
                        <th width="11%" class="text-center">Fecha Programda</th>
                        <th width="13%" class="text-start">Notificador</th>
                        <th width="10%" class="text-center">Verificado</th>
                        <th width="12%" class="text-center">Estatus</th>
                        <th width="3%" class="text-center"></th>
                     </tr>
                  </thead>
                  <tbody></tbody>
               </table>
            </div>
            <div class="overlay" id="overlay2"></div>`;

   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal"  btn="btn" onclick="cerrarVMHistorialPaquete()">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
                </button>`;

   modalXL('frmNotificaciones',titulo,html,'formxl_scrollable',botones,'cerrarVMHistorialPaquete()');
   getConsultaHistorialPaqPag(reg.id_notificacion);
}
//!
const cerrarVMHistorialPaquete = () => {
   tblHistorial.barraDibujada = false;
   closeModalXL();
   recargaPaginadoPrincipal();
}
//!
const getConsultaHistorialPaqPag = (id_notificacion) => {
   tblHistorial.setTablaHTML("tblHistorialNotPaq");
   tblHistorial.setUrl(contexto+nameController+"/historialNotificacionPackagesPag");
   tblHistorial.setRegistrosPagina(8);
   tblHistorial.setColumnas("id_paquete,fprogramada,notificador,nombre_verificacion,estatus_npaq,band");
   tblHistorial.setColTipos("text,text,text,text,textHTML,icon");
   tblHistorial.setAlineacion("left,center,left,center,center,center");
   let iconos = {
      "col6": {
         "opciones": [
            { "campo_bd": "icon_ubicacion", "valor_campo": "1", "icono": "fa-solid fa-map-location-dot fa-lg", "callback": "verUbicacion", "tooltip": "Ubicación", "tipoicono": "i", "color": "color_green" },
            { "campo_bd": "icon_soportes", "valor_campo": "1", "icono": "fa-solid fa-folder-open fa-lg", "callback": "verSoporte", "tooltip": "Soporte", "tipoicono": "i", "color": "color_blue" }
         ]
      }
   }
   tblHistorial.setIconos(iconos);
   tblHistorial.fontSize = '0.75rem';
   tblHistorial.parametros = "id_notificacion="+id_notificacion;
   tblHistorial.loadJSON();
}
//!
const verUbicacion = (reg) => {
   let html = '';
   let botones = '';
   const titulo = `Ubicaci&oacute;n de la Notificaci&oacute;n &raquo; <span class="fw-bold">${reg.num_orden}</span>`;
   const latitud = reg.latitud;
   const longitud = reg.longitud;
   $("#overlay2").show();
   //
   html +=  `<form method="post" onsubmit="return false">
               <div class="row">
                  <div class="col-sm-12">
            		   <div id="map" style="height: 450px; width: 100%"></div>
            		</div>
               </div>
            </form>`;
   
   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="cerrarVMVerUbicacion()">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modalLG('frmNotificaciones', titulo, html, 'formlg_scrollable_center', botones, 'cerrarVMVerUbicacion()');
   initMap(latitud, longitud);
}
//!
const initMap = (lat, lng) => {
	//* Coordenadas iniciales
	let initialLocation = { lat: parseFloat(lat), lng: parseFloat(lng) };
	let map;
	let marker;

	map = new google.maps.Map(document.getElementById('map'), {
		center: initialLocation,
		zoom: 18
	});

	marker = new google.maps.Marker({
		position: initialLocation,
		map: map,
		draggable: false
	});
}
//!
const cerrarVMVerUbicacion = () => {
	$("#overlay2").hide();
	closeModalLG();
}
//!
const verSoporte = (reg) => {
   let item = {
      id_paquete_notificacion:reg.id_paquete_notificacion,
      id_notificacion:reg.id_notificacion,
      apl_verificacion:reg.apl_verificacion,
      pantalla:reg.pantalla
   }
   soportesNotificacion(item);
}
//!
const soportesNotificacion = (reg) => {
   let tar,spin;
   let vSlider = [];
   const btnAplVerificacion = (parseInt(reg.apl_verificacion) == 1) ? 
      {text:'Aplicar Verificación Soporte', 'closeAlert':false, theme: 'blue', onClick: function(){
         confirmaAplVerificacion(reg.id_paquete_notificacion,reg.id_notificacion,reg.pantalla);
      }}:'';
      
   $.ajax({
      type: 'post',
      url: contexto+nameController+'/soportesNumOrdenes',
      async: true,
      dataType: 'JSON',
      data: {
         id_paquete_notificacion:reg.id_paquete_notificacion,
         id_notificacion:reg.id_notificacion
      },
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         tar = document.getElementById('frmNotificaciones');
         spin = new Spinner().spin(tar);
      },
      success: function (data) {
         $(data.listSoporte).each(function(i, v) {
            let item = {
               src: contexto+v.ruta_soporte,
               thumbnail: contexto+v.ruta_soporte,
               caption: v.desc_soporte
            }
            vSlider.push(item);
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spin.stop();
         $("#overlayprincipal").hide();
         //
         $.jAlert({
            title:'Archivo adjunto',
            theme:'dark_green',
            slideshow: vSlider,
            slideshowOptions: {
               showThumbnails: true,
               showArrows: true,
               showCounter: 'numbers',
               autoAdvance: true,
               interval: 1500
            },
            btns:[
               {text:'Descargar Soporte', 'closeAlert':false, theme: 'green', onClick: function(){
                  descargarArchivo(reg.id_paquete_notificacion,reg.id_notificacion);
               }},
               btnAplVerificacion
            ]
         });
      }
   });
}
//!
const descargarArchivo = (pid_paquete_notificacion,pid_notificacion) => {
   let tar,spin;
   $.ajax({
      type: 'post',
      url: contexto+nameController+'/descargarSoporte',
      data: {
         id_paquete_notificacion:pid_paquete_notificacion,
         id_notificacion:pid_notificacion
      },
      xhrFields: {
         responseType: 'blob'
      },
      beforeSend: function() {
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         tar = document.getElementById('frmNotificaciones');
         spin = new Spinner().spin(tar);
      },
      success: function(blob, status, xhr) {
         // 1. Intentar obtener el nombre del archivo desde las cabeceras HTTP de PHP
         let filename = '';
         let disposition = xhr.getResponseHeader('Content-Disposition');
         if (disposition && disposition.indexOf('attachment') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) { 
               filename = matches[1].replace(/['"]/g, '');
            }
         }
         // Nombre por defecto si la cabecera falla
         if (!filename) filename = 'archivo_descargado.zip';
         // 2. Crear un enlace temporal en memoria y simular el clic
         var url = window.URL.createObjectURL(blob);
         var a = document.createElement('a');
         a.href = url;
         a.download = filename;
         document.body.appendChild(a);
         a.click();
         // 3. Limpieza de memoria
         a.remove();
         window.URL.revokeObjectURL(url);
      },
      error: function(xhr, status, error) {
         console.error('Error en la descarga:', error);
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spin.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
const confirmaAplVerificacion = (id_paquete_notificacion,id_notificacion,pantalla) => {
   $('.jAlert').closeAlert();
   let html = '';
   let botones = '';
   const titulo = `Verificaci&oacute;n de Soporte`;
   $("#overlay2").show();
   //
   html +=  `<form method="post" class="app-form" id="frmAplVerificacion" name="frmAplVerificacion" onsubmit="return false">
               <div class="row">
                  <div class="col-sm-12">
                     <label class="form-label">Tipo Verificaci&oacute;n</label>
                     <select class="form-control selectpicker" id="vm_id_verificacion" name="vm_id_verificacion" style="width: 100%">
                        <option value="">[Seleccione una opci&oacute;n]</option>
                     </select>
                  </div>
               </div>
            </form>`;
   
   botones +=  `<button type="button" class="btn btn-info me-1" btn="btn" id="bt_guardar_verificacion">
                  <i class="fa-solid fa-floppy-disk me-2"></i>Guardar
               </button>`;
   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" id="bt_cerrar_vm_aplverif">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modal('frmNotificaciones', titulo, html, 'formdefault_scrollable', botones, 'cerrarVMAplVerificacion()');
   $(".selectpicker").select2({dropdownParent: $("#vModal")});
   cargaComboVerificacion(true);
   //
   $("#bt_guardar_verificacion").on("click", function () {
      aplicaVerificacion(id_paquete_notificacion,id_notificacion,pantalla);
   });
   //
   $("#bt_cerrar_vm_aplverif").on("click", function () {
      cerrarVMAplVerificacion();
   });
}
//!
const cerrarVMAplVerificacion = () => {
   $("#overlay2").hide();
   closeModal();
}
//!
const cargaComboVerificacion = (pasync) => {
	let tar,spin;
   let formData = new FormData();
   formData.append("aplica", 1);
	$.ajax({
      type: 'post',
      url: contexto+nameController+'/getComboVerificacion',
      async: pasync,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: formData,
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         tar = document.getElementById('frmNotificaciones');
         spin = new Spinner().spin(tar);
      },
      success: function (data) {
         $("#vm_id_verificacion").html('<option value="">[Seleccione una opci&oacute;n]</option>');
         $(data.verificaciones).each(function(i, v) {
            $("#vm_id_verificacion").append('<option value="'+v.id+'">'+v.descripcion+'</option>');
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spin.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
const aplicaVerificacion = (id_paquete_notificacion,id_notificacion,pantalla) => {
   let formData = new FormData();
   formData.append("id_paquete_notificacion", id_paquete_notificacion);
   formData.append("id_notificacion", id_notificacion);
   formData.append("id_verificacion", $("#vm_id_verificacion").val());
   $.ajax({
      type: 'post',
      url: contexto+nameController+'/procesoVerificarSoporte',
      async: true,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlayprincipal").show();
         targetPrincipal = document.getElementById('frmNotificaciones');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         if (data.respuesta == false) {
            Swal.fire({
               title: 'HA OCURRIDO UN ERROR!',
               html: '<p class="p-font-msg-1-2 text-danger">'+data.mensaje+'</p>',
               icon: 'error',
               showDenyButton: true,
               denyButtonText: 'Aceptar',
               showConfirmButton: false
            });
         }
         else {
            Swal.fire({
               title: '¡ P r o c e s o &nbsp;&nbsp; E x i t o s o !',
               html: '<p class="p-font-msg-1-2">'+data.mensaje+'</p>',
               icon: 'success',
               showCancelButton: false,
               allowOutsideClick: false,
               allowEscapeKey: false,
               allowEnterKey: false,
               confirmButtonColor: '#3085d6',
               confirmButtonText: 'Aceptar',
            }).then((result) => {
               if (result.isConfirmed) {
                  cerrarVMAplVerificacion();
                  if(parseInt(pantalla) == 1) {
                     recargaPaginadoPrincipal();
                  }
                  else if(parseInt(pantalla) == 2) {
                     getConsultaHistorialPaqPag(id_notificacion);
                  }
               }
            });
         }
      },
      error: function (xhr, ajaxOptions, thrownError) {
         Swal.fire({
            title: 'HA OCURRIDO UN ERROR!',
            html: '<p class="p-font-msg text-danger">' + thrownError + '</p>',
            icon: 'error',
            showDenyButton: true,
            showConfirmButton: false,
            denyButtonText: "Aceptar"
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled', false);
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}