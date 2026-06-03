const ventanaNuevo = (usuario,titulo,tipo) =>{
   let html = '';
   let botones = '';
   const oculto = (tipo == 'N') ? 'style="display:none"':'';
   const disabled = (tipo == 'N') ? '':'disabled';
   const fact = fechaActual();
   //
   html +=  `<form method="post" class="app-form frm-modal" id="frmodalv" name="frmodalv" novalidate onsubmit="return false">
               <input type="hidden" id="vm_id_user" name="vm_id_user" value="${usuario}">
               <input type="hidden" id="vm_tipo" name="vm_tipo" value="${tipo}">
               <input type="hidden" id="vm_contador_valid" value="0">`;
   html +=  `  <div class="row mb-2">
                  <div class="col-sm-6">
                     <label class="form-label">Usuario</label>
                     <input type="text" class="form-control" id="vm_usuario" name="vm_usuario" maxlength="49" required 
                        style="font-weight:600;font-size:1.1rem;height:40px">
                     <div class="invalid-feedback">Usuario requerido</div>
            		 </div>
                  <div class="col-sm-6">
                     <label class="form-label">&nbsp;&nbsp;</label>
                     <div class="row">
                        <div class="col-sm-6">
                           <div class="form-selectgroup">
                              <div class="select-item">
                                 <input type="checkbox" class="form-check-input" id="ver_password" name="ver_password" 
                                    onclick="ver_passwords(this)" value="1">
                                 <label class="form-check-label" for="ver_password">
                                    <span class="d-flex align-items-center">
                                       <span class="ms-2">
                                          <span class="fs-8"><b>Visualizar Contrase&ntilde;a</b></span>
                                       </span>
                                    </span>
                                 </label>
                              </div>
                           </div>
                        </div>
                        <div class="col-sm-6" ${oculto}>
                           <div class="form-selectgroup">
                              <div class="select-item">
                                 <input type="checkbox" class="form-check-input" id="chmodifica" name="chmodifica" 
                                    onclick="check(this)" value="1">
                                 <label class="form-check-label" for="chmodifica">
                                    <span class="d-flex align-items-center">
                                       <span class="ms-2">
                                          <span class="fs-8"><b>Modificar Contrase&ntilde;a</b></span>
                                       </span>
                                    </span>
                                 </label>
                              </div>
                           </div>
                        </div>
                     </div>
            		</div>
               </div>`;
   html +=  `  <div class="row mb-2">
                  <div class="col-sm-6">
                     <label class="form-label">Contrase&ntilde;a</label>
                     <input type="password" class="form-control" id="vm_contrasenia" name="vm_contrasenia" maxlength="20" ${disabled} required
                        style="height:40px">
                     <div class="invalid-feedback">Contrase&ntilde;a requerido</div>
            		</div>
                  <div class="col-sm-6">
                     <label class="form-label">Confirmar Contrase&ntilde;a</label>
                     <input type="password" class="form-control" id="vm_contrasenia_confirmar" name="vm_contrasenia_confirmar" maxlength="20" ${disabled} 
                        required style="height:40px">
                     <div class="invalid-feedback">Confirmar contrase&ntilde;a requerido</div>
            		</div>
               </div>`;
   html +=  `  <div class="row mb-2">
                  <div class="col-sm-6">
                     <label class="form-label">Nombre Completo</label>
                     <input type="text" class="form-control" id="vm_nombre" name="vm_nombre" maxlength="149" required style="height:40px">
                     <div class="invalid-feedback">Nombre completo requerido</div>
            		</div>
                  <div class="col-sm-6">
                     <label class="form-label">Genero</label>
            		   <div class="form-group" id="divGenero">
				        	   <select class="form-control selectpicker" id="vm_id_genero" name="vm_id_genero" required
								   onchange="validCombos(this.id,'divGenero')">
									<option value="">[Seleccione una opci&oacute;n]</option>
				        	   </select>
				        	   <div class="invalid-feedback">Genero requerido</div>
							</div>
            		</div>
               </div>`;
   html +=  `  <div class="row mb-2">
                  <div class="col-sm-3">
                     <label class="form-label">Nivel de Usuario</label>
            			<div class="form-group" id="divNivelUsuario">
                    	   <select class="form-control selectpicker" id="vm_id_nivel_usuario" name="vm_id_nivel_usuario" required
            					onchange="validCombos(this.id,'divNivelUsuario')">
            					<option value="">[Seleccione una opci&oacute;n]</option>
                    	   </select>
                    	   <div class="invalid-feedback">Nivel de usuario requerido</div>
            			</div>
            		</div>
                  <div class="col-sm-3">
                     <label class="form-label">Es Notificador</label>
            			<div class="form-group" id="divEsNotificador">
                    	   <select class="form-control selectpicker" id="vm_es_notificador" name="vm_es_notificador" required
            					onchange="validCombos(this.id,'divEsNotificador')">
            					<option value="">[Seleccione una opci&oacute;n]</option>
                           <option value="0">No, Es Notificador</option>
                           <option value="1">Si, Es Notificador</option>
                    	   </select>
                    	   <div class="invalid-feedback">Es notificador requerido</div>
            			</div>
            		</div>
                  <div class="col-sm-3">
                     <label class="form-label">Estilo de Color</label>
            			<div class="form-group" id="divThema">
                    	   <select class="form-control selectpicker" id="vm_id_color_thema" name="vm_id_color_thema" required
            				   onchange="validCombos(this.id,'divThema')">
            					<option value="">[Seleccione una opci&oacute;n]</option>
                           <option value="light">Claro</option>
                           <option value="dark">Oscuro</option>
                    	   </select>
                    	   <div class="invalid-feedback">Estilo de color requerido</div>
            		   </div>
            		</div>
                  <div class="col-sm-3">
                     <label class="form-label">Idioma</label>
            			<div class="form-group" id="divIdioma">
                    	   <select class="form-control selectpicker" id="vm_id_idioma" name="vm_id_idioma" required
            					onchange="validCombos(this.id,'divIdioma')">
            					<option value="">[Seleccione una opci&oacute;n]</option>
                    	   </select>
                    	   <div class="invalid-feedback">Idioma requerido</div>
            		   </div>
                  </div>
               </div>`;
   html +=  `  <div class="row mb-2">
                  <div class="col-sm-3">
                     <label class="form-label">Fecha Inicio Vigencia</label>
                     <input type="date" class="form-control" id="vm_fecha_vig_inicio" name="vm_fecha_vig_inicio" required
                        onchange="validRangoFechaVigencia()" style="height:40px" value="${fact.fecha2}">
                     <div class="invalid-feedback">Fecha inicio vig. requerido</div>
            		</div>
                  <div class="col-sm-3">
                     <label class="form-label">Fecha T&eacute;rmino Vigencia</label>
                     <input type="date" class="form-control" id="vm_fecha_vig_termino" name="vm_fecha_vig_termino"
                        style="height:40px" min="${fact.fecha2}">
                     <div class="invalid-feedback">Fecha t&eacute;rmino vig. requerido</div>
            		</div>
                  <div class="col-sm-6">
                     <label class="form-label">Correo Electr&oacute;nico</label>
                     <input type="email" class="form-control" id="vm_correo_electronico" name="vm_correo_electronico" maxlength="300"
                        required style="height:40px">
                     <div class="invalid-feedback">Correo electr&oacute;nico requerido</div>
            		</div>
               </div>`;
   html +=  `  <div class="row mb-2">
                  <div class="col-sm-6">
                     <label class="form-label">Tel&eacute;fono M&oacute;vil</label>
                     <input type="text" class="form-control" id="vm_tel_movil" name="vm_tel_movil" maxlength="10" required
                        onkeypress="return getKeyNumber(event);" style="height:40px">
                     <div class="invalid-feedback">Tel&eacute;fono m&oacute;vil requerido</div>
            		</div>
                  <div class="col-sm-6">
                     <label class="form-label">Tel&eacute;fono Fijo</label>
                     <input type="text" class="form-control" id="vm_tel_fijo" name="vm_tel_fijo" maxlength="10" required
                        onkeypress="return getKeyNumber(event);" style="height:40px">
                     <div class="invalid-feedback">Tel&eacute;fono fijo requerido</div>
            		</div>
               </div>`;
   html +=  `  <div class="row mb-2">
                  <div class="col-sm-12">
                     <label class="form-label">Foto del Usuario (extensi&oacute;n .png o .jpg)</label>
                     <input type="file" class="form-control" id="archivo_foto" name="archivo_foto" style="height:40px">
            		</div>
               </div>`;
   html +=  `</form>
            <div id="overlay2" class="overlay"></div>`;

   botones +=  `<button type="button" class="btn btn-info me-1" btn="btn" id="bt_guardar">
                  <i class="fa-solid fa-floppy-disk me-2"></i>Guardar
               </button>`;
   botones +=  `<button type="button" class="btn btn-secondary" btn="btn" id="bt_limpiarv">
                  <i class="fa-solid fa-eraser me-2"></i>Limpiar
               </button>`;
   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" id="bt_cerrar_reg_user">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modalXL('fusuario', titulo, html, 'formxl_scrollable', botones, 'cerrarVMRegUser()');
   $(".selectpicker").select2({dropdownParent: $("#vModalXL")});
   if(tipo == 'N') {
      cargaCombos(true,null,null,0,'light',null);
   }
   //
   $("#bt_guardar").on("click", function () {
      validacionUser();
   });
   //
   $("#bt_limpiarv").on("click", function () {
      limpiar_vm();
   });
   //
   $("#bt_cerrar_reg_user").on("click", function () {
      cerrarVMRegUser();
   });
}
//!
const cerrarVMRegUser = () => {
   closeModalXL();
   recargaPaginadoPrincipal();
}
//!
function cargaCombos(async,id_genero,id_nivel_usuario,es_notificador,id_thema,id_idioma) {
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/getCombosUser',
      async: async,
      dataType: 'json',
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         targetPrincipal = document.getElementById('fusuario');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         $("#vm_id_genero").html('<option value="">[Seleccione una opci&oacute;n]</option>');
         $(data.genero).each(function(i, v) {
            $("#vm_id_genero").append('<option value="'+v.id+'">'+v.descripcion+'</option>');
         });
         $("#vm_id_nivel_usuario").html('<option value="">[Seleccione una opci&oacute;n]</option>');
         $(data.nivel_usuario).each(function(i, v) {
            $("#vm_id_nivel_usuario").append('<option value="'+v.id+'">'+v.descripcion+'</option>');
         });
         $("#vm_id_idioma").html('<option value="">[Seleccione una opci&oacute;n]</option>');
         $(data.idioma).each(function(i, v) {
            $("#vm_id_idioma").append('<option value="'+v.id+'">'+v.descripcionr+'</option>');
         });
         //
         if(id_genero != null && id_genero != '') {
            $('#vm_id_genero').val(id_genero);
         }
         if(id_nivel_usuario != null && id_nivel_usuario != '') {
            $('#vm_id_nivel_usuario').val(id_nivel_usuario);
         }
         if(es_notificador != null && es_notificador != '') {
            $('#vm_es_notificador').val(es_notificador).trigger('change');
         }
         if(id_thema != null && id_thema != '') {
            $('#vm_id_color_thema').val(id_thema).trigger('change');
         }
         if(id_idioma != null && id_idioma != '') {
            $('#vm_id_idioma').val(id_idioma);
         }
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
function ver_passwords(ele) {
   if(ele.checked) {
      $("#vm_contrasenia").attr("type", "text");
      $("#vm_contrasenia_confirmar").attr("type", "text");
   }
   else {
      $("#vm_contrasenia").attr("type", "password");
      $("#vm_contrasenia_confirmar").attr("type", "password");
   }
}
//!
function check(ele) {
   $('#vm_contrasenia').val('');
   $('#vm_contrasenia_confirmar').val('');
   if (ele.checked === true) {
      $("#vm_contrasenia").prop("disabled", false);
      $("#vm_contrasenia_confirmar").prop("disabled", false);
   }
   else if (ele.checked === false) {
      $("#vm_contrasenia").prop("disabled", true);
      $("#vm_contrasenia_confirmar").prop("disabled", true);
   }
}
//!
function validRangoFechaVigencia() {
   $("#vm_fecha_vig_termino").val('');
   $("#vm_fecha_vig_termino").prop("min",$("#vm_fecha_vig_inicio").val());
}
//!
function limpiar_vm() {
   const fact = fechaActual();
   $("#frmodalv").removeClass('frm-modal was-validated').addClass('frm-modal');
   let tipo = $("#vm_tipo").val();
   if (tipo == 'E') {
      $("#chmodifica").prop("checked", false);
      $("#vm_usuario").prop("disabled", true);
      $("#vm_contrasenia").prop("disabled", true);
      $("#vm_contrasenia_confirmar").prop("disabled", true);
   }
   else {
      $("#vm_id_user").val('');
      $("#vm_usuario").val('');
   }
   $("#vm_contador_valid").val(0);
   $("#vm_contrasenia,#vm_contrasenia_confirmar").val('');
   $("#vm_nombre").val('');
   $("#vm_id_genero,#vm_id_nivel_usuario,#vm_id_idioma").val('').trigger('change');
   $("#vm_es_notificador").val('0').trigger('change');
   $("#vm_id_color_thema").val('light').trigger('change');
   $("#vm_fecha_vig_inicio").val(fact.fecha2);
   $("#vm_fecha_vig_termino").val('');
   validRangoFechaVigencia();
   $("#vm_correo_electronico,#vm_tel_movil,#vm_tel_fijo").val('');
   $("#archivo_foto").val('');
   $("#divGenero,#divNivelUsuario,#divEsNotificador,#divThema,#divIdioma").removeClass('has-valid');
   $("#divGenero,#divNivelUsuario,#divEsNotificador,#divThema,#divIdioma").removeClass('has-error');
   document.getElementById('ver_password').checked = false;
   document.getElementById('chmodifica').checked = false;
}
//!
function validaExisteUsuario() {
   let pusuario = $('#vm_usuario').val();
   let existe = 0;
   $.ajax({
      type: 'post',
      url: contexto+"Usuarios/validarUsuario",
      async: false,
      dataType:"JSON",
      data: { usuario : pusuario },
      success: function (data) {
         existe = data.total;
      }
   });

   return existe;
}

function validacionUser() {
   $("#vm_contador_valid").val(1);
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
         if($("#vm_id_genero").val() == '') {
				$("#divGenero").removeClass('has-valid').addClass('has-error');
			}
			else {
            $("#divGenero").removeClass('has-error').addClass('has-valid');
			}
         if($("#vm_id_nivel_usuario").val() == '') {
            $("#divNivelUsuario").removeClass('has-valid').addClass('has-error');
			}
			else {
            $("#divNivelUsuario").removeClass('has-error').addClass('has-valid');
			}
         if($("#vm_es_notificador").val() == '') {
            $("#divEsNotificador").removeClass('has-valid').addClass('has-error');
			}
			else {
            $("#divEsNotificador").removeClass('has-error').addClass('has-valid');
			}
         if($("#vm_id_color_thema").val() == "") {
            $("#divThema").removeClass('has-valid').addClass('has-error');
			}
			else {
            $("#divThema").removeClass('has-error').addClass('has-valid');
			}
         if($("#vm_id_idioma").val() == '') {
            $("#divIdioma").removeClass('has-valid').addClass('has-error');
			}
			else {
            $("#divIdioma").removeClass('has-error').addClass('has-valid');
			}
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0){
      $("#divGenero,#divNivelUsuario,#divEsNotificador,#divThema,#divIdioma").removeClass('has-error').addClass('has-valid');
      confirmarSave();
   }
}

