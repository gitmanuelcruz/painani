let table = new MTable();
$(document).ready(function () {
   getRoles();

   $("#btnBuscar").on("click", function () {
      getRoles();
   });

   $("#btnNuevo").on("click", function () {
      ventanaNuevo('', 'Registro de Rol', 'N');
   });

   $("#name_descripcion").keypress(function (e) {
      keyEvent(e);
   });
});

function getRoles() {
   table.setTablaHTML("tblRoles");
   table.setUrl(contexto+"Roles/getRoles");
   table.setRegistrosPagina(10);
   table.setColumnas("nombre_rol,descripcion,desc_estatus,configuracion,edicion");
   table.setColTipos("text,text,text,icon,icon");
   table.setAlineacion("left,left,center,center,center");
   let iconos = {
      "col4": {
         "opciones": [
            { "campo_bd": "configuracion", "valor_campo": "0", "icono": "fa-solid fa-ban fa-lg", "callback": "", "tooltip": "Sin privilego para configurar", "tipoicono": "i", "color": "color_red" },
            { "campo_bd": "configuracion", "valor_campo": "1", "icono": "fa-solid fa-gear fa-lg", "callback": "configuracionRol", "tooltip": "Configuración del Rol", "tipoicono": "i", "color": "color_green" },
            { "campo_bd": "configuracion", "valor_campo": "2", "icono": "fa-solid fa-gear fa-lg", "callback": "configuracionRol", "tooltip": "Configuración del Rol", "tipoicono": "i", "color": "color_black" }
         ]
      },
      "col5": {
         "opciones": [
            { "campo_bd": "edicion", "valor_campo": "1", "icono": "fa-solid fa-pen-to-square fa-lg", "callback": "editarRol", "tooltip": "Editar Rol", "tipoicono": "i", "color": "color_black"}
         ]
      }
   };
   table.setIconos(iconos);
   table.fontSize = "0.8rem";
   table.parametros = $("#froles").serialize();
   table.loadJSON();
}

function recargaPaginadoPrincipal() {
   table.parametros = $("#froles").serialize();
   table.loadJSON(table.pagina);
}

function editarRol(reg) {
   $('.tooltip_icon_pag').tooltip('hide');
   ventanaNuevo(reg.id_rol,'Edici&oacute;n del Rol','E');
   $("#vm_nombre_rol").val(reg.nombre_rol);
   $("#vm_descripcion_rol").val(reg.descripcion);
   $("#vm_id_estatus").val(reg.rol_activo).trigger('change');
}

