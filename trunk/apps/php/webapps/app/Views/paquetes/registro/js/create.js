const vmRegistro = (id_paquete,tipo) => {
	let html = '';
   let botones = '';
   const titulo = (id_paquete == '') ? 'Registro de Paquete':'Edici&oacute;n del Paquete con ID &raquo; <span class="fw-bold">'+id_paquete+'</span>';
   const fAct = fechaActual();
   //
   html +=  `<form method="post" class="app-form frm-modal-reg" id="frmRegistro" name="frmRegistro" novalidate onsubmit="return false">
               <input type="hidden" id="vm_id_paquete" name="vm_id_paquete" value="${id_paquete}">
               <input type="hidden" id="vm_tipo" value="${tipo}">
               <input type="hidden" id="vm_contador_valid">
               <div class="row mb-2">
                  <div class="col-sm-6">
							<label class="form-label">Fecha Programaci&oacute;n</label>
							<input type="date" class="form-control" id="vm_fecha_programada" name="vm_fecha_programada" style="height: 40px;"
                        required value="${fAct.fecha2}">
                     <div class="invalid-feedback">Fecha programada requerido</div>        
						</div>
               </div>
               <div class="row mb-2">   
                  <div class="col-sm-12">
                     <label class="form-label">Notificador</label>
                     <div class="form-group" id="divUserNotificador">
                        <select class="form-control selectpicker" id="vm_id_usuario_notificador" name="vm_id_usuario_notificador" required
                           onchange="validCombos(this.id,'divUserNotificador')">
                           <option value="">[Seleccione una opci&oacute;n]</option>'+
                        </select>
                        <div class="invalid-feedback">Notificador requerido</div>
							</div>
                  </div>
               </div>
               <div class="app-divider-v dashed text-primary"></div>
               <div class="row">
                  <div class="col-sm-12">
                     <div class="card" style="background-color:#f9f4f4">
                        <div class="card-header">
                           <h5>Paquete - Notificaciones</h5>
                        </div>
                        <div class="card-body">
                           <select class="selectList" id="vm_listado" name="vm_listado[]" multiple></select>
                        </div>
                     </div>
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

   modalLG('frmPaquetes', titulo, html, 'formlg_scrollable', botones, 'cerrar_vm_registro()');
   $(".selectpicker").select2({dropdownParent: $("#vModalLG")});
   if(tipo == 'N') {
      cargaComboRegistro(true,true,id_paquete,null);
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
function cargaComboRegistro(async,inicializar,pid_paquete,id_usuario_notificador) {
	let tar,spin;
	$.ajax({
      type: 'post',
      url: contexto+nameController+'/getComboRegistro',
      async: async,
      dataType: 'JSON',
		data: {
         id_paquete:pid_paquete
      },
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         tar = document.getElementById('frmPaquetes');
         spin = new Spinner().spin(tar);
      },
      success: function (data) {
         $("#vm_id_usuario_notificador").html('<option value="">[Seleccione una opci&oacute;n]</option>');
         $(data.userNotificadores).each(function(i, v) {
            $("#vm_id_usuario_notificador").append('<option value="'+v.id+'">'+v.descripcion+'</option>');
         });

         if(data.listOficios.length == 0) {
            $(".dual-listbox__selected").empty();
         }
         else {
            $(data.listOficios).each(function(i, v) {
               $("#vm_listado").append('<option value="'+v.id+'" '+v.seleccion+'>'+v.descripcion+'</option>');
            });
         }

         if(id_usuario_notificador != '' && id_usuario_notificador != null) {
            $("#vm_id_usuario_notificador").val(id_usuario_notificador);
         }
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spin.stop();
         $("#overlayprincipal").hide();
         if(inicializar) {
            comboListado();
         }
      }
   });
}
//!
const comboListado = () => {
   let dlb2 = new DualListbox(".selectList", {
      availableTitle: "Notificaciones Dispobibles",
      selectedTitle: "Notificaciones Asignadas",
      addButtonText: ">",
      removeButtonText: "<",
      addAllButtonText: ">>",
      removeAllButtonText: "<<",
      searchPlaceholder: "Num. Oficio",
      enableDoubleClick: false
   });
   
   /*dlb2.addEventListener("added", function(event) {
      document.querySelector(".changed-element").innerHTML = event.addedElement.outerHTML;
   });
   dlb2.addEventListener("removed", function(event) {
      document.querySelector(".changed-element").innerHTML = event.removedElement.outerHTML;
   });*/
}
//!
const limpiarFrmRegistro = () => {
   const pid_paquete = 0;
   const fAct = fechaActual();
	$("#frmRegistro").removeClass('frm-modal-reg was-validated').addClass('frm-modal-reg');
   $("#vm_contador_valid").val(0);
	$("#vm_fecha_programada").val(fAct.fecha2);
	$("#divUserNotificador").removeClass("has-valid");
	$("#divUserNotificador").removeClass("has-error");
   cargaComboRegistro(false,false,pid_paquete,null);
   //$(".selectList").find('option').prop('selected', false);
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
         if($("#vm_id_usuario_notificador").val() == '') {
				$("#divUserNotificador").removeClass('has-valid').addClass('has-error');
			}
			else {
				$("#divUserNotificador").removeClass('has-erro').addClass('has-valid');
			}
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0) {
      $("#divUserNotificador").removeClass('has-erro').addClass('has-valid');
      confirmarcionRegistro();
   }
}
//!
const validacionRegistro = () => {
   let msg = '';
   const totalSeleccionados = $("#vm_listado option:selected").length;

   if (totalSeleccionados == 0) {
      msg += `<li>Se requiere que se asigne n&uacute;mero de oficio</li>`;
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
      url: contexto+nameController+'/guardarPaquete',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: new FormData($("#frmRegistro")[0]),
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlayprincipal").show();
         $("#bt_guardar").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Guardar');
         targetPrincipal = document.getElementById('frmPaquetes');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         if (data.respuesta == false) {
            if(parseInt(data.valid) > 0) {
               Swal.fire({
                  title: 'VALIDACIÓN',
                  html: data.mensaje,
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