function validUsuarios() {
   let msg = '';
   if ($("#vm_id_user").val() === "" || ($("#vm_id_user").val() !== "" && $("#chmodifica").is(':checked'))) {
      if (($("#vm_contrasenia").val() !== "" && $("#vm_contrasenia_confirmar").val() !== "") && ($("#vm_contrasenia").val() !== $("#vm_contrasenia_confirmar").val())) {
         msg += "<li>Las contrase&ntilde;as no coinciden</li>";
      }
   }
   if ($.trim($("#vm_correo_electronico").val()).length > 0) {
      if (!validacion_email('vm_correo_electronico')) {
         msg += "<li>Correo electr&oacute;nico invalido</li>";
      }
   }

   let extensionFoto = ['.png', '.jpg'];
   let textExt = "";
   for(let i=0; i<extensionFoto.length; i++){
      textExt += (textExt == "") ? extensionFoto[i] : ", "+extensionFoto[i];  
   }

   if($.trim($("#archivo_foto").val()).length > 0){
      if(verifcar_peso_archivo('archivo_foto', 5)) {
         msg +="<li>La foto del usuario no puede pesar m&aacute;s de 5MB</li>";
      }
      if(!comprueba_extension($("#archivo_foto").val(), extensionFoto)){
         msg +='<li>Solo se permite archivo con extension ('+textExt+')</li>';
      }
   }

   if(msg.length == 0) {
      if($.trim($("#vm_id_user").val()).length === 0) {
         if (validaExisteUsuario() > 0) {
            msg += "<li>El usuario <b>"+$("#vm_usuario").val()+"</b> ya se encuentra registrado, verifique los datos e intente nuevamente</li>";
         }
      }
   }

   return msg;
}

