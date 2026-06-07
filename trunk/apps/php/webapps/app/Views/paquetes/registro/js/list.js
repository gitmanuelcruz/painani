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

	$("#btnNuevo").on("click", function () {
		vmRegistro('','N');
	});

	$("#txt_id_num_oficio,#txt_nombre_notificador").keypress(function (e) {
      keyEvent(e);
   });

   $("#btn_inf_detalle_notif").on("click", function () {
      descargarInformeNotif();
   });
});

const loadPaquetesPag = () => {
	table.setTablaHTML("gridPaquetes");
	table.setUrl(contexto+nameController+"/paquetesPag");
	table.setRegistrosPagina(10);
	table.setColumnas("id_paquete,notificador,fprogramada,fapertura,fcierre,total_notificaciones,band");
	table.setColTipos("text,text,text,text,text,numeroSD,dropdown");
	table.setAlineacion("left,left,center,center,center,center,center");
	let dropdown = {
      "col7": {
         "opciones": [
            {"etiqueta":"", "titulo": "Opc. Paquete", "icono": "fa-solid fa-list-ul fa-lg", "tooltip": "Lista de opciones", "tipoicono": "i",
               "menu":[
                  { "campo_bd": "band_detalle", "valor_campo": "1", "icono": "fa-solid fa-circle-info fa-lg", "callback": "detalle", "etiqueta": "Detalle", "tipoicono": "i", "color": "color_blue" },
                  { "campo_bd": "icon_editar", "valor_campo": "1", "icono": "fa-solid fa-pen-to-square fa-lg", "callback": "editarPaquete", "etiqueta": "Editar", "tipoicono": "i", "color": "color_black" },
                  { "campo_bd": "icon_eliminar", "valor_campo": "1", "icono": "fa-solid fa-trash fa-lg", "callback": "eliminarPaquete", "etiqueta": "Eliminar", "tipoicono": "i", "color": "color_red" },
                  { "campo_bd": "icon_informe","valor_campo": "1", "icono": "fa-solid fa-print fa-lg","callback": "descargarInfoPaquete", "etiqueta": "Imprimir Inf.", "tipoicono": "i", "color": "color_red" }
               ]
            }
         ]
      }
   }
	table.setDropDown(dropdown);
	table.setParametros($("#frmPaquetes").serialize());
	table.loadJSON();
}
//!
const recargaPaginadoPrincipal = () => {
   table.parametros = $("#frmPaquetes").serialize();
   table.loadJSON(table.pagina);
}
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
// TODO: Proceso de edicion
const editarPaquete = (reg) =>{
   vmRegistro(reg.id_paquete,'E');
   $("#vm_fecha_programada").val(reg.fecha_programada);
   cargaComboRegistro(true,true,reg.id_paquete,reg.id_notificador);
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
// TODO: INFORMES EN EXCEL
const descargarInformeNotif = () => {
   let nombreExcel = "InformeNotificaciones.xlsx";
   $("#overlayprincipal").show();
   $('button[btn="btn"]').prop('disabled',true);
   $("#btn_inf_detalle_notif").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Inf. Notificaciones</button></li>');
   targetPrincipal = document.getElementById('frmPaquetes');
   spinnerPrincipal = new Spinner().spin(targetPrincipal);
   //
   let xhr = new XMLHttpRequest();
	xhr.open('post', contexto+nameController+"/obtieneInformeNotificaciones", true);
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
      $("#btn_inf_detalle_notif").html('<i class="fa-solid fa-download me-2"></i>Inf. Notificaciones</button></li>');
      spinnerPrincipal.stop();
      $("#overlayprincipal").hide();
   }
   xhr.send($("#frmPaquetes").serialize());
}
//!
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