let target;
let spinner;
let tblCambios = new MTable();
let TBEmpleados = new MTable();
let tBonos = new MTable();

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
	loadCambios();

	$("#btnBuscar").on("click", function () {
		loadCambios();
	});

	$("#btnNuevo").on("click", function () {
		vmdal_reg_cambios('','N');
	});

	$("#desc_motivo").keypress(function (e) {
      keyEvent(e);
   });
});

function loadCambios() {
	tblCambios.setTablaHTML("gridCambios");
	tblCambios.setUrl(contexto+"Cambios/cambiosEmpleadosPag");
	tblCambios.setRegistrosPagina(10);
	tblCambios.setColumnas("id_cambio,id_cambio,curp,nombre_empleado,nombre_cambio,fecha_cambio_desc,motivo,nombre_estatus_cambio,detalle");
	tblCambios.setColTipos("icon,text,text,text,text,text,text,text,dropdown");
	tblCambios.setAlineacion("center,left,left,left,left,left,left,center,center");
   let iconos = {
      "col1": {
         "opciones": [
            { "campo_bd": "id_estatus_cambio", "valor_campo": "OBSERVADO", "icono": "fa-solid fa-comment-dots fa-lg", "callback": "verObservacion", "tooltip": "Observación", "tipoicono": "i", "color": "color_blue" }
         ]
      }
   }
	let dropdown = {
      "col9": {
         "opciones": [
            {"etiqueta":"", "titulo": "Opciones", "icono": "fa-solid fa-list-ul fa-lg", "tooltip": "Lista de opciones", "tipoicono": "i",
               "menu":[
                 { "campo_bd": "icon_aplicar", "valor_campo": "1", "icono": "fa-solid fa-circle-info fa-lg", "callback": "infoCambio", "etiqueta": "Info", "tipoicono": "i", "color": "color_blue" },
                 { "campo_bd": "icon_enviar", "valor_campo": "1", "icono": "fa-solid fa-paper-plane fa-lg", "callback": "enviarCambio", "etiqueta": "Enviar", "tipoicono": "i", "color": "color_blue" },
                 { "campo_bd": "icon_aplicar", "valor_campo": "1", "icono": "fa-solid fa-check-double fa-lg", "callback": "aplicarCambio", "etiqueta": "Aplicar", "tipoicono": "i", "color": "color_green" },
                 { "campo_bd": "icon_editar", "valor_campo": "1", "icono": "fa-solid fa-pen-to-square fa-lg", "callback": "editarCambio", "etiqueta": "Editar", "tipoicono": "i", "color": "color_black" },
                 { "campo_bd": "icon_regresar", "valor_campo": "1", "icono": "fa-solid fa-reply fa-lg", "callback": "regresarCambio", "etiqueta": "Regresar", "tipoicono": "i", "color": "color_blue" },
                 { "campo_bd": "icon_cancelar", "valor_campo": "1", "icono": "fa-solid fa-circle-xmark fa-lg", "callback": "cancelarCambio", "etiqueta": "Cancelar", "tipoicono": "i", "color": "color_red" }
               ]
            }
         ]
      }
   }
   tblCambios.setIconos(iconos);
	tblCambios.setDropDown(dropdown);
	tblCambios.setParametros($("#frmCambios").serialize());
	tblCambios.loadJSON();
}

