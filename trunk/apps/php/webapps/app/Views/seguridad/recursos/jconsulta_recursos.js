let table = new MTable();
$(document).ready(function () {
   getRecursos();

   $("#btnBuscar").on("click", function () {
      getRecursos();
   });

   $("#btnNuevo").on("click", function () {
      ventanaNuevo('', 'Registro de Recurso', 'N');
   });

   $("#codigo, #nombre").keypress(function (e) {
      keyEvent(e);
   });
});
//!
function getRecursos() {
   table.setTablaHTML("tblRecursos");
   table.setUrl(contexto+"Recursos/getRecursos");
   table.setRegistrosPagina(10);
   table.setColumnas("codigo_recurso,nombre_recurso,tabla_fuente,campo_id,campo_visualiza,desc_estatus,edicion");
   table.setColTipos("text,text,text,text,text,text,icon");
   table.setAlineacion("left,left,left,left,left,center,center");
   let iconos = {
      "col7": {
         "opciones": [
            { "campo_bd": "edicion", "valor_campo": "0", "icono": "fa-solid fa-ban fa-lg", "callback": "", "tooltip": "Sin privilego para editar", "tipoicono": "i", "color": "color_red" },
            { "campo_bd": "edicion", "valor_campo": "1", "icono": "fa-solid fa-pen-to-square fa-lg", "callback": "editarRecursos", "tooltip": "Editar Recurso", "tipoicono": "i", "color": "color_black" }
         ]
      }
   };
   table.setIconos(iconos);
   table.fontSize = "0.8rem";
   table.parametros = $("#frecursos").serialize();
   table.loadJSON();
}
//!
function recargaPaginadoPrincipal() {
   table.parametros = $("#frecursos").serialize();
   table.loadJSON(table.pagina);
}
//!
function keyEvent(event) {
   let tecla = (event.all) ? event.keyCode : event.which;
   if (tecla == 13) {
      getRecursos();
   }
   else {
      return false;
   }
}
//!
function editarRecursos(reg) {
   ventanaNuevo(reg.id_recurso, 'Edici&oacute;n del Recurso', 'E');
   $("#text-codigo").text(reg.codigo_recurso);
   $("#vm_nombre_rec").val(reg.nombre_recurso);
   $("#vm_query").val(reg.query_string);
   let tblFuente = reg.tabla_fuente;
   let campoID = reg.campo_id;
   let campoVisualiza = reg.campo_visualiza;
   cargaCombosRecurso(true,3,tblFuente.toLowerCase(),campoID.toLowerCase(),campoVisualiza.toLowerCase(),reg.recurso_activo);
}
//!
function ventanaNuevo(id_recurso,titulo,tipo) {
   $('.tooltip_icon_pag').tooltip('hide');
   let html = '';
   let botones = '';
   let top = (tipo == 'N') ? 'mb-2':'';
   let altura = (tipo == 'N') ? 'height:150px':'height:200px';

   html +=  '<form method="post" class="app-form frm-modal" id="frmodalv" name="frmodalv" novalidate onsubmit="return false">' +
            '  <input type="hidden" id="vm_id_recurso" name="vm_id_recurso" value="'+id_recurso+'">' +
            '  <input type="hidden" id="vm_tipo" name="vm_tipo" value="'+tipo+'">'+
            '  <input type="hidden" id="vm_contador_valid" value="0">';
   html +=  '  <div class="row '+top+'">' +
            '     <div class="col-sm-6">';
   if(tipo === 'N') {
      html +=  '     <label class="form-label">C&oacute;digo</label>'+
               '     <input type="text" class="form-control" id="vm_codigo_rec" name="vm_codigo_rec" maxlength="19" '+
               '        style="height:40px" onkeyup="mayus(this);" required>'+
               '     <div class="invalid-feedback">C&oacute;digo requerido</div>';
   }
   else {
      html +=  '		<figure>'+
               '        <blockquote class="blockquote">'+
               '			   <p class="fw-bold p-font-msg-1-2" id="text-codigo"></p>'+
               '			</blockquote>'+
               '			<figcaption class="blockquote-footer">C&oacute;digo del Recurso</figcaption>'+
               '     </figure>';
   }
   html +=  '		</div>' +
            '  </div>';
   html +=  '  <div class="row mb-2">' +
            '     <div class="col-sm-12">'+
            '        <label class="form-label">Nombre</label>'+
            '        <input type="text" class="form-control" id="vm_nombre_rec" name="vm_nombre_rec" maxlength="99" style="height:40px" required>'+
            '        <div class="invalid-feedback">Nombre requerido</div>' +
            '		</div>'+
            '  </div>';
   html +=  '  <div class="row mb-2">' +
            '     <div class="col-sm-6">' +
            '        <label class="form-label">Tabla Fuente</label>'+
            '			<div class="form-group" id="divTblFuente">'+
            '        	<select class="form-control selectpicker" id="vm_id_tabla" name="vm_id_tabla" required style="width:100%" '+
            '					onchange="cargaCombosRecurso(true,2,this.value,null,null,null);validCombos(this.id,'+"'divTblFuente'"+')">'+
            '					<option value="">[Seleccione una opci&oacute;n]</option>'+
            '        	</select>'+
            '        	<div class="invalid-feedback">Tabla fuente requerido</div>'+
            '			</div>'+            
            '		</div>'+
            '     <div class="col-sm-6">' +
            '        <label class="form-label">Campo ID</label>'+
            '			<div class="form-group" id="divCampoID">'+
            '        	<select class="form-control selectpicker" id="vm_id_campo_id" name="vm_id_campo_id" required style="width:100%" '+
            '					onchange="validCombos(this.id,'+"'divCampoID'"+')">'+
            '					<option value="">[Seleccione una opci&oacute;n]</option>'+
            '        	</select>'+
            '        	<div class="invalid-feedback">Campo ID requerido</div>'+
            '			</div>'+
            '		</div>'+
            '  </div>';
   html +=  '  <div class="row mb-2">'+
            '     <div class="col-sm-6">'+
            '        <label class="form-label">Campo Visualiza</label>'+
            '			<div class="form-group" id="divCampoVisualiza">'+
            '        	<select class="form-control selectpicker" id="vm_id_campo_visualiza" name="vm_id_campo_visualiza" required style="width:100%" '+
            '					onchange="validCombos(this.id,'+"'divCampoVisualiza'"+')">'+
            '					<option value="">[Seleccione una opci&oacute;n]</option>'+
            '        	</select>'+
            '        	<div class="invalid-feedback">Campo visualiza requerido</div>'+
            '			</div>'+
            '		</div>';
   if(tipo === 'E') {
      html +=  '  <div class="col-sm-6">'+
               '     <label class="form-label">Estatus</label>'+
               '		<div class="form-group" id="divEstatus">'+
               '        <select class="form-control selectpicker" id="vm_id_estatus" name="vm_id_estatus" required style="width:100%" '+
               '				onchange="validCombos(this.id,'+"'divEstatus'"+')">'+
               '           <option value="">[Seleccione una opci&oacute;n]</option>'+
               '           <option value="1">ACTIVO</option>' +
               '           <option value="0">INACTIVO</option>' +
               '        </select>'+
               '        <div class="invalid-feedback">Estatus requerido</div>'+
               '		</div>'+
               '	</div>';
   }
   html +=  '  </div>';
   html +=  '  <div class="row mb-2">'+
            '     <div class="col-sm-12">'+
            '        <label class="form-label">Query</label>'+
            '        <textarea type="text" class="form-control" id="vm_query" name="vm_query" maxlength="399" style="'+altura+'"></textarea>'+
            '		</div>'+
            '  </div>';
   html += '</form>';

   botones +=  '<button type="button" id="bt_guardar" class="btn btn-info me-1" btn="btn" onclick="validacionRecurso()">' +
               '   <i class="fa-solid fa-floppy-disk me-2"></i>Guardar</button>';
   botones +=  '<button type="button" id="bt_limpiarv" class="btn btn-secondary me-1" btn="btn" onclick="limpiar_vm()">' +
               '   <i class="fa-solid fa-eraser me-2"></i>Limpiar</button>';
   botones +=  '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="recargaPaginadoPrincipal()">' +
               '   <i class="fa-solid fa-xmark me-2"></i>Cerrar</button>';

   modalLG('frecursos', titulo, html, 'formlg_scrollable', botones, 'recargaPaginadoPrincipal()');
   $(".selectpicker").select2({dropdownParent: $("#vModalLG")});
   if(tipo == 'N') {
      cargaCombosRecurso(true,1,null,null,null,null);
   }
}
//!
function cargaCombosRecurso(async,tipo,id_tabla,id_campo,id_campo_visualiza,id_estatus) {
   $.ajax({
      type: 'post',
      url: contexto+'Recursos/getCombosRecurso',
      async: async,
      dataType: 'json',
      data: 'tipo='+tipo+'&id_tabla='+id_tabla,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlayprincipal").show();
         targetPrincipal = document.getElementById('frecursos');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         if(parseInt(tipo) == 1) {
            $("#vm_id_tabla").html('<option value="">[Seleccione una opci&oacute;n]</option>');
            $(data.tblFuentes).each(function (i, v) {
               $("#vm_id_tabla").append('<option value="'+v.id+'">'+v.descripcion+'</option>');
            });
            $("#vm_id_campo_id").html('<option value="">[Seleccione una opci&oacute;n]</option>');
            $("#vm_id_campo_visualiza").html('<option value="">[Seleccione una opci&oacute;n]</option>');
         }
         else if(parseInt(tipo) == 2) {
            $("#vm_id_campo_id").html('<option value="">[Seleccione una opci&oacute;n]</option>');
            $(data.campo_id).each(function (i, v) {
               $("#vm_id_campo_id").append('<option value="'+v.id+'">'+v.descripcion+'</option>');
            });
            $("#vm_id_campo_visualiza").html('<option value="">[Seleccione una opci&oacute;n]</option>');
            $(data.campo_visualiza).each(function (i, v) {
               $("#vm_id_campo_visualiza").append('<option value="'+v.id+'">'+v.descripcion+'</option>');
            });
         }
         else {
            $("#vm_id_tabla").html('<option value="">[Seleccione una opci&oacute;n]</option>');
            $(data.tblFuentes).each(function (i, v) {
               $("#vm_id_tabla").append('<option value="'+v.id+'">'+v.descripcion+'</option>');
            });
            $("#vm_id_campo_id").html('<option value="">[Seleccione una opci&oacute;n]</option>');
            $(data.campo_id).each(function (i, v) {
               $("#vm_id_campo_id").append('<option value="'+v.id+'">'+v.descripcion+'</option>');
            });
            $("#vm_id_campo_visualiza").html('<option value="">[Seleccione una opci&oacute;n]</option>');
            $(data.campo_visualiza).each(function (i, v) {
               $("#vm_id_campo_visualiza").append('<option value="'+v.id+'">'+v.descripcion+'</option>');
            });

            if(id_tabla !== null && id_tabla !== '') {
               $('#vm_id_tabla').val(id_tabla);
            }
            if(id_campo !== null && id_campo !== '') {
               $('#vm_id_campo_id').val(id_campo);
            }
            if(id_campo_visualiza !== null && id_campo_visualiza !== '') {
               $('#vm_id_campo_visualiza').val(id_campo_visualiza);
            }
            if(id_estatus !== null && id_estatus !== '') {
               $("#vm_id_estatus").val(id_estatus).trigger('change');
            }
         }
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled', false);
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
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
function limpiar_vm() {
   let tipo = $("#vm_tipo").val();
   $("#frmodalv").removeClass("frm-modal was-validated").addClass('frm-modal');
   if (tipo == 'N') {
      $("#vm_id_recurso,#vm_codigo_rec").val('');
   }
   else {
      $("#vm_id_estatus").val(1).trigger('change');
   }
   $("#vm_nombre_rec").val('');
   $("#vm_id_tabla").val('').trigger('change');
   $("#vm_query").val('');
   $("#divTblFuente,#divCampoID,#divCampoVisualiza,#divEstatus").removeClass('has-valid');
   $("#divTblFuente,#divCampoID,#divCampoVisualiza,#divEstatus").removeClass('has-error');
}
//!
function validacionRecurso() {
   $("#vm_contador_valid").val(1);
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
      .forEach(function (form) {
         if (!form.checkValidity()) {
            contador++;
            if($("#vm_id_tabla").val() == '') {
               $("#divTblFuente").removeClass('has-valid').addClass('has-error');
            }
            else {
               $("#divTblFuente").removeClass('has-error').addClass('has-valid');
            }
            if($("#vm_id_campo_id").val() == '') {
               $("#divCampoID").removeClass('has-valid').addClass('has-error');
            }
            else {
               $("#divCampoID").removeClass('has-error').addClass('has-valid');
            }
            if($("#vm_id_campo_visualiza").val() == '') {
               $("#divCampoVisualiza").removeClass('has-valid').addClass('has-error');
            }
            else {
               $("#divCampoVisualiza").removeClass('has-error').addClass('has-valid');
            }
            if($("#vm_tipo").val() == 'E') {
               if($("#vm_id_estatus").val() == '') {
                  $("#divEstatus").removeClass('has-valid').addClass('has-error');
               }
               else {
                  $("#divEstatus").removeClass('has-error').addClass('has-valid');
               }
            }
         }
         form.classList.add('was-validated');
      });

   if (contador == 0) {
      $("#divTblFuente,#divCampoID,#divCampoVisualiza,#divEstatus").removeClass('has-error').addClass('has-valid');
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
            guardarRecurso();
         }
      });
   }
}
//!
function guardarRecurso() {
   let formData = new FormData();
   formData.append("vm_id_recurso", $('#vm_id_recurso').val());
   formData.append("vm_nombre_rec", $('#vm_nombre_rec').val());
   formData.append("vm_id_tabla", $('#vm_id_tabla').val());
   formData.append("vm_id_campo_id", $('#vm_id_campo_id').val());
   formData.append("vm_id_campo_visualiza", $('#vm_id_campo_visualiza').val());
   if ($("#vm_tipo").val() === 'E') {
      formData.append("vm_id_estatus", $('#vm_id_estatus').val());
   }
   else {
      formData.append("vm_codigo_rec", $('#vm_codigo_rec').val());
      formData.append("vm_id_estatus", 1);
   }
   formData.append("vm_query", $('#vm_query').val());

   $.ajax({
      type: 'post',
      url: contexto+'Recursos/guardarRecurso',
      async: true,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', false);
         $("#overlayprincipal").show();
         $("#bt_guardar").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Guardar');
         targetPrincipal = document.getElementById('frecursos');
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
         $("#bt_guardar").html('<i class="fa-solid fa-floppy-disk me-2"></i>Guardar');
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}