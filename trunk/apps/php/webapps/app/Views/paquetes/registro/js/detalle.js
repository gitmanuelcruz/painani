let tblOficiosAsignado = new MTable();
let tblSoporte = new MTable();
const detalle = (reg) => {
   let html = '';
   let botones = '';
   const titulo = `Detalle del Paquete con ID &raquo; <span class="fw-bold">${reg.id_paquete}</span>`;
   //
   html +=  `<div class="row">
               <div class="col-sm-12">
                  <div class="card-body">
                     <ol class="list-group">
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                           <div class="ms-2 me-auto col-sm-4"><div class="fw-bold">- Fecha Pogramada</div>&nbsp;&nbsp;&nbsp;${reg.fprogramada}</div>
                           <div class="ms-2 me-auto col-sm-8"><div class="fw-bold">- Notificador</div>&nbsp;&nbsp;&nbsp;${reg.notificador.toUpperCase()}</div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-start">`;
   if(reg.fapertura != '') {
      html +=  `           <div class="ms-2 me-auto col-sm-4"><div class="fw-bold">- Fecha Apertura</div>&nbsp;&nbsp;&nbsp;${reg.fapertura}</div>`;
   }
   if(reg.fcierre != '') {
      html +=  `           <div class="ms-2 me-auto col-sm-8"><div class="fw-bold">- Fecha Cierre</div>&nbsp;&nbsp;&nbsp;${reg.fcierre}</div>`;
   }
   html +=  `           </li>
                     </ol>
                  </div>
               </div>
            </div>`;
   html +=  `<div class="row">
               <div class="col-sm-12">
                  <div class="card-body">
                     <ol class="list-group">
                        <div class="table-responsive-sm">
                           <table class="table table-sm table-striped table-hover" id="gridNotifAsignadas" style="width: 100%;">
                              <thead class="table-secondary">
                                 <tr class="p-font-msg-08">
                                    <th width="11%" class="text-start">Num. Oficio</th>
                                    <th width="13%" class="text-center">Fecha Oficio</th>
                                    <th width="20%" class="text-start">Domicilio</th>
                                    <th width="10%" class="text-center">Estatus</th>
                                    <th width="5%"  class="text-center"></th>
                                 </tr>
                              </thead>
                              <tbody></tbody>
                           </table>
                        </div>
                     </ol>
                  </div>
               </div>
            </div>
            <div class="overlay" id="overlay2"></div>`;

   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" id="bt_cerrar_detalle">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;
   modalLG('frmPaquetes', titulo, html, 'formlg_scrollable', botones, 'cerrarVMDetalle()');
   loadOficiosAsignados(reg.id_paquete);
   //
   $("#bt_cerrar_detalle").on("click", function () {
      cerrarVMDetalle();
   });
}
//!
const cerrarVMDetalle = () => {
   tblOficiosAsignado.barraDibujada = false;
   closeModalLG();
}
//!
const loadOficiosAsignados = (idPaquete) => {
	tblOficiosAsignado.setTablaHTML("gridNotifAsignadas");
	tblOficiosAsignado.setUrl(contexto+nameController+"/notificacionesAsigPag");
	tblOficiosAsignado.setRegistrosPagina(10);
	tblOficiosAsignado.setColumnas("desc_num_ofi_orden,foficio,desc_domicilio,desc_estatus,band");
	tblOficiosAsignado.setColTipos("textHTML,text,text,textHTML,icon");
	tblOficiosAsignado.setAlineacion("left,center,left,center,center");
   let iconos = {
      "col5": {
         "opciones": [
            { "campo_bd": "icon_soportes", "valor_campo": "1", "icono": "fa-solid fa-folder-open fa-lg", "callback": "verSoporte", "tooltip": "Soporte", "tipoicono": "i", "color": "color_blue" }
         ]
      }
   }
   tblOficiosAsignado.setIconos(iconos);
   tblOficiosAsignado.fontSize = '0.75rem';
	tblOficiosAsignado.setParametros("id_paquete="+idPaquete);
	tblOficiosAsignado.loadJSON();
}
//!
const verSoporte = (reg) => {
   let item = {
      id_paquete:'',
      id_paquete_notificacion:reg.id_paquete_notificacion,
      id_notificacion:reg.id_notificacion
   }
   soportesNotificacion(item);
}
//!
const soportesNotificacion = (reg) => {
   let tar,spin;
   let vSlider = [];
   $.ajax({
      type: 'post',
      url: contexto+nameController+'/soportesNotificacionAsig',
      async: true,
      dataType: 'JSON',
      data: {
         id_paquete:reg.id_paquete,
         id_paquete_notificacion:reg.id_paquete_notificacion,
         id_notificacion:reg.id_notificacion
      },
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         tar = document.getElementById('frmPaquetes');
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
            btns:[{text:'Descargar Soporte', 'closeAlert':false, theme: 'green', onClick: function(){
                  descargarArchivo(reg.id_paquete,reg.id_paquete_notificacion,reg.id_notificacion);
               }
            }]
         });
      }
   });
}
//!
const descargarArchivo = (pid_paquete,pid_paquete_notificacion,pid_notificacion) => {
   $.ajax({
      type: 'post',
      url: contexto+nameController+'/descargarSoporte',
      data: {
         id_paquete:pid_paquete,
         id_paquete_notificacion:pid_paquete_notificacion,
         id_notificacion:pid_notificacion
      },
      xhrFields: {
         responseType: 'blob'
      },
      beforeSend: function() {
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         tar = document.getElementById('frmPaquetes');
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