function confirmarSave() {
   var msg = validUsuarios();
   if (msg.length > 0) {
      Swal.fire({
         title: 'Datos Requeridos',
         html: "<ul class='p-font-msg-1-2 text-dark'>"+msg+"</ul>",
         icon: 'warning',
         showDenyButton: true,
         denyButtonText: 'Aceptar',
         showConfirmButton: false
      });
   }
   else {
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
            guardarUsuario();
         }
      });
   }
}

function guardarUsuario() {
   let formData = new FormData();
   formData.append("vm_id_user", $('#vm_id_user').val());
   formData.append("vm_usuario", $('#vm_usuario').val());
   if($('#chmodifica').prop('checked')){
      formData.append("vm_contrasenia", $.md5($('#vm_contrasenia').val()));
      formData.append("vm_contrasenia_confirmar", $.md5($('#vm_contrasenia_confirmar').val()));
   }
   else {
      if($('#vm_id_user').val() === '') {
         formData.append("vm_contrasenia", $.md5($('#vm_contrasenia').val()));
      }
   }
   formData.append("vm_nombre", $('#vm_nombre').val());
   formData.append("vm_id_genero", $('#vm_id_genero').val());
   formData.append("vm_id_nivel_usuario", $('#vm_id_nivel_usuario').val());
   formData.append("vm_es_notificador", $('#vm_es_notificador').val());
   formData.append("vm_id_color_thema", $('#vm_id_color_thema').val());
   formData.append("vm_id_idioma", $('#vm_id_idioma').val());
   formData.append("vm_fecha_vig_inicio", $('#vm_fecha_vig_inicio').val());
   formData.append("vm_fecha_vig_termino", $('#vm_fecha_vig_termino').val());
   formData.append("vm_correo_electronico", $('#vm_correo_electronico').val());
   formData.append("vm_tel_movil", $('#vm_tel_movil').val());
   formData.append("vm_tel_fijo", $('#vm_tel_fijo').val());
   formData.append("archivo_foto", $('#archivo_foto').prop("files")[0]);

   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/guardarUsuario',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', false);
         $("#overlayprincipal").show();
         $("#bt_guardar").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Guardar');
         targetPrincipal = document.getElementById('fusuario');
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
                     cerrarVMRegUser();
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