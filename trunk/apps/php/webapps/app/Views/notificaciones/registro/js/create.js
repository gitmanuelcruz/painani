const vmRegistro = (id_notificacion,tipo) => {
   $('.tooltip_icon_pag').tooltip('hide');
	let html = '';
   let botones = '';
   const titulo = (id_notificacion == '') ? 'Registro de Notificaci&oacute;n':'Edici&oacute;n de Notificaci&oacute;n';
   const fAct = fechaActual();
   //
   html +=  `<form method="post" class="app-form frm-modal-reg" id="frmRegistro" name="frmRegistro" novalidate onsubmit="return false">
               <input type="hidden" id="vm_id_notificacion" name="vm_id_notificacion" value="${id_notificacion}">
               <input type="hidden" id="vm_tipo" value="${tipo}">
               <input type="hidden" id="vm_contador_valid">
               <div class="row mb-2">
                  <div class="col-sm-4">
                     <label class="form-label">Num. Orden</label>
                     <input type="text" class="form-control" id="vm_num_orden" name="vm_num_orden" maxlength="49" 
                        style="height:40px" required>
                     <div class="invalid-feedback">Num. Orden requerido</div>
                  </div>
                  <div class="col-sm-4">
                     <label class="form-label">Num. Oficio</label>
                     <input type="text" class="form-control" id="vm_num_oficio" name="vm_num_oficio" maxlength="49" 
                        style="height:40px" required>
                     <div class="invalid-feedback">Num. Oficio requerido</div>
                  </div>
                  <div class="col-sm-4">
							<label class="form-label">Fecha Oficio</label>
							<input type="date" class="form-control" id="vm_fecha_oficio" name="vm_fecha_oficio" style="height:40px;"
                        required value="${fAct.fecha2}">
                     <div class="invalid-feedback">Fecha oficio requerido</div>        
						</div>
               </div>
               <div class="row mb-2">                                     
                  <div class="col-sm-4">
                     <label class="form-label">ID Insumo</label>
                     <input type="text" class="form-control" id="vm_id_insumo" name="vm_id_insumo" maxlength="20"
                        style="height:40px" onkeypress="return getKeyNumber(event);" required>
                     <div class="invalid-feedback">ID insumo requerido</div>
                  </div>
                  <div class="col-sm-4">
							<label class="form-label">ID Bloque</label>
							<input type="text" class="form-control" id="vm_id_bloque" name="vm_id_bloque" maxlength="20"
                        style="height:40px;" onkeypress="return getKeyNumber(event);" required>
                     <div class="invalid-feedback">ID bloque requerido</div>        
						</div>
               </div>
               <div class="row mb-2">
                  <div class="col-sm-4">
							<label class="form-label">Monto Presuntiva</label>
							<input type="text" class="form-control" id="vm_monto_presuntiva" name="vm_monto_presuntiva" maxlength="20"
                        style="height:40px;" onkeypress="return getKeyNumberDecimal(event);" onBlur="formateo(this)"
                        onFocus="sinformateo(this)" required value="0.00">
                     <div class="invalid-feedback">Monto presuntiva requerido</div>        
						</div>
                  <div class="col-sm-4">
                     <label class="form-label">Prioridad</label>
                     <div class="form-group" id="divPrioridad">
                        <select class="form-control selectpicker" id="vm_id_prioridad" name="vm_id_prioridad" required
                           onchange="validCombos(this.id,'divPrioridad')">
                           <option value="">[Seleccione una opci&oacute;n]</option>'+
                        </select>
                        <div class="invalid-feedback">Prioridad requerido</div>
							</div>
                  </div>
               </div>
               <div class="row mb-2">   
                  <div class="col-sm-12">
							<label class="form-label">Domicilio</label>
							<textarea class="form-control text-uppercase" id="vm_domicilio" name="vm_domicilio" rows="3" required></textarea>
                     <div class="invalid-feedback">Domicilio requerido</div>  
						</div>
               </div>
               <div class="row mb-2">   
                  <div class="col-sm-12">
							<label class="form-label">Referencia de Ubicaci&oacute;n</label>
							<textarea class="form-control text-uppercase" id="vm_referencia_ubicacion" name="vm_referencia_ubicacion" rows="3" required></textarea>
                     <div class="invalid-feedback">Referencia de ubicaci&oacute;n requerido</div>  
						</div>
               </div>
            </form>`;

   botones +=  `<button type="button" class="btn btn-info me-1" btn="btn" id="bt_guardar">
                  <i class="fa-solid fa-floppy-disk me-2"></i>Guardar
               </button>`;
   botones +=  `<button type="button" class="btn btn-secondary me-1" btn="btn" id="bt_limpiar_frm">
                  <i class="fa-solid fa-eraser me-2"></i>Limpiar
               </button>`;
   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" id="bt_cerrar_vm_registro">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modalLG('frmNotificaciones', titulo, html, 'formlg_scrollable', botones, 'cerrar_vm_registro()');
   $(".selectpicker").select2({dropdownParent: $("#vModalLG")});
   if(tipo == 'N') {
      cargaComboRegistro(true,null);
   }
   //
   $("#bt_guardar").on("click", function () {
      validRegistro();
   });
   //
   $("#bt_limpiar_frm").on("click", function () {
      limpiarFrmRegistro();
   });
   //
   $("#bt_cerrar_vm_registro").on("click", function () {
      cerrar_vm_registro();
   });
}
//!
const cerrar_vm_registro = () => {
   closeModalLG();
   recargaPaginadoPrincipal()
}
//!
const cargaComboRegistro = (async,id_prioridad) => {
	let tar,spin;
   let contador = 0;
	$.ajax({
      type: 'post',
      url: contexto+nameController+'/getComboRegistro',
      async: async,
      dataType: 'JSON',
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         tar = document.getElementById('frmNotificaciones');
         spin = new Spinner().spin(tar);
      },
      success: function (data) {
         $("#vm_id_prioridad").html('<option value="">[Seleccione una opci&oacute;n]</option>');
         $(data.prioridades).each(function(i, v) {
            $("#vm_id_prioridad").append('<option value="'+v.id+'">'+v.descripcion+'</option>');
         });
      
         if(id_prioridad != '' && id_prioridad != null) {
            $("#vm_id_prioridad").val(id_prioridad);
         }
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spin.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
const limpiarFrmRegistro = () => {
   const fAct = fechaActual();
	$("#frmRegistro").removeClass('frm-modal-reg was-validated').addClass('frm-modal-reg');
   $("#vm_contador_valid").val(0);
   $("#vm_num_oficio,#vm_num_orden").val('');
	$("#vm_fecha_oficio").val(fAct.fecha2);
   $("#vm_id_insumo,#vm_id_bloque").val('');
   $("#vm_monto_presuntiva").val('0.00');
   $("#vm_id_prioridad").val('').trigger('change');
	$("#vm_domicilio,#vm_referencia_ubicacion").val('');
   $("#divPrioridad").removeClass('has-valid');
	$("#divPrioridad").removeClass('has-error');
}
//!
const validRegistro = () => {
	$("#vm_contador_valid").val(1);
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal-reg');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
         if($("#vm_id_prioridad").val() == '') {
				$("#divPrioridad").removeClass('has-valid').addClass('has-error');
			}
			else {
				$("#divPrioridad").removeClass('has-error').addClass('has-valid');
			}
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0) {
      $("#divPrioridad").removeClass('has-error').addClass('has-valid');
      confirmarcionRegistro();
   }
}
//!
const validacionRegistro = () => {
   let msg = '';
   let existeOficio = 0;
   let existeOrden  = 0;
   const numOficio = $("#vm_num_oficio").val();
   const numOrden  = $("#vm_num_orden").val();
   //
	if($("#vm_tipo").val() == 'N') {
		ajax(contexto+nameController+'/existeOficio', 'num_oficio='+numOficio+'&num_orden='+numOrden,
		function (data) {
			existeOficio = parseInt(data.totalOficio);
         existeOrden = parseInt(data.totalOrden);
			if(existeOficio > 0){
				msg += `<li>El n&uacute;mero de oficio (<b>${numOficio}</b>) ya se encuentra registrado</li>`;
			}
         if(existeOrden > 0){
				msg += `<li>El n&uacute;mero de orden (<b>${numOrden}</b>) ya se encuentra registrado</li>`;
			}
		});
	}
   
   return msg;
}
//!
const confirmarcionRegistro = () => {
	let msj = validacionRegistro();
   if(msj.length > 0) {
      Swal.fire({
			title: 'Validación',
			html: '<p class="p-font-msg-1-2">'+msj+'</p>',
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
				guardarRegistro();
			}
		});
	}
}
//!
const guardarRegistro = () => {
   $.ajax({
      type: 'post',
      url: contexto+nameController+'/guardarNotificacion',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: new FormData($("#frmRegistro")[0]),
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlayprincipal").show();
         $("#bt_guardar").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Guardar');
         targetPrincipal = document.getElementById('frmNotificaciones');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         if (data.respuesta == false) {
            if(parseInt(data.valid) > 0) {
               Swal.fire({
                  title: 'VALIDACIÓN',
                  html: '<p class="p-font-msg-1-2">'+data.mensaje+'</p>',
                  icon: 'warning',
                  showDenyButton: true,
                  denyButtonText: 'Aceptar',
                  showConfirmButton: false
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
                  if($("#vm_tipo").val() == 'E') {
                     cerrar_vm_registro();
                  }
                  else {
                     limpiarFrmRegistro();
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
         $('button[btn="btn"]').prop('disabled',false);
         $("#bt_guardar").html('<i class="fa-solid fa-floppy-disk me-2"></i>Guardar');
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}