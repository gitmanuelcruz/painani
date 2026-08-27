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
                                    <th width="11%" class="text-start">Num. Orden</th>
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
            { "campo_bd": "band_comentario", "valor_campo": "1", "icono": "fa-solid fa-comment-dots fa-lg", "callback": "verComentario", "tooltip": "Motivo", "tipoicono": "i", "color": "color_red" },
            { "campo_bd": "icon_ubicacion", "valor_campo": "1", "icono": "fa-solid fa-map-location-dot fa-lg", "callback": "verUbicacion", "tooltip": "Ubicación", "tipoicono": "i", "color": "color_green" },
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
const verComentario = (reg) => {
   let html = '';
   let botones = '';
   let titulo = `Motivo de la Notificaci&oacute;n`;
   $("#overlay2").show();
   //
   html += `<div class="row">
               <div class="col-sm-12">
                  <div class="card-body">
                     <ol class="list-group">
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                           <div class="ms-2 me-auto col-sm-6"><div class="fw-bold">- Num. Orden</div>&nbsp;&nbsp;&nbsp;${reg.num_orden}</div>
                           <div class="ms-2 me-auto col-sm-6"><div class="fw-bold">- Fecha Oficio</div>&nbsp;&nbsp;&nbsp;${reg.foficio}</div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                           <div class="ms-2 me-auto col-sm-12"><div class="fw-bold">- Motivo</div>&nbsp;&nbsp;&nbsp;${reg.desc_comentario.toUpperCase()}</div>
                        </li>
                     </ol>
                  </div>
               </div>
            </div>`;
   
   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" id="bt_cerrar_vm_comentario">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modal('frmPaquetes', titulo, html, 'formdefault-center', botones, 'cerrarVMComentario()');
   //
   $("#bt_cerrar_vm_comentario").on("click", function () {
      cerrarVMComentario();
   });
}
//!
const cerrarVMComentario = () => {
   closeModal();
   $("#overlay2").hide();
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
//!
const verUbicacion = (reg) => {
   let html = '';
   let botones = '';
   let titulo = `Ubicaci&oacute;n de la Notificaci&oacute;n &raquo; <span class="fw-bold">${reg.num_orden}</span>`;
   let latitud = reg.latitud;
   let longitud = reg.longitud;
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

   modalLG2('frmPaquetes', titulo, html, 'formlg_scrollable_center', botones, 'cerrarVMVerUbicacion()');
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
	closeModalLG2();
}
// TODO: Proceso de ver ubicaciones
const verUbicacionxPaquete = (reg) => {
   let html = '';
   let botones = '';
   let titulo = `Ubicaci&oacute;n de las Notificaciones del Paquete con el ID &raquo; <span class="fw-bold">${reg.id_paquete}</span>`;
   //
   html +=  `<form method="post" onsubmit="return false">
               <div class="row">
                  <div class="col-sm-6">
                     <figure>
                        <blockquote class="blockquote"><p class="p-font-weight-500 p-font-msg-09">${reg.notificador.toUpperCase()}</p></blockquote>
                        <figcaption class="blockquote-footer fw-bold">Notificador</figcaption>
                     </figure>
            	   </div>
                  <div class="col-sm-3">
                     <figure>
                        <blockquote class="blockquote"><p class="p-font-weight-500 p-font-msg-09">${reg.fprogramada}</p></blockquote>
                        <figcaption class="blockquote-footer fw-bold">Fecha Programada</figcaption>
                     </figure>
            	   </div>
                  <div class="col-sm-3">
                     <figure>
                        <blockquote class="blockquote"><p class="p-font-weight-500 p-font-msg-09">${formatNumberSD(reg.total_notificaciones)}</p></blockquote>
                        <figcaption class="blockquote-footer fw-bold">Total Oficios</figcaption>
                     </figure>
            	   </div>
               </div>
               <hr class="mb-0 mt-0">
               <div class="row">
                  <div class="col-sm-12"  id="divMapa">
                     <div style="width: 100%; height: 500px;" id="map"></div>
                  </div>
               </div>
            </form>`;
   
   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="cerrarVMVerUbicacionxPaquete()">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modalXL('frmPaquetes', titulo, html, 'formxl', botones, 'cerrarVMVerUbicacionxPaquete()');
   cargaMapaNotificacionesxPaquete(reg.id_paquete);
}
//!
const cerrarVMVerUbicacionxPaquete = () => {
	closeModalXL();
}
//!
const cargaMapaNotificacionesxPaquete = (pid_paquete) =>{
   $.ajax({
      type: 'post',
      url: contexto+nameController+'/notificacionesAplicadas',
      async: true,
      dataType: 'JSON',
      data: {
         id_paquete: pid_paquete
      },
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         targetPrincipal = document.getElementById('frmPaquetes');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         marcadores = [];
         $(data.listNotificaciones).each(function(i, v) {
            let arreglo = {
               'idPaquete': v.id_paquete,
               'NumOrden': v.num_orden,
               'fechaOficio': v.foficio,
               'fechaNotificado': v.fnotificado,
               'colorMarcador': v.color_red,
               'posicion': { lat: parseFloat(v.latitud), lng: parseFloat(v.longitud) }
            }
            marcadores.push(arreglo);
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
         initMapxPaquete();
      }
   });
}
//!
async function initMapxPaquete() {
   const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
   const infoWindow = new google.maps.InfoWindow({maxWidth: 200});
   const mapElement = document.getElementById('map');
   const zoomLevel = 10;
   const lat = 18.728248;
   const lon = -99.084391;

   map = new google.maps.Map(mapElement, {
      zoom: zoomLevel,
      center: { lat: lat, lng: lon },
      mapId: "4504f8b37365c3d0"
   });
 
   if(marcadores.length > 0) {
      marcadores.forEach((data, i) => {
         let vhtml = vistaHTMLMap(data);
         const pinBackground = new PinElement({
            background: data.colorMarcador,
            borderColor: data.colorMarcador,
            glyphColor: "white",
            scale: 0.8
         });

         const marker = new AdvancedMarkerElement({
            position: data.posicion,
            map,
            title: "Notificación",
            content: pinBackground.element
         });
   
         marker.addListener("click", ({ domEvent, latLng }) => {
            const { target } = domEvent;
            infoWindow.close();
            infoWindow.setContent(vhtml);
            infoWindow.open(marker.map, marker);
         });
      });
   }
}
//!
/*async function addMarker(data) {
   const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
   const infoWindow = new google.maps.InfoWindow({maxWidth: 200});
   let vhtml = vistaHTMLMap(data);

   const pinBackground = new google.maps.marker.PinView({
      background: data.colorMarcador,
      borderColor: data.colorMarcador,
      glyphColor: "white",
      scale: 0.7
   });

   const marker = new AdvancedMarkerElement({
      position: data.posicion,
      map,
      title: "Notificación",
      content: pinBackground.element
   });

   marker.addListener("click", ({ domEvent, latLng }) => {
      const { target } = domEvent;
      infoWindow.close();
      infoWindow.setContent(vhtml);
      infoWindow.open(marker.map, marker);
   });
 
   marcadores.push(marker);
}*/
//!
const vistaHTMLMap = (data) => {
   let vhtml = `<div style="max-height: 220px">
                  <span class="fw-bold">ID Paquete</span>
                  <p>${data.idPaquete}</p>
                  <span class="fw-bold">Num. Orden</span>
                  <p>${data.NumOrden}</p>
                  <span class="fw-bold">Fecha Oficio</span>
                  <p>${data.fechaOficio}</p>
                  <span class="fw-bold">Fecha Notificaci&oacute;n</span>
                  <p>${data.fechaNotificado}</p>
               </div>`;

   return vhtml;
}