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
                                    <th width="10%" class="text-start">Num. Oficio</th>
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
function loadOficiosAsignados(idPaquete) {
	tblOficiosAsignado.setTablaHTML("gridNotifAsignadas");
	tblOficiosAsignado.setUrl(contexto+nameController+"/notificacionesAsigPag");
	tblOficiosAsignado.setRegistrosPagina(10);
	tblOficiosAsignado.setColumnas("num_oficio,foficio,desc_domicilio,desc_estatus,band");
	tblOficiosAsignado.setColTipos("text,text,text,textHTML,icon");
	tblOficiosAsignado.setAlineacion("left,center,left,center,center");
   let iconos = {
      "col5": {
         "opciones": [
            { "campo_bd": "icon_soportes", "valor_campo": "1", "icono": "fa-solid fa-folder-open fa-lg", "callback": "soportesNotificacion", "tooltip": "Soporte", "tipoicono": "i", "color": "color_blue" }
         ]
      }
   }
   tblOficiosAsignado.setIconos(iconos);
   tblOficiosAsignado.fontSize = '0.75rem';
	tblOficiosAsignado.setParametros("id_paquete="+idPaquete);
	tblOficiosAsignado.loadJSON();
}
//!
function soportesNotificacion(reg) {
   let html = '';
   let botones = '';
   const titulo = 'Soporte de la Notificaci&oacute;n';
   $("#overlay2").show();
   //
   html +=  `<div class="row mb-1">
               <div class="col-sm-3">
                  <figure>
                     <blockquote class="blockquote">
                        <p class="p-font-weight-500 p-font-msg-09">${reg.num_oficio}</p>
                     </blockquote>
                     <figcaption class="blockquote-footer fw-bold">Num. Oficio</figcaption>
                  </figure>
               </div>
               <div class="col-sm-9">
                  <figure>
                     <blockquote class="blockquote">
                        <p class="p-font-weight-500 p-font-msg-09">${reg.domicilio}</p>
                     </blockquote>
                     <figcaption class="blockquote-footer fw-bold">Domicilio</figcaption>
                  </figure>
               </div>
            </div>
            <hr style="margin-top:0">`;
   html +=  `<div class="table-responsive-sm">
               <table class="table table-sm table-hover" id="tblSoporte" width="100%">
                  <thead class="table-secondary">
                     <tr class="p-font-msg-08">
                        <th width="5%" class="text-start">ID</th>
                        <th width="20%" class="text-start">Descripci&oacute;n</th>
                        <th width="5%" class="text-center">Archivo</th>
                     </tr>
                  </thead>
                  <tbody></tbody>
               </table>
            </div>`;

   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="cerrarVMSoporte()">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
                </button>`;

   modalLG2('frmPaquetes',titulo,html,'formlg_scrollable_center',botones,'cerrarVMSoporte()');
   getConsultaSoportePag(reg.id_paquete_notificacion,reg.id_notificacion);
}
//!
function cerrarVMSoporte() {
   tblSoporte.barraDibujada = false;
   $("#overlay2").hide();
   closeModalLG2();
}
//!
function getConsultaSoportePag(id_paquete_notificacion,id_notificacion) {
   tblSoporte.setTablaHTML("tblSoporte");
   tblSoporte.setUrl(contexto+nameController+"/soportesNotificacionAsigPag");
   tblSoporte.setRegistrosPagina(8);
   tblSoporte.setColumnas("id_soporte_notificacion,comentarios,band");
   tblSoporte.setColTipos("text,text,icon");
   tblSoporte.setAlineacion("left,left,center");
   let iconos = {
      "col3": {
         "opciones": [
            { "campo_bd": "archivo", "valor_campo": "1", "icono": "fa-solid fa-file-pdf fa-lg", "callback": "ver_soporte", "tooltip": "Soporte", "tipoicono": "i", "color": "color_red" },
            { "campo_bd": "archivo", "valor_campo": "2", "icono": "fa-solid fa-image fa-lg", "callback": "ver_soporte", "tooltip": "Soporte", "tipoicono": "i", "color": "color_red" },
            { "campo_bd": "archivo", "valor_campo": "3", "icono": "fa-solid fa-file-zipper fa-lg", "callback": "ver_soporte", "tooltip": "Soporte", "tipoicono": "i", "color": "color_red" },
            { "campo_bd": "archivo", "valor_campo": "4", "icono": "fa-solid fa-file-lines fa-lg", "callback": "ver_soporte", "tooltip": "Soporte", "tipoicono": "i", "color": "color_red" }
         ]
      }
   }
   tblSoporte.setIconos(iconos);
   tblSoporte.fontSize = '0.8rem';
   tblSoporte.parametros = "id_paquete_notificacion="+id_paquete_notificacion+"&id_notificacion="+id_notificacion;
   tblSoporte.loadJSON();
}
//!
function ver_soporte(reg) {
   let titulo = 'Soporte con el ID &raquo; '+reg.id_soporte_notificacion;
   let nombreFile = reg.nombre_original;
   let pathSoporte = reg.ruta_soporte;
   let extension = reg.extension.toLowerCase();
   if(extension == 'pdf'){
      $.jAlert({
         'title':'Archivo adjunto ('+titulo+')',
         'theme':'dark_green',
         'size':'lg',
         'iframeHeight':'500px',
         'iframe': contexto+pathSoporte,
         'btns':[{'text':'Descargar Soporte', 'closeAlert':false, 'theme': 'green', 'onClick': function(){
               descargarArchivo(reg.id_soporte_notificacion,nombreFile,pathSoporte,extension);
            }
         }]
      });
   }
   else if(extension == 'jpg' || extension == 'jpeg' || extension == 'png') {
      $.jAlert({
         'title':'Archivo adjunto ('+titulo+')',
         'theme':'dark_green',
         'size':'md',
         'imageWidth':'100%',
         'image': contexto+pathSoporte,
         'btns':[{'text':'Descargar Soporte', 'closeAlert':false, 'theme': 'green', 'onClick': function(){
               descargarArchivo(reg.id_soporte_notificacion,nombreFile,pathSoporte,extension);
            }
         }]
      });
   }
   else {
      descargarArchivo(reg.id_soporte_notificacion,nombreFile,pathSoporte,extension);
   }
}
//!
function descargarArchivo(id,nombreFile,pathArchivo,extension) {
   $('button[btn="btn"]').prop('disabled',true);
   $("#overlayprincipal").show();
   targetPrincipal = document.getElementById('frmPaquetes');
   spinnerPrincipal = new Spinner().spin(targetPrincipal);
   let xhr = new XMLHttpRequest();
   xhr.open('post', contexto+pathArchivo, true);
   xhr.responseType = 'blob';
   xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=utf-8');
   xhr.onload = function () {
      let blob;
      if(extension == 'pdf' || extension == 'zip' || extension == 'rar') {
         blob = new Blob([this.response], {type: 'application/'+extension+''});
      }
      else if(extension == 'jpg' || extension == 'jpeg' || extension == 'png') {
         blob = new Blob([this.response], {type: 'image/'+extension+''});
      }
      if(window.navigator && window.navigator.msSaveOrOpenBlob){
         window.navigator.msSaveOrOpenBlob(blob);
         return;
      }
      let downloadURL = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = downloadURL;
      a.download = nombreFile;
      a.click();
      window.URL.revokeObjectURL(downloadURL);
      a.remove();
      $('button[btn="btn"]').prop('disabled',false);
      spinnerPrincipal.stop();
      $("#overlayprincipal").hide();
   }
   xhr.send();
}