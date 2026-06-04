function vmdal_reg_cambios(id_cambio,tipo) {
	let html = "";
   let botones = "";
   let titulo = (id_cambio === "") ? 'Registro de Cambio Empleado':'Edici&oacute;n de Cambio Empleado con ID &raquo; <span class="p-font-weight">'+id_cambio+'</span>';
   
   html +=  `<form method="post" class="app-form frm-modal-rcambio" id="frmregcambioemp" name="frmregcambioemp" novalidate onsubmit="return false">
               <input type="hidden" id="vm_id_cambio" name="vm_id_cambio" value="${id_cambio}">
               <input type="hidden" id="vm_tipo" name="vm_tipo" value="${tipo}">
               <input type="hidden" id="vm_id_empleado" name="vm_id_empleado">
               <input type="hidden" id="vm_id_empleado_plaza" name="vm_id_empleado_plaza">
               <input type="hidden" id="vm_contador_valid">`;
   html +=  `  <div class="row mb-2">                  
                  <div class="col-sm-4">
                     <label class="form-label">Tipo Cambio</label>
                     <div class="form-group" id="divTCambio">
                        <select class="form-control selectpicker" id="vm_id_tipo_cambio" name="vm_id_tipo_cambio" required style="width:100%"
                           onchange="validCombos(this.id,'divTCambio');camposDinamicos(this.value)">
                           <option value="">[Seleccione una opci&oacute;n]</option>'+
                        </select>
                        <div class="invalid-feedback">Tipo Cambio requerido</div>
							</div>
                  </div>                    
                  <div class="col-sm-8">
                     <label class="form-label">Empleado</label>
                     <div class="input-group">
                        <span class="input-group-text b-r-left bg-danger" onclick="mdl_empleados()" style="height:40px;cursor:pointer">
                           <i class="fa-solid fa-magnifying-glass"></i>
                        </span>
                        <input type="text" class="form-control" id="vm_nombre_empleado" style="height: 40px" readonly>
                     </div>
                  </div>
               </div>
               <div class="row mb-1" id="divDatosEmpleado" style="display:none">
                  <div class="col-sm-3">
                     <label class="form-label">CURP</label>
                     <p class="lead" id="labelCurp"></p>
                  </div>
                  <div class="col-sm-3">
                     <label class="form-label">Puesto</label>
                     <p class="lead" id="labelPuesto"></p>
                  </div>
                  <div class="col-sm-6">
                     <label class="form-label">Centro Trabajo</label>
                     <p class="lead" id="labelCtrabajo"></p>
                  </div>
               </div>
               <div class="row mb-2">   
                  <div class="col-sm-4">
							<label class="form-label">Fecha Cambio</label>
							<input type="date" class="form-control" id="vm_fecha_cambio" name="vm_fecha_cambio" style="height: 40px;" required>
                      <div class="invalid-feedback">Fecha cambio requerido</div>        
						</div>
               </div>
               <div class="row mb-2">   
                  <div class="col-sm-12">
							<label class="form-label">Motivo</label>
							<textarea id="vm_motivo" name="vm_motivo" class="form-control" maxlength="399" required></textarea>
                     <div class="invalid-feedback">Motivo requerido</div>  
						</div>
               </div>
               <hr class="mt-0">
               <div class="row mb-2" id="divCampos"></div>`;
   html +=  `</form>
             <div id="overlay2" class="overlay"></div>`;

   botones +=  `<button type="button" class="btn btn-info me-1" btn="btn" id="bt_guardar_regcambios">
                  <i class="fa-solid fa-floppy-disk me-2"></i>Guardar</button>`;
   botones +=  `<button type="button" class="btn btn-secondary me-1" btn="btn" id="bt_limpiar_frmcam">
                  <i class="fa-solid fa-eraser me-2"></i>Limpiar</button>`;
   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" id="bt_cerrar_regcambios">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar</button>`;

   modalXL('frmCambios', titulo, html, 'formxl_scrollable', botones, 'cerrar_vm_reg_cambios()');
   $(".selectpicker").select2({dropdownParent: $("#vModalXL")});
   if(tipo === "N") {
      cargaComboTipoCambio(true,null);
   }
   //
   $("#bt_guardar_regcambios").on("click", function () {
      validacionRegCambioEmpleado();
   });
   //
   $("#bt_limpiar_frmcam").on("click", function () {
      limpiarFrmRegistroCambio();
   });
   //
   $("#bt_cerrar_regcambios").on("click", function () {
      cerrar_vm_reg_cambios();
   });
}
//!
function cerrar_vm_reg_cambios() {
   closeModalXL();
   recargaPaginadoPrincipal()
}
//!
function camposDinamicos(id_tipo_cambio) {   
   let tar;
	let spin;
   let html = "";
   if(id_tipo_cambio != "") {
      $("#divCampos").empty();
      $.ajax({
         type: 'post',
         url: contexto+'Cambios/getCampos',
         async: true,
         dataType: 'JSON',
         data: 'pid_tipo_cambio='+id_tipo_cambio,
         beforeSend(xhr){
            $('button[btn="btn"]').prop('disabled',true);
            $("#overlay").show();
            tar = document.getElementById('frmCambios');
            spin = new Spinner().spin(tar);
         },
         success: function (data) {
            $(data.dataCampos).each(function(i, v) {
               html += `<div class="col-sm-12 col-md-4 col-lg-4 mb-2">
                           <label class="form-label">${v.etiqueta_label}</label>
                           ${v.html_objeto}
                        </div>`;
            });
         },
         complete(xhr, status) {
            $('button[btn="btn"]').prop('disabled',false);
            spin.stop();
            $("#overlay").hide();
            $("#divCampos").append(html);
            $(".selectpicker").select2({dropdownParent: $("#vModalXL")});
            cargaCombosCampos(true,id_banco);
         }
      });
   }
}
//!
function cargaComboTipoCambio(async,id_tipo_cambio) {
	let tar;
	let spin;
	$.ajax({
      type: 'post',
      url: contexto+'Cambios/getComboTipoCambio',
      async: async,
      dataType: 'JSON',
		data: '',
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlay").show();
         tar = document.getElementById('frmCambios');
         spin = new Spinner().spin(tar);
      },
      success: function (data) {
         $("#vm_id_tipo_cambio").html('<option value="">[Seleccione una opci&oacute;n]</option>');
         $(data.s_tcambio).each(function(i, v) {
            $("#vm_id_tipo_cambio").append('<option value="'+v.id+'">'+v.descripcion+'</option>');
         });
         if(id_tipo_cambio !== '' && id_tipo_cambio !== null) {
            $("#vm_id_tipo_cambio").val(id_tipo_cambio);
         }
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spin.stop();
         $("#overlay").hide();
      }
   });
}
//!
function cargaCombosCampos(async,id_banco) {
	let tar;
	let spin;
	$.ajax({
      type: 'post',
      url: contexto+'Cambios/getComboCampos',
      async: async,
      dataType: 'JSON',
		data: '',
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlay").show();
         tar = document.getElementById('frmCambios');
         spin = new Spinner().spin(tar);
      },
      success: function (data) {
         $("#id_banco").html('<option value="">[Seleccione una opci&oacute;n]</option>');
         $(data.s_bancos).each(function(i, v) {
            $("#id_banco").append('<option value="'+v.id+'" longit_cuenta="'+v.longitud_cuenta+'">'+v.descripcion+'</option>');
         });

         if(id_banco !== '' && id_banco !== null) {
            $("#id_banco").val(id_banco);
         }
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spin.stop();
         $("#overlay").hide();
      }
   });
}
//!
function limpiarFrmRegistroCambio() {
	$("#frmregcambioemp").removeClass('frm-modal-rcambio was-validated').addClass('frm-modal-rcambio');
   $("#vm_contador_valid").val(0);
   $("#vm_id_empleado,#vm_id_empleado_plaza").val('');
	$("#vm_nombre_empleado").val('');
   $("#divDatosEmpleado").hide();
   $("#labelCurp,#labelPuesto,#labelCtrabajo").html('');
	$("#vm_fecha_cambio").val('');
   $("#vm_motivo").val('');
   $("#vm_id_tipo_cambio").val('').trigger('change');
	$("#divTCambio").removeClass("has-valid");
	$("#divTCambio").removeClass("has-error");
   $("#divCampos").empty();
}
//!
function validacionRegCambioEmpleado() {
	$("#vm_contador_valid").val(1);
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal-rcambio');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
			if($("#vm_id_tipo_cambio").val() === "") {
				$("#divTCambio").removeClass("has-valid");
				$("#divTCambio").addClass("has-error");
			}
			else {
				$("#divTCambio").addClass("has-valid");
			}
         
         if($("#id_banco").val() === "") {
				$("#divTBanco").removeClass("has-valid");
				$("#divTBanco").addClass("has-error");
			}
			else {
				$("#divTBanco").addClass("has-valid");
			}  
      }
      form.classList.add('was-validated');
   });
   
   if(contador === 0) {
		$("#divTCambio").addClass("has-valid");
		$("#divTBanco").addClass("has-valid");
      confirmarcionRegCambioEmpleado();
   }
}
//!
function validacionFinal() {
   let msg = "";
   let existeCambio = 0;

   if($("#vm_id_empleado").val().length == 0) {
      msg += "<li>Debe seleccionar un empleado</li>";
   }
   //Valida datos bancarios
	let vlongituCuenta = $("#id_banco option:selected").attr("longit_cuenta"); 

   if(vlongituCuenta > 0){
      if($('#num_cuenta').val().length != vlongituCuenta){
         msg += "<li>Longitud de cuenta bancaria deben ser "+vlongituCuenta+" digitos <strong>( "+$('#num_cuenta').val()+" )</strong></li>";
      }
      if($('#clabe_interbancaria').val().length < 18){
         msg += "<li>Longitud de CLABE Interbancaria deben ser 18 digitos <strong>( "+$('#clabe_interbancaria').val()+" )</strong></li>";
      }
      if($('#num_tarjeta').val().trim().length > 0 && $('#num_tarjeta').val().length < 16){
         msg += "<li>Longitud del n&uacute;mero de tarjeta deben ser 16 digitos <strong>( "+$('#num_tarjeta').val()+" )</strong></li>";
      }
   }

	if($("#vm_tipo").val() == 'N'){
		ajax(contexto+'Cambios/existeRegistroCambio', 'pTipoCambio='+$('#vm_id_tipo_cambio').val()+'&pIdEmpleado='+$('#vm_id_empleado').val(),
		function (data) {
			existeCambio = parseInt(data.total);
			if(existeCambio > 0){
				msg += "<li>Actualmente ya existe un registro con el <strong>tipo cambio y empleado </strong> seleccionado</li>";
			}
		});
	}
   
   return msg;
}
//!
function confirmarcionRegCambioEmpleado() {
	let msj = validacionFinal();
   if(msj.length > 0) {
      Swal.fire({
			title: 'Validación',
			html: msj,
			icon: 'warning',
			showDenyButton: true,
			denyButtonText: "Aceptar",
			showConfirmButton: false
		});
   }
	else {
		Swal.fire({
			title: 'Confirmaci&oacute;n',
			html: '<p class="p-font-msg-1-2">\u{BF}Confirma que los datos son correctos?</p>',
			icon: 'warning',
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			cancelButtonColor: '#d33',
			confirmButtonColor: '#3085d6',
			confirmButtonText: 'Si, confirmar',
		}).then((result) => {
			if (result.isConfirmed) {
				guardarCambioEmpleado();
			}
		});
	}
}
//!
function guardarCambioEmpleado() {
   $.ajax({
      type: 'post',
      url: contexto+'Cambios/guardarCambioEmpleado',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: new FormData($("#frmregcambioemp")[0]),
      beforeSend(xhr) {
         $('#overlay').show();
         $('#bt_guardar_nom').html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Guardar');
         $('button[btn="btn"]').prop('disabled', true);
         target = document.getElementById('frmregcambioemp');
         spinner = new Spinner().spin(target);
      },
      success: function (data) {
         if (data.respuesta === false) {  
            Swal.fire({
               title: 'HA OCURRIDO UN ERROR!',
               html: '<p class="p-font-msg-1-2">'+data.mensaje+'</p>',
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
                  limpiarFrmRegistroCambio();
                  if($("#vm_tipo").val() === 'E') {
                     closeModalXL();
                     recargaPaginadoPrincipal();
                  }
               }
            });
         }
      },
      error: function (xhr, ajaxOptions, thrownError) {
         Swal.fire({
            title: 'HA OCURRIDO UN ERROR!',
            html: '<p class="p-font-msg">'+thrownError+'</p>',
            icon: 'error',
            showDenyButton: true,
            showConfirmButton: false,
            denyButtonText: "Aceptar"
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         $('#bt_guardar_nom').html('<i class="fa-solid fa-floppy-disk me-2"></i>Guardar');
         spinner.stop();
         $("#overlay").hide();
      }
   });
}
//******************************Modal Empleados*************************************************
//TODO: Modal empleados
function mdl_empleados() {
	let html = "";
	let botones = "";
	let titulo = 'Empleados';
	$("#overlay2").show();
	
	html += `<form method="post" id="frn_consulta_empleados" name="frn_consulta_empleados" onsubmit="return false">
					<div class="row"> 
						<div class="col-sm-8">
							<div class="form-floating mb-2">
								<input type="text" class="form-control" id="vm_buscar_empleado" name="vm_buscar_empleado"
								      onkeydown="onKeyDownHandler(event,'frn_consulta_empleados');">
								<label>
									<i class="fa-solid fa-magnifying-glass feather-sm text-dark fill-white me-2"></i>
									<span class="border-start border-light-secondary ps-3">Buscar por CURP / RFC / Nombre / Puesto / Centro Trabajo</span>
								</label>
							</div>
						</div>
						<div class="col-sm-4">
                     <div class="form-floating">
                        <select class="form-select" id="vm_id_grupo_busq" name="vm_id_grupo_busq" onchange="consultarEmpleados()">
                           <option value="">[Todos]</option>
                        </select>
                        <label>
                           <i class="fa-solid fa-list feather-sm text-dark fill-white me-2"></i>
                           <span class="border-start border-light-secondary ps-3">Turno</span>
                        </label>
                     </div>
                  </div>
					</div>
				</form>
            <hr style="margin-top:0">
            <div class="table-responsive-sm">
					<table class="table table-sm table-hover" id="tblEmpleados" width="100%">
						<thead class="table-secondary">
							<tr class="p-font-msg-08">
								<th width="15%" class="text-start">CURP</th>
								<th width="25%" class="text-start">Empleado</th>
								<th width="15%" class="text-start">Puesto</th>
								<th width="5%"  class="text-center">Turno</th>
								<th width="20%" class="text-start">Centro Trabajo</th>
								<th width="1%"  class="text-center"></th>
							</tr>
						</thead>
						<tbody></tbody>
            	</table>
            </div>`;

	botones += '<button type="button" class="btn btn-light" btn="btn" onclick="limpiar_frm_empleados()" id="btnEresar_frmEmpledos"><i class="fa-solid fa-eraser me-2"></i>Limpiar</button>';
	botones += '<button type="button" class="btn btn-danger" btn="btn" data-bs-dismiss="modal" onclick="cerrarmodalEmpleados()"><i class="fa-solid fa-xmark me-2"></i>Cerrar</button>';
	modalLG('frmCambios', titulo, html, 'formlg_scrollable', botones, null);
   cargaCombosGrupos();
	consultarEmpleados();
}
//!
function cargaCombosGrupos() {
   $.ajax({
      type: 'post',
      url: contexto+'/Incidencias/getCombosGrupos',
      async: false,
      dataType: 'json',
      success: function (data) {
         $(data.grupos).each(function(i, v) {
            $('#vm_id_grupo_busq').append('<option value="'+v.id+'">'+v.descripcion+'</option>');
         });
      }
   });
}
//TODO: Consultar Empleados
function consultarEmpleados() {
	TBEmpleados.setTablaHTML("tblEmpleados");
	TBEmpleados.setUrl(contexto+"Cambios/consultarEmpleados");
	TBEmpleados.setRegistrosPagina(10);
	TBEmpleados.setColumnas("curp,nombre_empleado,puesto,grupo,centro_trabajo,button");
	TBEmpleados.setColTipos("text,text,text,text,text,icon");
	TBEmpleados.setAlineacion("left,left,left,center,left,center");
	const iconos = {
		"col6": {
			"opciones": [{
            "campo_bd": "icon_seleccionar","valor_campo": "1","icono": "fa-solid fa-circle-check fa-sm ",
				"callback": "seleccionar_empeado","tooltip": "Seleccionar","tipoicono": "i","color": "color_green"
			}]
		}
	};

	TBEmpleados.setIconos(iconos);
	TBEmpleados.fontSize = '0.8rem';
	TBEmpleados.setParametros($("#frn_consulta_empleados").serialize());
	TBEmpleados.loadJSON();
}
//TODO: Seleccionar empleado
function seleccionar_empeado(reg) {
	$("#vm_id_empleado").val(reg.id_empleado);
   $("#vm_id_empleado_plaza").val(reg.id_empleado_plaza);
   $("#vm_nombre_empleado").val(reg.nombre_empleado);
   $("#divDatosEmpleado").show();
   $("#labelCurp").html(reg.curp);
   $("#labelPuesto").html(reg.puesto+' ('+reg.grupo+')');
   $("#labelCtrabajo").html(reg.centro_trabajo);
	cerrarmodalEmpleados();
}
//TODO: Cerrar modal empleados
function cerrarmodalEmpleados() {
	TBEmpleados.barraDibujada = false;
	$("#overlay2").hide();
	closeModalLG();
}
//TODO: Limpiar formulario de consulta de empleados
function limpiar_frm_empleados() {
	$("#vm_buscar_empleado").val('');
	consultarEmpleados();
}
//TODO: Entrada Numerico
function onKeyDownHandler(event, type) {
   if (event.keyCode === 13) {
      switch (type) {
         case "frn_consulta_empleados":
            consultarEmpleados();
            break;
      }
   }
}