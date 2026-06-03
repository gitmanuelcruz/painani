function vmdal_reg_puesto(id_puesto,tipo) {
	let html = "";
   let botones = "";
   let titulo = (id_puesto === "") ? 'Registro de Puesto':'Edici&oacute;n del Puesto';
   
   html +=  `<form method="post" class="app-form frm-modal-regpue" id="frmregpuesto" name="frmregpuesto" novalidate onsubmit="return false">
               <input type="hidden" id="vm_id_puesto" name="vm_id_puesto" value="${id_puesto}">
               <input type="hidden" id="vm_tipo" name="vm_tipo" value="${tipo}">
               <input type="hidden"  id="vm_nombre_puesto_tmp" name="vm_nombre_puesto_tmp">
               <div class="row mb-2">
                  <div class="col-sm-12">
                     <label class="form-label">Nombre Puesto</label>
                     <input type="text" class="form-control" id="vm_nombre_puesto" name="vm_nombre_puesto" required
                        maxlength="199" style="height:40px">
                     <div class="invalid-feedback">Nombre de puesto requerido</div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-sm-4">
                     <p>&nbsp;</p>
                     <label class="btn btn-light-info text-info active mt-1">
                        <input type="checkbox" class="material-inputs" id="vm_check_admin" name="vm_check_admin" 
                           onclick="esAdmibCheck(this)">
                        <label class="form-check-label" for="txt_recurrente">Es Administrativo</label>
                     </label>
            	   </div>
            	   <div class="col-sm-4">
                     <label class="form-label">Num. Orden</label>
                     <input type="text" class="form-control" id="vm_num_orden" name="vm_num_orden" required
                        maxlength="3" onkeypress="return getKeyNumber(event);" style="height:40px">
                     <div class="invalid-feedback">Num. orden requerido</div>
                  </div>
               </div>
            </form>`;

   botones +=  '<button type="button" id="bt_guardar_pue" class="btn btn-info me-1" btn="btn" onclick="validacionRegPuesto()">'+
               '	<i class="fa-solid fa-floppy-disk me-2"></i>Guardar</button>';
   botones +=  '<button type="button" class="btn btn-secondary me-1" btn="btn" onclick="limpiarFrmRegistro()">'+
               '	<i class="fa-solid fa-eraser me-2"></i>Limpiar</button>';
   botones +=  '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="recargaPaginadoPrincipal()">'+
               '  <i class="fa-solid fa-xmark me-2"></i>Cerrar</button>';

   modalLG('frmPuestos', titulo, html, 'formlg_scrollable', botones, 'recargaPaginadoPrincipal()');
   $("#vm_check_admin").prop('checked',false);
   $("#vm_check_admin").val(0);
}
//!
function esAdmibCheck(ele) {
	if(ele.checked === true) {
	   $("#vm_check_admin").prop('checked',true);
	   $("#vm_check_admin").val(1);
	}
	else if(ele.checked === false) {
	   $("#vm_check_admin").prop('checked',false);
	   $("#vm_check_admin").val(0);
	}
}
//!
function limpiarFrmRegistro() {
	$("#frmregpuesto").removeClass('frm-modal-regpue was-validated').addClass('frm-modal-regpue');
   $("#vm_nombre_puesto").val('');
   $("#vm_check_admin").prop('checked',false);
   $("#vm_check_admin").val(0);
   $("#vm_num_orden").val('');
}
//!
function validacionRegPuesto() {
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal-regpue');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0) {
      confirmarcionRegPuesto();
   }
}
//!
function confirmarcionRegPuesto() {
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
         guardarPuesto();
      }
   });
}
//!
function guardarPuesto() {
   $.ajax({
      type: 'post',
      url: contexto+'Puestos/guardarDiainhabil',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: new FormData($("#frmregpuesto")[0]),
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlayprincipal").show();
         $("#bt_guardar_pue").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Guardar');
         target = document.getElementById('frmPuestos');
         spinner = new Spinner().spin(target);
      },
      success: function (data) {
         if (data.respuesta === false) {  
            if(parseInt(data.valid) > 0) {
               Swal.fire({
                  title: 'VALIDACIÓN',
                  html: '<p class="p-font-msg-1-2 text-dark">'+data.mensaje+'</p>',
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
                  limpiarFrmRegistro();
                  if($("#vm_tipo").val() === 'E') {
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
         $('button[btn="btn"]').prop('disabled',false);
         $("#bt_guardar_pue").html('<i class="fa-solid fa-floppy-disk me-2"></i>Guardar');
         spinner.stop();
         $("#overlayprincipal").hide();
      }
   });
}