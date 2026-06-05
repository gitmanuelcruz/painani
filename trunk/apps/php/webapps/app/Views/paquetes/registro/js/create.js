const vmRegistro = (id_notificacion,tipo) => {
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
                  <div class="col-sm-6">
                     <label class="form-label">Num. Oficio</label>
                     <input type="text" class="form-control" id="vm_num_oficio" name="vm_num_oficio" maxlength="49" 
                        style="height: 40px" required>
                     <div class="invalid-feedback">Num. Oficio requerido</div>
                  </div>
                  <div class="col-sm-6">
							<label class="form-label">Fecha Oficio</label>
							<input type="date" class="form-control" id="vm_fecha_oficio" name="vm_fecha_oficio" style="height: 40px;"
                        required value="${fAct.fecha2}">
                     <div class="invalid-feedback">Fecha oficio requerido</div>        
						</div>
               </div>
               <div class="row mb-2">   
                  <div class="col-sm-12">
							<label class="form-label">Domicilio</label>
							<textarea class="form-control text-uppercase" id="vm_domicilio" name="vm_domicilio" rows="4" required></textarea>
                     <div class="invalid-feedback">Domicilio requerido</div>  
						</div>
               </div>
               <div class="row mb-2">   
                  <div class="col-sm-12">
							<label class="form-label">Referencia de Ubicaci&oacute;n</label>
							<textarea class="form-control text-uppercase" id="vm_referencia_ubicacion" name="vm_referencia_ubicacion" rows="4" required></textarea>
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

   modalLG('frmfrmPaquetes', titulo, html, 'formlg_scrollable', botones, 'cerrar_vm_registro()');
   $(".selectpicker").select2({dropdownParent: $("#vModalLG")});
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
const limpiarFrmRegistro = () => {
   const fAct = fechaActual();
	$("#frmRegistro").removeClass('frm-modal-reg was-validated').addClass('frm-modal-reg');
   $("#vm_contador_valid").val(0);
   $("#vm_num_oficio").val('');
	$("#vm_fecha_oficio").val(fAct.fecha2);
	$("#vm_domicilio,#vm_referencia_ubicacion").val('');

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
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0) {
      confirmarcionRegistro();
   }
}
//!
const validacionRegistro = () => {
   let msg = '';
   let existeOficio = 0;
   const numOficio = $("#vm_num_oficio").val();
   //
	if($("#vm_tipo").val() == 'N') {
		ajax(contexto+nameController+'/existeOficio', 'num_oficio='+numOficio,
		function (data) {
			existeOficio = parseInt(data.total);
			if(existeOficio > 0){
				msg += `<li>El n&uacute;mero de oficio (<b>${numOficio}</b>) ya se encuentra registrado</li>`;
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