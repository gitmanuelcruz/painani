let table = new MTable();
const nameController = 'PaquetesRegistro';
const Toast = Swal.mixin({
   toast: true,
   position: 'top-right',
   customClass: {
      popup: 'colored-toast'
   },
   showConfirmButton: false,
   timer: 1500,
   timerProgressBar: true
});

$(document).ready(function() {
	$(".preloader").fadeOut();
	loadPaquetesPag();

	$("#btnBuscar").on("click", function () {
		loadPaquetesPag();
	});

   $("#btn_inf_notif_gral").on("click", function () {
      vmDescargarInfo(1);
   });

	$("#btnNuevo").on("click", function () {
		vmRegistro('','N');
	});

	$("#txt_id_num_oficio,#txt_nombre_notificador").keypress(function (e) {
      keyEvent(e);
   });
});

const loadPaquetesPag = () => {
	table.setTablaHTML("gridPaquetes");
	table.setUrl(contexto+nameController+"/paquetesPag");
	table.setRegistrosPagina(10);
	table.setColumnas("id_paquete,notificador,fprogramada,fapertura,fcierre,total_notificaciones,total_notificado,total_no_localizado,band");
	table.setColTipos("text,text,text,text,text,numeroSD,numeroSD,numeroSD,dropdown");
	table.setAlineacion("left,left,center,center,center,center,center,center,center");
	let dropdown = {
      "col9": {
         "opciones": [
            {"etiqueta":"", "titulo": "Opc. Paquete", "icono": "fa-solid fa-list-ul fa-lg", "tooltip": "Lista de opciones", "tipoicono": "i",
               "menu":[
                  { "campo_bd": "band_detalle", "valor_campo": "1", "icono": "fa-solid fa-circle-info fa-lg", "callback": "detalle", "etiqueta": "Detalle", "tipoicono": "i", "color": "color_blue" },
                  { "campo_bd": "icon_ubicacion", "valor_campo": "1", "icono": "fa-solid fa-map-location-dot fa-lg", "callback": "verUbicacionxPaquete", "etiqueta": "Ubicaciones", "tipoicono": "i", "color": "color_red" },
                  { "campo_bd": "icon_soporte", "valor_campo": "1", "icono": "fa-solid fa-folder-open fa-lg", "callback": "verSoportexPaquete", "etiqueta": "Soportes", "tipoicono": "i", "color": "color_blue" },
                  { "campo_bd": "icon_abrir", "valor_campo": "1", "icono": "fa-regular fa-circle-play fa-lg", "callback": "iniciarPaquete", "etiqueta": "Iniciar", "tipoicono": "i", "color": "color_green" },
                  { "campo_bd": "icon_cerrar", "valor_campo": "1", "icono": "fa-regular fa-circle-stop fa-lg", "callback": "cerrarPaquete", "etiqueta": "Cerrar", "tipoicono": "i", "color": "color_red" },
                  { "campo_bd": "icon_editar", "valor_campo": "1", "icono": "fa-solid fa-pen-to-square fa-lg", "callback": "editarPaquete", "etiqueta": "Editar", "tipoicono": "i", "color": "color_black" },
                  { "campo_bd": "icon_eliminar", "valor_campo": "1", "icono": "fa-solid fa-trash fa-lg", "callback": "eliminarPaquete", "etiqueta": "Eliminar", "tipoicono": "i", "color": "color_red" },
                  { "campo_bd": "icon_informe","valor_campo": "1", "icono": "fa-solid fa-print fa-lg","callback": "descargarInfoPaquete", "etiqueta": "Imp. Ficha", "tipoicono": "i", "color": "color_red" }
               ]
            }
         ]
      }
   }
	table.setDropDown(dropdown);
   table.loading = true;
	table.setParametros($("#frmPaquetes").serialize());
	table.loadJSON();
}
//!
const recargaPaginadoPrincipal = () => {
   table.loading = true;
   table.parametros = $("#frmPaquetes").serialize();
   table.loadJSON(table.pagina);
}
//!
const recargaPagPrincipalSinLoading = () => {
   table.loading = false;
   table.parametros = $("#frmPaquetes").serialize();
   table.loadJSON(table.pagina);
}
//!
socket.on('refresh_apertura_operacion', async(data) => {
   recargaPagPrincipalSinLoading();
});
//!
socket.on('refresh_cierre_operacion', async(data) => {
   recargaPagPrincipalSinLoading();
});
//!
socket.on('refresh_cambio_estatus', async(data) => {
   recargaPagPrincipalSinLoading();
});
//!
const keyEvent = (event) => {
   let tecla = (event.all) ? event.keyCode : event.which;
   if (tecla == 13) {
      loadPaquetesPag();
   }
   else {
      return false;
   }
}
//!
const validCombos = (id,id2) => {
	let valid = $("#vm_contador_valid").val();
	if(parseInt(valid) > 0) {
		if($("#"+id+"").val() == '') {
			$("#"+id2+"").removeClass('has-valid').addClass('has-error');
		}
		else {
			$("#"+id2+"").removeClass('has-error').addClass('has-valid');
		}
	}
}
// TODO: Proceso de ver soporte
const verSoportexPaquete = (reg) => {
   let item = {
      id_paquete:reg.id_paquete,
      id_paquete_notificacion:'',
      id_notificacion:''
   }
   soportesNotificacion(item);
}
// TODO: Proceso de edicion
const editarPaquete = (reg) =>{
   vmRegistro(reg.id_paquete,'E');
   $("#vm_fecha_programada").val(reg.fecha_programada);
   cargaComboRegistro(true,reg.id_notificador);
   cargaListOficios(false,reg.id_paquete,reg.fecha_programada);
   inicializarListado();
}
// TODO: Proceso de iniciar paquete
const iniciarPaquete = (reg) => {
   let titulo =   `Confirma <span class="fw-bold text-success">INICIAR</span> el paquete con el ID
                  <span class="fw-bold">${reg.id_paquete}</span>`;
   Swal.fire({
      title: 'Confirmaci&oacute;n',
      html: '<p class="p-font-msg-1-2">\u{BF}'+titulo+'?</p>',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, confirmar',
   }).then((result) => {
      if (result.isConfirmed) {
         iniciar_paquete(reg.id_paquete);
      }
   });
}
//
const iniciar_paquete = (id_paquete) => {
   let formData = new FormData();
   formData.append("id_paquete", id_paquete);
   $.ajax({
      type: 'post',
      url: contexto+nameController+'/procesoIniciarPaquete',
      async: true,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlayprincipal").show();
         targetPrincipal = document.getElementById('frmPaquetes');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         if (data.respuesta == false) {
            if(parseInt(data.valid) > 0) {
               Swal.fire({
                  title: 'VALIDACIÓN',
                  html: '<p class="p-font-msg-1-2">'+data.mensaje+'</p>',
                  icon: 'warning',
                  showCancelButton: false,
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  allowEnterKey: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Aceptar',
               }).then((result) => {
                  if (result.isConfirmed) {
                     recargaPaginadoPrincipal();
                  }
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
                  recargaPaginadoPrincipal();
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
// TODO: Proceso de cerrar paquete
const cerrarPaquete = (reg) => {
   let titulo =   `Confirma <span class="fw-bold text-danger">CERRAR</span> el paquete con el ID
                  <span class="fw-bold">${reg.id_paquete}</span>`;
   Swal.fire({
      title: 'Confirmaci&oacute;n',
      html: '<p class="p-font-msg-1-2">\u{BF}'+titulo+'?</p>',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, confirmar',
   }).then((result) => {
      if (result.isConfirmed) {
         close_paquete(reg.id_paquete);
      }
   });
}
//
const close_paquete = (id_paquete) => {
   let formData = new FormData();
   formData.append("id_paquete", id_paquete);
   $.ajax({
      type: 'post',
      url: contexto+nameController+'/procesoCerrarPaquete',
      async: true,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlayprincipal").show();
         targetPrincipal = document.getElementById('frmPaquetes');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         if (data.respuesta == false) {
            if(parseInt(data.valid) > 0) {
               Swal.fire({
                  title: 'VALIDACIÓN',
                  html: '<p class="p-font-msg-1-2">'+data.mensaje+'</p>',
                  icon: 'warning',
                  showCancelButton: false,
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  allowEnterKey: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Aceptar',
               }).then((result) => {
                  if (result.isConfirmed) {
                     recargaPaginadoPrincipal();
                  }
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
                  recargaPaginadoPrincipal();
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
// TODO: Proceso de cancelacion
const eliminarPaquete = (reg) => {
   let titulo =   `Confirma <span class="fw-bold text-danger">ELIMINAR</span> el paquete con el ID
                  <span class="fw-bold">${reg.id_paquete}</span>`;
   Swal.fire({
      title: 'Confirmaci&oacute;n',
      html: '<p class="p-font-msg-1-2">\u{BF}'+titulo+'?</p>',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, confirmar',
   }).then((result) => {
      if (result.isConfirmed) {
         deletePaquete(reg.id_paquete);
      }
   });
}
//!
const deletePaquete = (id_paquete) => {
   let formData = new FormData();
   formData.append("id_paquete", id_paquete);
   $.ajax({
      type: 'post',
      url: contexto+nameController+'/procesoEliminacion',
      async: true,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlayprincipal").show();
         targetPrincipal = document.getElementById('frmPaquetes');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         if (data.respuesta == false) {
            if(parseInt(data.valid) > 0) {
               Swal.fire({
                  title: 'VALIDACIÓN',
                  html: '<p class="p-font-msg-1-2">'+data.mensaje+'</p>',
                  icon: 'warning',
                  showCancelButton: false,
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  allowEnterKey: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Aceptar',
               }).then((result) => {
                  if (result.isConfirmed) {
                     recargaPaginadoPrincipal();
                  }
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
                  recargaPaginadoPrincipal();
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
// TODO: Descargar informe en Excel
const vmDescargarInfo = (tipo) => {
   let html = '';
   let botones = '';
   let titulo = `Generar Informe de Notificaciones`;
   const fechaInicio = $("#txt_fechas").attr('fechaInicio');
   const fechaActual = $("#txt_fechas").attr('fechaActual');
   //
   html +=  `<form method="post" class="app-form frm-modal-din" id="frmDescInf" name="frmDescInf" novalidate onsubmit="return false">
               <div class="row mb-2">
                  <div class="col-sm-6">
							<label class="form-label">Fecha Inicio</label>
							<input type="date" class="form-control" id="vm_fecha_inicio" name="vm_fecha_inicio" style="height: 40px;"
                        onchange="validFechaDescarga()" required value="${fechaInicio}">
                     <div class="invalid-feedback">Fecha inicio requerido</div>        
						</div>
                  <div class="col-sm-6">
							<label class="form-label">Fecha T&eacute;rmino</label>
							<input type="date" class="form-control" id="vm_fecha_termino" name="vm_fecha_termino" style="height: 40px;"
                        required value="${fechaActual}">
                     <div class="invalid-feedback">Fecha t&eacute;rmino requerido</div>        
						</div>
               </div>
            </form>`;

   botones +=  `<button type="button" class="btn btn-info me-1" btn="btn" id="btn_descargar_informe">
                  <i class="fa-solid fa-download me-2"></i>Descargar Informe
               </button>
               <button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" id="btn_cerrar_vmgenerarInfo">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modal('frmPaquetes', titulo, html, 'formdefault_scrollable_center', botones, 'cerrarVMGenerarInfo()');
   validFechaDescarga();
   //
   $("#btn_descargar_informe").on("click", function () {
      validDescargaInf(tipo);
   });
   //
   $("#btn_cerrar_vmgenerarInfo").on("click", function () {
      cerrarVMGenerarInfo();
   });
}
//!
const cerrarVMGenerarInfo = () => {
   closeModal();
}
//!
const validFechaDescarga = () => {
   const fActual = fechaActual();
	const fechaInicio = $("#vm_fecha_inicio").val();
	if(fechaInicio > fActual.fecha2) {
		$("#vm_fecha_termino").val(fechaInicio);
	}
	else{
		$("#vm_fecha_termino").val(fActual.fecha2);
	}
	$("#vm_fecha_termino").prop("min",fechaInicio);
}
//!
const validDescargaInf = (tipo) => {
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal-din');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0) {
      if(parseInt(tipo) == 1) {
         descargarInfNotificaionesGral();
      }
   }
}
//!
const descargarInfNotificaionesGral = () => {
   $('button[btn="btn"]').prop('disabled',true);
   $("#overlayprincipal").show();
   $("#btn_descargar_informe").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Descargar Informe</button></li>');
   targetPrincipal = document.getElementById('frmPaquetes');
   spinnerPrincipal = new Spinner().spin(targetPrincipal);
   const fActual = fechaActual();
   const nombreExcel = `informe_notificaciones_gral_${fActual.fechaHora}.xlsx`;
   //
   let xhr = new XMLHttpRequest();
	xhr.open('post', contexto+'Reportes/informeNotificacionesGral', true);
   xhr.responseType = 'blob';
   xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=utf-8');
   xhr.onload = function () {
      let blob = new Blob([this.response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      if(window.navigator && window.navigator.msSaveOrOpenBlob){
         window.navigator.msSaveOrOpenBlob(blob);
         return;
      }
      let downloadURL = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = downloadURL;
      a.download = nombreExcel;
      a.click();
      window.URL.revokeObjectURL(downloadURL);
      a.remove();
      $('button[btn="btn"]').prop('disabled',false);
      $("#btn_descargar_informe").html('<i class="fa-solid fa-download me-2"></i>Descargar Informe</button></li>');
      spinnerPrincipal.stop();
      $("#overlayprincipal").hide();
   }
   xhr.send($("#frmDescInf").serialize());
}
// TODO: Descargar informe en PDf
function descargarInfoPaquete(reg) {
   $('button[btn="btn"]').prop('disabled',true);
   $("#overlayprincipal").show();
   targetPrincipal = document.getElementById('frmPaquetes');
   spinnerPrincipal = new Spinner().spin(targetPrincipal);
   let urlInformes = contextoInfo;
   let idPaquete = reg.id_paquete;

   let xhr = new XMLHttpRequest();
   xhr.open('post', urlInformes+"notificaciones/paquete/inf_paquete_notificacion.jsp", true);
   xhr.responseType = 'blob';
   xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=utf-8');
   xhr.onload = function () {
      let blob = new Blob([this.response], {type: 'application/pdf'});
      if(window.navigator && window.navigator.msSaveOrOpenBlob){
         window.navigator.msSaveOrOpenBlob(blob);
         return;
      }
      let downloadURL = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = downloadURL;
      a.download = "info_paquete_notif_"+idPaquete+".pdf";
      a.click();
      window.URL.revokeObjectURL(downloadURL);
      a.remove();
      $('button[btn="btn"]').prop('disabled',false);
      spinnerPrincipal.stop();
      $("#overlayprincipal").hide();
   }
   xhr.send('pid_paquete='+idPaquete);
}