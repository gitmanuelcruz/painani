const vm_carga_layout = () => {
   let html = '';
   let botones = '';
   let titulo = `Registro de Notificaciones por Layout`;
   html +=  `<div class="row mb-0">
               <div class="col-sm-12">
                  <div class="alert alert-light-info">
                     <h5><i class="fa-solid fa-info-circle me-2"></i>Formato del Archivo</h5>
                     <p class="mb-2 text-dark">El archivo debe contener las siguientes columnas en este orden:</p>
                     <ol class="mb-2">
                        <li class="text-dark"><span class="fw-bold">Num. Orden:</span> El n&uacute;mero de orden debe ser unico (<b>NO debe existir en la plataforma</b>)</li>
                        <li class="text-dark"><span class="fw-bold">Num. Oficio:</span> El n&uacute;mero de oficio debe ser unico (<b>NO debe existir en la plataforma</b>)</li>
                        <li class="text-dark"><span class="fw-bold">Fecha oficio:</span> La fecha de orden debe llevar el siguiente formato (<b>dd-mm-yyyy</b>)</li>
                        <!-- li class="text-dark"><span class="fw-bold">ID Insumo:</span> El ID insumo debe ser inico</>
                        <li class="text-dark"><span class="fw-bold">ID Bloque:</span> El ID bloque debe ser inico</li>
                        <li class="text-dark"><span class="fw-bold">Monto Presuntiva:</span> El monto presuntiva debe ser mayor a 0</li -->
                        <li class="text-dark"><span class="fw-bold">Domicilio:</span> Es el domicilio donde se notificar&aacute;</li>
                        <li class="text-dark"><span class="fw-bold">Referencia Ubicaci&oacute;n:</span> Es la referencia de la ubicaci&oacute;n a notificar</li>
                     </ol>
                     <hr>
                     <div class="row">
                        <div class="col-sm-6">
                           <p class="mb-0 p-font-msg-1-2"><span class="fw-bold">Formato de archivo layout:</span> .xlsx</p>
                        </div>
                        <div class="col-sm-6 text-end">
                           <button type="button" class="btn btn-light-success" btn="btn" id="bt_descargar_formatoxlayout">
                              <i class="fa-solid fa-download me-2"></i>Descargar Formato de Layout
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <form method="post" class="app-form frm-modal-rlc" id="frmRegLayout" name="frmRegLayout" novalidate onsubmit="return false">
               <!--div class="row mb-2">
                  <div class="col-sm-10 offset-1">
                     <table class="table table-sm table-bordered table-striped table-hover" style="width: 100%;">
                        <thead class="table-secondary">
                           <tr class="p-font-msg-08">
                              <th width="15%" class="text-start" rowspan="2">Prioridad</th>
                              <th width="14%" class="text-center fw-bold" colspan="2">Rango Presuntiva<hr class="mb-0 mt-0 text-white"></th>
                           </tr>
                           <tr class="p-font-msg-08">
                              <th width="7%" class="text-center">M&iacute;nimo</th>
                              <th width="7%" class="text-center">M&aacute;ximo</th>
                           </tr>
                        </thead>
                        <tbody id="tbodyPrioridad"></tbody>
                     </table>
                  </div>
               </div -->
               <div class="row">
                  <div class="col-sm-12">
                     <label class="form-label">Layout de Num. Oficios</label>
                     <input type="file" class="form-control" id="vm_archivo_layout" name="vm_archivo_layout"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" required/>
                     <div class="invalid-feedback">Layout de Num. Orden requerido</div>
            		</div>
               </div>
            </form>
            <div class="overlay" id="overlay2"></div>`;

   botones +=  `<button type="button" class="btn btn-info me-1" btn="btn" id="bt_guardar_xlayout">
                  <i class="fa-solid fa-floppy-disk me-2"></i>Guardar
               </button>
               <button type="button" class="btn btn-secondary me-1" btn="btn" id="bt_clean_frmxlayout">
                  <i class="fa-solid fa-eraser me-2"></i>Limpiar
               </button>
               <button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" id="bt_cerrar_regxlayout">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modalLG('frmNotificaciones', titulo, html, 'formlg_scrollable', botones, 'cerrarVMRegistroxLayout()');
   //cargaRegMasivo(true);
   //
   $("#bt_descargar_formatoxlayout").on("click", function () {
      descargar_formato_layout();
   });
   //
   $("#bt_guardar_xlayout").on("click", function () {
      validxLayout();
   });
   //
   $("#bt_clean_frmxlayout").on("click", function () {
      cleanFrmxLayout();
   });
   //
   $("#bt_cerrar_regxlayout").on("click", function () {
      cerrarVMRegistroxLayout();
   });
}
//!
const cerrarVMRegistroxLayout = () => {
   closeModalLG();
   recargaPaginadoPrincipal();
}
//!
const cargaRegMasivo = (async) => {
	let tar,spin;
   let tr = '';
   $("#tbodyPrioridad").empty();
	$.ajax({
      type: 'post',
      url: contexto+nameController+'/getComboRegxLayout',
      async: async,
      dataType: 'JSON',
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         tar = document.getElementById('frmNotificaciones');
         spin = new Spinner().spin(tar);
      },
      success: function (data) {
         $(data.prioridades).each(function(i, v) {
            const vfuncion = (parseNull(v.id_siguiente) != '') ? "rellenarImpMin('"+v.id_siguiente+"',this.value)":"";
            const vbloqueadoMin = (parseNull(v.id_anterior) == '') ? 'readonly':'';
            const vbloqueadoMax = (parseNull(v.id_siguiente) == '') ? 'readonly':'';
            tr += `<tr>
                     <td>
                        <input type="hidden" name="vm_idprioridad[]" value="${v.id}">
                        <p class="p-font-msg-09" id="lbprioridad_${v.id}" data-idsiguiente="${v.id_siguiente}" data-idanterior="${v.id_anterior}">${v.descripcion}</p>
                     </td>
                     <td>
                        <input type="text" class="form-control form-control-sm text-end" id="vm_monto_min_${v.id}" name="vm_monto_min_${v.id}" maxlength="20"
                           onkeypress="return getKeyNumberDecimal(event);" onBlur="formateo(this)" onFocus="sinformateo(this)" ${vbloqueadoMin} required value="0.00">
                     </td>
                     <td>
                        <input type="text" class="form-control form-control-sm text-end" id="vm_monto_max_${v.id}" name="vm_monto_max_${v.id}" maxlength="20"
                           onkeypress="return getKeyNumberDecimal(event);" onBlur="formateo(this);${vfuncion}" ${vbloqueadoMax} onFocus="sinformateo(this)" 
                           required value="0.00">
                     </td>
                  </tr>`;
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spin.stop();
         $("#overlayprincipal").hide();
         $("#tbodyPrioridad").html(tr);
      }
   });
}
//!
const rellenarImpMin = (index,importe) => {
   const monto = (unFormatNumber(importe) == '') ? 0 : unFormatNumber(importe);
   const montoMax = parseFloat(monto) + 0.01;
   $("#vm_monto_min_"+index).val(formatNumber(montoMax));
   $("#vm_monto_min_"+index).prop('readonly',true);
}
//!
const descargar_formato_layout = () => {
   document.forms["frmNotificaciones"].action = contexto+nameController+"/descargarFormatoLayout";
   document.forms["frmNotificaciones"].target = "";
   document.forms["frmNotificaciones"].submit();
}
//!
const cleanFrmxLayout = () => {
   $("#frmRegLayout").removeClass('frm-modal-rlc was-validated').addClass('frm-modal-rlc');
   $("#vm_archivo_layout").val('');
   /*let arreglo = document.getElementsByName("vm_idprioridad[]");
   let index = '';
   for (let i=0; i<arreglo.length; i++) {
      index = arreglo[i].value;
      $("#vm_monto_min_"+index).val('0.00');
      $("#vm_monto_max_"+index).val('0.00');
      $("#vm_monto_min_"+index).prop('readonly',false);
   }*/
}
//!
const validxLayout = () => {
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal-rlc');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0){
      confirmarcionRegxLayout();
   }
}
//!
const validarArchivosLayout = () => {
   let extension = ['.xlsx'];
   //let arreglo = document.getElementsByName("vm_idprioridad[]");
   //let index = '';
   let msg = '';
   //
   /*for (let i=0; i<arreglo.length; i++) {
      index = arreglo[i].value;
      let montoMin = (unFormatNumber($("#vm_monto_min_"+index).val()) == '') ? 0 : unFormatNumber($("#vm_monto_min_"+index).val());
      let montoMax = (unFormatNumber($("#vm_monto_max_"+index).val()) == '') ? 0 : unFormatNumber($("#vm_monto_max_"+index).val());
      const descPrioridad = $("#lbprioridad_"+index).text();
      const idSiguiente = $("#lbprioridad_"+index).data('idsiguiente');
      const idAnterior = $("#lbprioridad_"+index).data('idanterior');
      if(parseFloat(montoMin) <= 0 && idAnterior != '' && idAnterior != null && idAnterior != undefined) {
         msg +="<li>El monto m&iacute;nimo del "+descPrioridad+" tiene que ser mayor a 0</li>";
      }
      if(parseFloat(montoMax) <= 0 && idSiguiente != '' && idSiguiente != null && idSiguiente != undefined) {
         msg +="<li>El monto m&aacute;ximo del "+descPrioridad+" tiene que ser mayor a 0</li>";
      }
   }*/
   if($.trim($("#vm_archivo_layout").val()).length > 0){
      if(verifcar_peso_archivo('vm_archivo_layout', 15)) {
         msg +="<li>El archivo .xlsx no puede pesar m&aacute;s de 15MB</li>";
      }
      if(!comprueba_extension($("#vm_archivo_layout").val(), extension)){
         msg +="<li>Solo se permite archivo .xlsx</li>";
      }
   }

   return msg;
}
//!
const confirmarcionRegxLayout = () => {
   const msg = validarArchivosLayout();
   if (msg.length > 0) {
      Swal.fire({
         title: 'Verificar Datos',
         html: '<ul class="p-font-msg-1">'+msg+'</ul>',
         icon: 'warning',
         showDenyButton: true,
         denyButtonText: 'Aceptar',
         showConfirmButton: false
      });
   }
   else {
      const mensaje = '<p class="p-font-msg-1-2">\u{BF}Confirma que el layout es correcto?</p>';
      Swal.fire({
         title: 'Confirmaci&oacute;n',
         html: mensaje,
         icon: 'warning',
         showCancelButton: true,
         cancelButtonText: 'Cancelar',
         cancelButtonColor: '#d33',
         confirmButtonColor: '#3085d6',
         confirmButtonText: 'Si, confirmar',
      }).then((result) => {
         if (result.isConfirmed) {
            guardarLayout();
         }
      });
   }
}
//!
const guardarLayout = () => {
   $.ajax({
      type: 'post',
      url: contexto+nameController+'/guardarLayout',
      async: true,
      processData: false,
      contentType: false,
      dataType:'JSON',
      data: new FormData($("#frmRegLayout")[0]),
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlayprincipal").show();
         $("#bt_guardar_xlayout").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Guardar');
         targetPrincipal = document.getElementById('frmNotificaciones');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         if (data.respuesta == false) {
            if(parseInt(data.error) == 1) {
               $('button[btn="btn"]').prop('disabled',false);
               spinnerPrincipal.stop();
               $("#overlayprincipal").hide();
               vmObservacionesLayout(data.usuario);
            }
            else if(parseInt(data.error) == 2) {
               Swal.fire({
                  title: 'VALIDACION',
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
                  cerrarVMRegistroxLayout();
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
         $("#bt_guardar_xlayout").html('<i class="fa-solid fa-floppy-disk me-2"></i>Guardar');
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
const vmObservacionesLayout = (usuario) => {
   let html = '';
   let botones = '';
   const titulo = 'Observaciones de la Carga del Layout de Num. Orden';
   $("#overlay2").show();
   //
   html +=  `<input type="hidden" id="hid_user_reg" value="${usuario}"/>
            <div class="row">
               <div class="col-sm-12">
                  <div class="table-responsive-sm">
                     <table class="table table-sm table-hover" id="tblObservaciones" width="100%">
                        <thead class="table-secondary">
                           <tr class="p-font-msg-09">
                              <th width="5%"  class="text-center">#</th>
                              <th width="90%" class="text-start">Observaciones</th>
                           </tr>
                        </thead>
                        <tbody></tbody>
                     </table>
                  </div>
               </div>
            </div>`;

   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" id="bt_cerrar_vm_observ">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modalXL('frmNotificaciones', titulo, html, 'formxl_scrollable_error', botones, 'cerrarVMObservaciones()');
   getConsultaObservacionesPag();
   //
   $("#bt_cerrar_vm_observ").on("click", function () {
      cerrarVMObservaciones();
   });
}
//!
const cerrarVMObservaciones = () => {
   $("#overlay2").hide();
   tblObservLayout.barraDibujada = false;
   closeModalXL();
}
//!
const getConsultaObservacionesPag = () => {
   const usuarioRegistro = $("#hid_user_reg").val();
   tblObservLayout.setTablaHTML("tblObservaciones");
   tblObservLayout.setUrl(contexto+nameController+"/observacionesLayoutPag");
   tblObservLayout.setRegistrosPagina(10);
   tblObservLayout.setColumnas("consecutivo,observaciones");
   tblObservLayout.setColTipos("text,text");
   tblObservLayout.setAlineacion("center,left");
   tblObservLayout.fontSize = "0.83rem";
   tblObservLayout.parametros = "user_registro="+usuarioRegistro;
   tblObservLayout.loadJSON();
}