function recargaPaginadoPrincipal() {
   tblCambios.parametros = $("#frmCambios").serialize();
   tblCambios.loadJSON(tblCambios.pagina);
}
//!
function infoCambio(reg){
   let tar;
	let spin;
   let html = "";
   let vid_banco;
   vmdal_reg_cambios(reg.id_cambio,'E');
	cargaComboTipoCambio(true,reg.id_tipo_cambio);
   $("#vm_id_empleado").val(reg.id_empleado);
   $("#vm_nombre_empleado").val(reg.nombre_empleado);
   $("#vm_fecha_cambio").val(reg.fecha_cambio);
   $("#vm_motivo").val(reg.motivo);
   
   $("#divCampos").empty();
	$.ajax({
      type: 'post',
      url: contexto+'Cambios/getCamposValor',
      async: true,
      dataType: 'JSON',
		data: 'pid_cambio='+reg.id_cambio,
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlay").show();
         tar = document.getElementById('frmCambios');
         spin = new Spinner().spin(tar);
      },
      success: function (data) {
         $(data.dataCamposValores).each(function(i, v) {
            html = "";
            html += `<div class="col-sm-12 col-md-4 col-lg-4 mb-2">
                        <label class="form-label">${v.etiqueta_label}</label>
                        ${v.html_objeto}
                     </div>`;
            $("#divCampos").append(html);
            if(v.nombre_tipo_dato == 'Primary'){
               vid_banco = v.valor;
               vid_puesto = v.valor;
               vid_gupo = v.valor;
            }
            $("#"+v.nombre_campo+"").val(v.valor);
            $("#"+v.nombre_campo+"").prop('disabled', true);
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spin.stop();
         $("#overlay").hide();
         $(".selectpicker").select2({dropdownParent: $("#vModalXL")});
         cargaCombosCampos(true,vid_banco);
      }
   });
   $("#vm_id_tipo_cambio,#vm_id_empleado,#vm_nombre_empleado,#vm_fecha_cambio,#vm_motivo").prop('disabled', true);
   $("#bt_guardar_nom,#bt_limpiar_cam").hide();
}

//!
function editarCambio(reg){
   let tar;
	let spin;
   let html = "";
   let vid_banco;
   vmdal_reg_cambios(reg.id_cambio,'E');
	cargaComboTipoCambio(true,reg.id_tipo_cambio);
   $("#vm_id_empleado").val(reg.id_empleado);
   $("#vm_id_empleado_plaza").val(reg.id_empleado);
   $("#vm_nombre_empleado").val(reg.nombre_empleado);
   $("#divDatosEmpleado").show();
   $("#labelCurp").html(reg.curp);
   $("#labelPuesto").html(reg.puesto+' ('+reg.grupo+')');
   $("#labelCtrabajo").html(reg.centro_trabajo);
   $("#vm_fecha_cambio").val(reg.fecha_cambio);
   $("#vm_motivo").val(reg.motivo);
   $("#divCampos").empty();
	$.ajax({
      type: 'post',
      url: contexto+'Cambios/getCamposValor',
      async: true,
      dataType: 'JSON',
		data: 'pid_cambio='+reg.id_cambio,
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlay").show();
         tar = document.getElementById('frmCambios');
         spin = new Spinner().spin(tar);
      },
      success: function (data) {
         $(data.dataCamposValores).each(function(i, v) {
            html = "";
            html += `<div class="col-sm-12 col-md-4 col-lg-4 mb-2">
                        <label class="form-label">${v.etiqueta_label}</label>
                        ${v.html_objeto}
                     </div>`;
            $("#divCampos").append(html);
            if(v.nombre_tipo_dato == 'Primary'){
               vid_banco = v.valor;
               vid_puesto = v.valor;
               vid_gupo = v.valor;
            }
            $("#"+v.nombre_campo+"").val(v.valor);
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spin.stop();
         $("#overlay").hide();
         $(".selectpicker").select2({dropdownParent: $("#vModalXL")});
         cargaCombosCampos(true,vid_banco);
      }
   });
}
//!
function verObservacion(reg) {
   let html = "";
   let botones = "";
   let titulo = 'Observaci&oacute;n del ID: '+reg.id_cambio;
   html +=  `<form method="post" onsubmit="return false">
               <div class="row mb-2">
                  <div class="col-sm-12">
                     <label class="p-font-color_black p-font-msg p-font-weight-500">${reg.observacion}</label>
            		</div>
               </div>
               <br>
            </form>`;

   botones += `<button type="button" class="btn btn-danger" data-bs-dismiss="modal">
                 <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modal('frmCambios', titulo, html, 'formdefault_scrollable', botones, null); 
}
// TODO: Proceso de editar la nomina
function editarDiaInhabil(reg){
	vmdal_reg_cambios(reg.id_dia_inhabil,'E');
	$("#vm_fecha_dia").val(reg.fecha);
   $("#vm_motivo").val(reg.motivo);
	cargaCombosRegDia(true,reg.id_alcance,reg.id_estado);
   if(reg.recurrente == 1){
      $("#txt_recurrente").prop('checked',true);
	   $("#txt_recurrente").val(1);
   }
   else{
      $("#txt_recurrente").prop('checked',false);
	   $("#txt_recurrente").val(0);
   }
}
//!
function validCombos(id,id2) {
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
//!
function enviarCambio(reg) {
   let titulo =   'Confirma <span class="p-font-weight">ENVIAR</span> el cambio de <span class="p-font-weight">'+reg.nombre_cambio+
                  '</span> al empleado <span class="p-font-weight">'+reg.nombre_empleado+'</span>';
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
         updateEnviarCambio(reg.id_cambio);
      }
   });
}
//!
function updateEnviarCambio(id_cambio) {
   let formData = new FormData();
   formData.append("pid_cambio", id_cambio);
   $.ajax({
      type: 'post',
      url: contexto+'Cambios/actualizarCambioEnviado',
      async: true,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlay").show();
         target = document.getElementById('frmCambios');
         spinner = new Spinner().spin(target);
      },
      success: function (data) {
         if (data.respuesta === false) {
            Swal.fire({
               title: 'HA OCURRIDO UN ERROR!',
               html: '<p class="p-font-msg">' + data.mensaje + '</p>',
               icon: 'error',
               showDenyButton: true,
               denyButtonText: 'Aceptar',
               showConfirmButton: false
            });
         }
         else {
            Swal.fire({
               title: '¡ P r o c e s o &nbsp;&nbsp; E x i t o s o !',
               html: '<p class="p-font-msg">' + data.mensaje + '</p>',
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
            html: '<p class="p-font-msg">' + thrownError + '</p>',
            icon: 'error',
            showDenyButton: true,
            showConfirmButton: false,
            denyButtonText: "Aceptar"
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled', false);
         spinner.stop();
         $("#overlay").hide();
      }
   });
}
//!
function aplicarCambio(reg) {
   let titulo = 'Confirma <span class="p-font-weight">APLICAR</span> el cambio de <span class="p-font-weight">'+reg.nombre_cambio+
                '</span> al empleado <span class="p-font-weight">'+reg.nombre_empleado+'</span>';
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
         updateAplicarCambio(reg.id_cambio);
      }
   });
}
//!
function updateAplicarCambio(id_cambio) {
   let formData = new FormData();
   formData.append("pid_cambio", id_cambio);
   $.ajax({
      type: 'post',
      url: contexto+'Cambios/aplicarCambioEmpleado',
      async: true,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlay").show();
         target = document.getElementById('frmCambios');
         spinner = new Spinner().spin(target);
      },
      success: function (data) {
         if (data.respuesta === false) {
            Swal.fire({
               title: 'HA OCURRIDO UN ERROR!',
               html: '<p class="p-font-msg">' + data.mensaje + '</p>',
               icon: 'error',
               showDenyButton: true,
               denyButtonText: 'Aceptar',
               showConfirmButton: false
            });
         }
         else {
            Swal.fire({
               title: '¡ P r o c e s o &nbsp;&nbsp; E x i t o s o !',
               html: '<p class="p-font-msg">' + data.mensaje + '</p>',
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
            html: '<p class="p-font-msg">' + thrownError + '</p>',
            icon: 'error',
            showDenyButton: true,
            showConfirmButton: false,
            denyButtonText: "Aceptar"
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled', false);
         spinner.stop();
         $("#overlay").hide();
      }
   });
}
//!
function keyEvent(event) {
   var tecla = (event.all) ? window.event : event.which;
   if (tecla == 13) {
      loadCambios();
   }
   else {
      return false;
   }
}
function regresarCambio(reg) {
	let html = "";
   let botones = "";
   let titulo = 'Obervaci&oacute;n del cambio con el ID &raquo; <span class="p-font-weight">'+reg.id_cambio+'</span>';
   
   html +=  `<form method="post" class="frm-modal-regcambio" id="frmregresacambio" name="frmregresacambio" novalidate onsubmit="return false">
               <input type="text" id="vm_id_cambio" name="vm_id_cambio" value="${reg.id_cambio}">
               <input type="hidden" id="vm_nombre_cambio" name="vm_nombre_cambio" value="${reg.nombre_cambio}">
               <input type="hidden" id="vm_nombre_empleado" name="vm_nombre_empleado" value="${reg.nombre_empleado}">`;
   html +=  `  <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12 mt-2">
							<label class="form-label">Observaci&oacute;n</label>
							<textarea id="vm_observacion" name="vm_observacion" class="form-control" maxlength="799"  rows="3" required></textarea>
                     <div class="invalid-feedback">Observaci&oacute;n requerido</div>  
						</div>
               </div>
            </form>
            <div id="overlay2" class="overlay"></div>`;

   botones +=  '<button type="button" id="bt_guardar_nom" class="btn btn-info" btn="btn" onclick="validacionRegresar()">'+
               '	<i class="fa-solid fa-floppy-disk me-2"></i>Guardar</button>&nbsp;';
   botones +=  '<button type="button" class="btn btn-secondary" btn="btn" onclick="limpiarFrmRegreso()">'+
               '	<i class="fa-solid fa-eraser me-2"></i>Limpiar</button>&nbsp;';
   botones +=  '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="recargaPaginadoPrincipal()">'+
               '  <i class="fa-solid fa-xmark me-2"></i>Cerrar</button>';

   modal('frmCambios', titulo, html, 'formdefault', botones, 'recargaPaginadoPrincipal()');

}
//!
function validacionRegresar() {
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal-regcambio');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
      }
      form.classList.add('was-validated');
   });
   
   if(contador === 0) {
      confirmarcionRegreso();
   }
}
//!
function limpiarFrmRegreso() {
	$("#frmregresacambio").removeClass('frm-modal-regcambio was-validated').addClass('frm-modal-regcambio');
   $("#vm_observacion").val('');
}
//!
function confirmarcionRegreso() {
   let titulo = 'Confirma <span class="p-font-weight">REGRESAR</span> el cambio de <span class="p-font-weight">'+$("#vm_nombre_cambio").val()+
                '</span> del empleado <span class="p-font-weight">'+$("#vm_nombre_empleado").val()+'</span>';
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
         updateRegresaCambio();
      }
   });
}
//!
function updateRegresaCambio() {
   let formData = new FormData();
   formData.append("pid_cambio", $("#vm_id_cambio").val());
   formData.append("pobservacion", $("#vm_observacion").val());
   $.ajax({
      type: 'post',
      url: contexto+'Cambios/actualizarRegresoCambio',
      async: true,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlay").show();
         target = document.getElementById('frmCambios');
         spinner = new Spinner().spin(target);
      },
      success: function (data) {
         if (data.respuesta === false) {
            Swal.fire({
               title: 'HA OCURRIDO UN ERROR!',
               html: '<p class="p-font-msg">' + data.mensaje + '</p>',
               icon: 'error',
               showDenyButton: true,
               denyButtonText: 'Aceptar',
               showConfirmButton: false
            });
         }
         else {
            Swal.fire({
               title: '¡ P r o c e s o &nbsp;&nbsp; E x i t o s o !',
               html: '<p class="p-font-msg">' + data.mensaje + '</p>',
               icon: 'success',
               showCancelButton: false,
               allowOutsideClick: false,
               allowEscapeKey: false,
               allowEnterKey: false,
               confirmButtonColor: '#3085d6',
               confirmButtonText: 'Aceptar',
            }).then((result) => {
               if (result.isConfirmed) {
                  limpiarFrmRegreso();
                  closeModal();
                  recargaPaginadoPrincipal();
               }
            });
         }
      },
      error: function (xhr, ajaxOptions, thrownError) {
         Swal.fire({
            title: 'HA OCURRIDO UN ERROR!',
            html: '<p class="p-font-msg">' + thrownError + '</p>',
            icon: 'error',
            showDenyButton: true,
            showConfirmButton: false,
            denyButtonText: "Aceptar"
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled', false);
         spinner.stop();
         $("#overlay").hide();
      }
   });
}
//!
function cancelarCambio(reg) {
   let titulo = 'Confirma <span class="p-font-weight">CANCELAR</span> el cambio de <span class="p-font-weight">'+reg.nombre_cambio+
                '</span> del empleado <span class="p-font-weight">'+reg.nombre_empleado+'</span>';
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
         updateCancelarCambio(reg.id_cambio);
      }
   });
}
//!
function updateCancelarCambio(id_cambio) {
   let formData = new FormData();
   formData.append("pid_cambio", id_cambio);
   $.ajax({
      type: 'post',
      url: contexto+'Cambios/actualizarCambioCancelado',
      async: true,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlay").show();
         target = document.getElementById('frmCambios');
         spinner = new Spinner().spin(target);
      },
      success: function (data) {
         if (data.respuesta === false) {
            Swal.fire({
               title: 'HA OCURRIDO UN ERROR!',
               html: '<p class="p-font-msg">' + data.mensaje + '</p>',
               icon: 'error',
               showDenyButton: true,
               denyButtonText: 'Aceptar',
               showConfirmButton: false
            });
         }
         else {
            Swal.fire({
               title: '¡ P r o c e s o &nbsp;&nbsp; E x i t o s o !',
               html: '<p class="p-font-msg">' + data.mensaje + '</p>',
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
            html: '<p class="p-font-msg">' + thrownError + '</p>',
            icon: 'error',
            showDenyButton: true,
            showConfirmButton: false,
            denyButtonText: "Aceptar"
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled', false);
         spinner.stop();
         $("#overlay").hide();
      }
   });
}