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
	//loadPaquetesPag();

	$("#btnBuscar").on("click", function () {
		loadPaquetesPag();
	});

	$("#btnNuevo").on("click", function () {
		vmRegistro('','N');
	});

	$("#txt_id_num_oficio").keypress(function (e) {
      keyEvent(e);
   });
});

const loadPaquetesPag = () => {
	table.setTablaHTML("gridPaquetes");
	table.setUrl(contexto+nameController+"/notificacionesPag");
	table.setRegistrosPagina(10);
	table.setColumnas("desc_num_oficio,foficio,domicilio,referencia_ubicacion,desc_estatus,band");
	table.setColTipos("textHTML,text,text,text,textHTML,dropdown");
	table.setAlineacion("left,center,left,left,center,center");
	let dropdown = {
      "col6": {
         "opciones": [
            {"etiqueta":"", "titulo": "Opc. Notificación", "icono": "fa-solid fa-list-ul fa-lg", "tooltip": "Lista de opciones", "tipoicono": "i",
               "menu":[
                 { "campo_bd": "band_detalle", "valor_campo": "1", "icono": "fa-solid fa-circle-info fa-lg", "callback": "detalle", "etiqueta": "Detalle", "tipoicono": "i", "color": "color_blue" },
                 { "campo_bd": "icon_editar", "valor_campo": "1", "icono": "fa-solid fa-pen-to-square fa-lg", "callback": "editarNotificacion", "etiqueta": "Editar", "tipoicono": "i", "color": "color_black" },
                 { "campo_bd": "icon_cancelar", "valor_campo": "1", "icono": "fa-solid fa-circle-xmark fa-lg", "callback": "cancelarNotificacion", "etiqueta": "Cancelar", "tipoicono": "i", "color": "color_red" }
               ]
            }
         ]
      }
   }
	table.setDropDown(dropdown);
	table.setParametros($("#frmfrmPaquetes").serialize());
	table.loadJSON();
}
//!
const recargaPaginadoPrincipal = () => {
   table.parametros = $("#frmfrmPaquetes").serialize();
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
const editarNotificacion = (reg) =>{
   vmRegistro(reg.id_notificacion,'E');
   $("#vm_num_oficio").val(reg.num_oficio);
   $("#vm_fecha_oficio").val(reg.fecha_oficio);
   $("#vm_domicilio").val(reg.domicilio);
   $("#vm_referencia_ubicacion").val(reg.referencia_ubicacion);
}
// TODO: Proceso de cancelacion
const cancelarNotificacion = (reg) => {
   let titulo =   `Confirma <span class="fw-bold text-danger">CANCELAR</span> la notificaci&oacute;n con el Num. Oficio
                  <span class="fw-bold">${reg.num_oficio}</span>`;
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
         updateCancelar(reg.id_notificacion);
      }
   });
}
//!
const updateCancelar = (id_notificacion) => {
   let formData = new FormData();
   formData.append("id_notificacion", id_notificacion);
   $.ajax({
      type: 'post',
      url: contexto+nameController+'/procesoCancelado',
      async: true,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlayprincipal").show();
         targetPrincipal = document.getElementById('frmfrmPaquetes');
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