function ventanaNuevo(id_rol,titulo,tipo) {
   $('.tooltip_icon_pag').tooltip('hide');
   let html = '';
   let botones = '';

   html +=  '<form method="post" class="app-form frm-modal" id="frmodalv" name="frmodalv" novalidate onsubmit="return false">' +
            '  <input type="hidden" id="vm_id_rol" name="vm_id_rol" value="'+id_rol+'">' +
            '  <input type="hidden" id="vm_tipo" name="vm_tipo" value="'+tipo+'">'+
            '  <input type="hidden" id="vm_contador_valid" value="0">';
   html +=  '  <div class="row mb-2">' +
            '     <div class="col-sm-12">' +
            '        <label class="form-label">Nombre</label>'+
            '        <input type="text" class="form-control" id="vm_nombre_rol" name="vm_nombre_rol" maxlength="99" style="height:40px" required>'+
            '        <div class="invalid-feedback">Nombre requerido</div>'+
            '		</div>'+
            '  </div>';
   
   html +=  '  <div class="row mb-2">'+
            '     <div class="col-sm-12">'+
            '        <label class="form-label">Descripci&oacute;n</label>'+
            '        <textarea type="text" class="form-control" id="vm_descripcion_rol" name="vm_descripcion_rol" maxlength="399" required></textarea>'+
            '        <div class="invalid-feedback">Descripci&oacute;n requerido</div>' +
            '		</div>'+
            '  </div>';

   html +=  '  <div class="row mb-2">';
   if(tipo === 'E') {
      html +=  '     <div class="col-sm-6">'+
               '        <label class="form-label">Estatus</label>'+
               '			<div class="form-group" id="divEstatus">'+
               '        	<select class="form-control selectpicker" id="vm_id_estatus" name="vm_id_estatus" required style="width:100%" '+
               '					onchange="validCombos(this.id,'+"'divEstatus'"+')">'+
               '					<option value="">[Seleccione una opci&oacute;n]</option>'+
               '              <option value="1">Activo</option>' +
               '              <option value="0">Inactivo</option>' +
               '        	</select>'+
               '        	<div class="invalid-feedback">Estatus requerido</div>'+
               '			</div>'+
               '		</div>';
   }
   html +=  '  </div>';
   html += '</form>';

   botones +=  '<button type="button" id="bt_guardar" class="btn btn-info me-1" btn="btn" onclick="validacionRol()">'+
               '   <i class="fa-solid fa-floppy-disk me-2"></i>Guardar</button>';
   botones +=  '<button type="button" id="bt_limpiarv" class="btn btn-secondary me-1" btn="btn" onclick="limpiar_vm()">'+
               '   <i class="fa-solid fa-eraser me-2"></i>Limpiar</button>';
   botones +=  '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="recargaPaginadoPrincipal()">'+
               '   <i class="fa-solid fa-xmark me-2"></i>Cerrar</button>';
   modalLG('froles', titulo, html, 'formlg_scrollable', botones, 'recargaPaginadoPrincipal()');
   $(".selectpicker").select2({dropdownParent: $("#vModalLG")});
}
//!
function limpiar_vm() {
   let tipo = $("#vm_tipo").val();
   if (tipo == 'N') {
      $("#vm_id_rol").val('');
   }
   else {
      $("#vm_id_estatus").val('1').trigger('change');
   }
   $("#vm_nombre_rol").val('');
   $("#vm_descripcion_rol").val('');
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
function validacionRol() {
   $("#vm_contador_valid").val(1);
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
      .forEach(function (form) {
         if (!form.checkValidity()) {
            contador++;
            if($("#vm_id_estatus").val() == '') {
               $("#divEstatus").removeClass('has-valid').addClass('has-error');;
            }
            else {
               $("#divEstatus").removeClass('has-error').addClass('has-valid');
            }
         }
         form.classList.add('was-validated');
      });

   if (contador == 0) {
      $("#divEstatus").removeClass('has-error').addClass('has-valid');
      Swal.fire({
         title: 'Confirmaci&oacute;n',
         html: '<p class="p-font-msg-1-2 text-dark">\u{BF}Confirma que los datos son correctos?</p>',
         icon: 'warning',
         showCancelButton: true,
         cancelButtonText: 'Cancelar',
         cancelButtonColor: '#d33',
         confirmButtonColor: '#3085d6',
         confirmButtonText: 'Si, confirmar',
      }).then((result) => {
         if (result.isConfirmed) {
            guardarRol();
         }
      });
   }
}
//!
function guardarRol() {
   let formData = new FormData();
   formData.append("vm_id_rol", $('#vm_id_rol').val());
   formData.append("vm_nombre_rol", $('#vm_nombre_rol').val());
   formData.append("vm_descripcion_rol", $('#vm_descripcion_rol').val());
   if ($("#vm_tipo").val() == 'E') {
      formData.append("vm_id_estatus",$('#vm_id_estatus').val());
   }
   else {
      formData.append("vm_id_estatus",1);
   }
   $.ajax({
      type: 'post',
      url: contexto+'Roles/guardarRol',
      async: true,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', false);
         $("#overlayprincipal").show();
         $("#bt_guardar").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Guardar');
         targetPrincipal = document.getElementById('froles');
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
                  if ($("#vm_tipo").val() == 'N') {
                     $("#frmodalv").removeClass('frm-modal was-validated').addClass('frm-modal');
                     limpiar_vm();
                  }
                  else {
                     closeModalLG();
                     recargaPaginadoPrincipal();
                  }
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
         $('button[btn="btn"]').prop('disabled', false);
         $("#bt_guardar").html('<i class="fa-solid fa-floppy-disk"></i>&nbsp;Guardar');
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
function keyEvent(event) {
   let tecla = (event.all) ? event.keyCode : event.which;
   if (tecla == 13) {
      getRoles();
   }
   else {
      return false;
   }
}