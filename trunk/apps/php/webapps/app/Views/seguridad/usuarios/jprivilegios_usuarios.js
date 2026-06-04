function privilegiosUser(reg) {
   let html = '';
   let botones = '';
   let titulo = 'Configuraci&oacute;n de Privilegios al Usuario';

   html +=  `<form method="post" class="frm-modal-up" id="frmPrivUser" name="frmPrivUser" novalidate onSubmit="return false;">
               <input type="hidden" id="vm_id_user" name="vm_id_user" value="${reg.usuario}"/>
               <div class="row">
                  <div class="col-sm-3">
            		   <figure>
                        <blockquote class="blockquote">
            				   <p class="p-font-weight-500 p-font-msg-09">${reg.usuario}</p>
            			   </blockquote>
            			   <figcaption class="blockquote-footer fw-bold">Usuario</figcaption>
                     </figure>
            		</div>
                  <div class="col-sm-5">
            		   <figure>
                        <blockquote class="blockquote">
            				   <p class="p-font-weight-500 p-font-msg-09">${reg.nombre_completo}</p>
            			   </blockquote>
            			   <figcaption class="blockquote-footer fw-bold">Nombre del usuario</figcaption>
                     </figure>
            		</div>
                  <div class="col-sm-4">
            		   <figure>
                        <blockquote class="blockquote">
            				   <p class="p-font-weight-500 p-font-msg-09">${reg.nombre_nivel_usuario}</p>
            			   </blockquote>
            			   <figcaption class="blockquote-footer fw-bold">Nivel del usuario</figcaption>
                     </figure>
            		</div>
                  <hr style="margin-top:-10px">
               </div>
               <div class="row">
                  <div class="col-sm-4">
                     <div class="row">
                        <div class="col-sm-12" style="max-height:300px; overflow-y:auto; overflow-x:scroll">
            		         <div class="dtree form-label" id="divtree"></div>
                        </div>
                     </div>
            	   </div>
                  <div class="col-sm-8">
                     <div class="row mb-2 text-center">
                        <div class="col-sm-6">
                           <label class="form-label">Fecha Inicio Vigencia</label>
                           <input type="date" class="form-control" id="vm_fecha_vig_priv_ini" name="vm_fecha_vig_priv_ini" style="height:40px"
                              onchange="validFechaVigenciaPrivilegios()" required>
                           <div class="invalid-feedback">Fecha inicio vigencia requerido</div>
                        </div>
                        <div class="col-sm-6">
                           <label class="form-label">Fecha T&eacute;rmino Vigencia</label>
                           <input type="date" class="form-control" id="vm_fecha_vig_priv_fin" name="vm_fecha_vig_priv_fin" style="height:40px">
                        </div>
                     </div>
                     <div class="row text-center">
                        <div class="col-sm-12">
                           <div class="form-check form-check-inline">
                              <input class="form-check-input secondary check-outline outline-secondary" type="radio" id="radio_l" name="tipolec[]" value="1" required>
                              <label class="form-check-label" for="radio_l">Solo Lectura</label>
                           </div>
                           <div class="form-check form-check-inline">
                              <input class="form-check-input secondary check-outline outline-secondary" type="radio" id="radio_le" name="tipolec[]" value="2" required>
                              <label class="form-check-label" for="radio_le">Lectura y Escritura</label>
                           </div>
                        </div>
                     </div>
            			<hr style="margin-top:1px">
                     <div class="row">
                        <div class="col-sm-12">
                           <div class="table-responsive-sm">
                              <table class="table table-sm table-hover" id="tblUserPriv" width="100%">
                                 <thead class="table-dark">
                                    <tr class="p-font-msg-08">
                                       <th width="20%" class="text-start">Tree</th>
                                       <th width="15%" class="text-center">Fecha Vigencia</th>
                                       <th width="5%" class="text-center">Lectura</th>
                                       <th width="5%" class="text-center">Escritura</th>
                                       <th width="5%" class="text-center"></th>
                                    </tr>
                                 </thead>
                                 <tbody></tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </form>
            <div id="overlay2" class="overlay"></div>`;

   botones +=  '<button type="button" id="bt_guardar_user_priv" class="btn btn-info me-1" btn="btn" onclick="validacionUserPriv()">'+
               '  <i class="fa-solid fa-floppy-disk me-2"></i>Guardar Configuraci&oacute;n'+
               '</button>';
   botones +=  '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="cerraVMConfigPrivilegios()">'+
               '  <i class="fa-solid fa-xmark me-2"></i>Cerrar'+
               '</button>';

   modalXL('fusuario', titulo, html, 'formxl_scrollable', botones, 'cerraVMConfigPrivilegios()');
   treeMenuUserPriv();
}
//!
function treeMenuUserPriv() {
   let html = "";
   let id_usuario_priv = $('#vm_id_user').val();
   let sistema = "PAINANI";
   $("#divtree").empty();
      
   $.ajax({
      method: 'post',
      url: contexto+'Usuarios/getTreeMenuUsuarioPrivilegio',
      async: true,
      dataType: 'json',
      data: 'id_usuario='+id_usuario_priv,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         targetPrincipal = document.getElementById('fusuario');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success:function(data) {
         contador = 0;
         tree = new dTree("tree",contexto+"includes/imagenes/","frmPrivUser");
         tree.closeAll();
         tree.add(0, -1, '<img src="'+contexto+'includes/imagenes/dtree_checkbox/img/globe.gif"/><span class="fw-bold">'+sistema+'</span>');
         $(data).each(function(i, v) {
            contador++;
            let band = false;
            if(parseInt(v.sel) > 0){ band = true;}
            tree.add(
               v.id_menu,
               v.id_menu_padre,
               '<span style="font-size:0.8rem">'+v.nombre_menu+'</span>',
               'javascript:void(0)',"","","","",false,
               band,
               band
            );
         });
         if(contador > 0) {
            html += tree;
            getConsultaUsuariosPrivilegios();
         }
         else {
            html +=  `<div class="alert alert-light-border-danger text-center" role="alert" style="font-size:1.1rem">
                     <i class="fas fa-exclamation-triangle fa-lg"></i>&nbsp;
                     Sin datos para mostrar de la plataforma de <br><span class="fw-bold">${sistema}</span></div>`;
         }
         $('#divtree').html(html);
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
      complete(xhr,status){
         $('button[btn="btn"]').prop('disabled',false);
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
function getConsultaUsuariosPrivilegios() {
   let idUsuario = $("#vm_id_user").val();
   tablePrivilegiosUser.setTablaHTML("tblUserPriv");
   tablePrivilegiosUser.setUrl(contexto+"Usuarios/getUsuariosPrivilegiosPag");
   tablePrivilegiosUser.setRegistrosPagina(10);
   tablePrivilegiosUser.setColumnas("nombre_menu,fecha_vigencia,solo_lectura,lectura_escritura,eliminar");
   tablePrivilegiosUser.setColTipos("text,link,icon,icon,icon");
   tablePrivilegiosUser.setAlineacion("left,center,center,center,center");
   let iconos = {
      "col2": {
         "opciones": [
            { "campo_bd": "act_fvigencia", "valor_campo": "0", "tooltip": "Sin privilegio para actualizar fecha vigencia"},
            { "campo_bd": "act_fvigencia", "valor_campo": "1", "callback": "actualizaVigenciaPriv", "tooltip": "Actualizar Fecha  de Vigencia"}
         ]
      },
      "col3": {
         "opciones":[
            { "campo_bd": "lectura", "valor_campo": "1", "icono": "fa-solid fa-circle-check fa-sm", "tooltip": "lectura", "tipoicono": "i", "color": "color_ok" }
         ]
      },
      "col4": {
         "opciones":[
            { "campo_bd": "escritura", "valor_campo": "1", "icono": "fa-solid fa-circle-check fa-sm", "tooltip": "Escritura", "tipoicono": "i", "color": "color_ok" }
         ]
      },
      "col5": {
         "opciones":[
            { "campo_bd": "eliminar", "valor_campo": "1", "icono": "fa-solid fa-trash-can fa-sm", "callback": "eliminar_user_priv", "tooltip": "Eliminar Privilegios", "tipoicono": "i", "color": "color" }
         ]
      }
   }
   tablePrivilegiosUser.setIconos(iconos);
   table.tablePrivilegiosUser = "0.7rem";
   tablePrivilegiosUser.parametros = "id_usuario="+idUsuario;
   tablePrivilegiosUser.loadJSON();
   $(".tooltip_icon_pag").tooltip("hide");
}
//!
function cerraVMConfigPrivilegios() {
   tablePrivilegiosUser.barraDibujada = false;
   recargaPaginadoPrincipal();
}
//!
function validFechaVigenciaPrivilegios() {
   $("#vm_fecha_vig_priv_fin").val('');
   $("#vm_fecha_vig_priv_fin").prop("min",$("#vm_fecha_vig_priv_ini").val());
}
//!
function validacionUserPriv() {
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal-up');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0){
      confirmarcionConfigPrivilegios();
   }
}
//! función de validación de selección de check - menu
function validCheck() {
   let msj = "";
   let contador = 0;

   $('#frmPrivUser input[type=checkbox]').each(function() {
      if(this.checked) {
         contador++;
      }
   }); 

   if(contador == 0) {
      msj += '<li>Seleccionar una opci&oacute;n del men&uacute;</li>';
   }
   
   return msj;
}
//! función de confirmación de guardar privilegios
function confirmarcionConfigPrivilegios() {
   let msg = validCheck();
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
            guardarConfiguracioPrivilegio();
         }
      });
   }
}
//!
function guardarConfiguracioPrivilegio() {
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/guardaConfigUserPrivilegios',
      async: true,
      dataType:"json",
      data: $("#frmPrivUser").serialize(),
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', false);
         $("#overlayprincipal").show();
         $("#bt_guardar_user_priv").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Guardar Configuraci&oacute;n');
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
                  treeMenuUserPriv();
                  $("#frmPrivUser").removeClass('frm-modal-up was-validated').addClass('frm-modal-up');
                  $("#radio_l").prop('checked', false);
                  $("#radio_le").prop('checked', false);
                  $("#vm_fecha_vig_priv_ini").val('');
                  $("#vm_fecha_vig_priv_fin").val('');
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
         $('#bt_guardar_user_priv').html('<i class="fa-solid fa-floppy-disk me-2"></i>Guardar Configuraci&oacute;n');
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
function eliminar_user_priv(reg) {
   Swal.fire({
      title: 'Confirmaci&oacute;n',
      html: '<p class="p-font-msg-1-2 text-dark">\u{BF}Confirma eliminar el registro de <span class="fw-bold">'+reg.nombre_menu+'</span>?</p>',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, confirmar',
   }).then((result) => {
      if (result.isConfirmed) {
         eliminarConfiguracioPrivilegio(reg.id_usuario_privilegio,reg.id_menu,reg.id_usuario);
      }
   });
}
//! función de eliminación de privilegios
function eliminarConfiguracioPrivilegio(id_usuario_privilegio,id_menu,id_usuario) {
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/eliminaraConfigUserPrivilegios',
      async: true,
      dataType:"json",
      data: 'id_usuario_privilegio='+id_usuario_privilegio+'&id_menu='+id_menu+'&id_usuario='+id_usuario,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', false);
         $("#overlayprincipal").show();
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
                  treeMenuUserPriv();
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
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
function actualizaVigenciaPriv(reg) {
   let html = "";
   let botones = "";
   let titulo = 'Actulizaci&oacute;n de Vigencia del Rol Asignado';
   $("#overlay2").show();
   //
   html +=  `<form method="post" class="frm-act-fecha-vig-priv" id="fecha_vig_priv" name="fecha_vig_priv" novalidate onSubmit="return false;">
               <div class="row">
                  <div class="col-sm-12">
            		   <div style="margin-left:15px;">
            			   <figure>
                           <blockquote class="blockquote"><p class="p-font-weight-500">${reg.nombre_menu}</p></blockquote>
            			      <figcaption class="blockquote-footer fw-bold">Nombre del registro</figcaption>
                        </figure>
            			   <hr style="margin-top:-10px">
            		   </div>
            	   </div>
               </div>
               <div class="row">
                  <div class="col-sm-6">
            		   <div class="form-floating mb-3">
                        <input type="date" class="form-control" id="vm_fecha_vig_priv_ini_act" name="vm_fecha_vig_priv_ini_act"
                           onchange="validFechaVigenciaPrivilegiosAct()" placeholder="Fecha Inicio Vigencia" required>
                        <label>
                           <span class="border-start border-light-secondary ps-3">Fecha Inicio Vigencia</span>
                        </label>
                        <div class="invalid-feedback">Fecha inicio vigencia requerido</div>
                     </div>
                  </div>
                  <div class="col-sm-6">
            		   <div class="form-floating mb-3">
                        <input type="date" class="form-control" id="vm_fecha_vig_priv_fin_act" name="vm_fecha_vig_priv_fin_act"
                           placeholder="Fecha Término Vigencia">
                        <label>
                           <span class="border-start border-light-secondary ps-3">Fecha T&eacute;rmino Vigencia</span>
                        </label>
                     </div>
                  </div>
               </div>
            </form>`;

   botones +=  `<button type="button" class="btn btn-info me-1" btn="btn" id="bt_act_fv_priv" onclick="validacionActFechaVigPriv(${reg.id_usuario_privilegio})">
                  <i class="fa-solid fa-arrow-right-arrow-left me-2"></i>Aplicar cambio de Fecha Vigencia
               </button>`;
   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="cerrarmodalPrivi()">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modal('fusuario', titulo, html, 'formdefault_scrollable', botones, 'cerrarmodalPrivi()');
   $("#vm_fecha_vig_priv_ini_act").val(reg.fvigencia_inicio);
   validFechaVigenciaPrivilegiosAct();
   $("#vm_fecha_vig_priv_fin_act").val(reg.fvigencia_fin);
}
//!
function validFechaVigenciaPrivilegiosAct() {
   $("#vm_fecha_vig_priv_fin_act").val('');
   $("#vm_fecha_vig_priv_fin_act").prop("min",$("#vm_fecha_vig_priv_ini_act").val());
}
//!
function validacionActFechaVigPriv(id_usuario_privilegio) {
   let contador = 0;
   //? Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-act-fecha-vig-priv');
   //? Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0){
      actuaizarFechaVigenciaPrivilegios(id_usuario_privilegio);
   }
}
//! Función de agregar roles al usuario
function actuaizarFechaVigenciaPrivilegios(id_usuario_privilegio) {
   let formData = new FormData();
   formData.append("id_usuario_privilegio", id_usuario_privilegio);
   formData.append("fecha_vigencia_inicio", $("#vm_fecha_vig_priv_ini_act").val());
   formData.append("fecha_vigencia_termino", $("#vm_fecha_vig_priv_fin_act").val());
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/updateFechaVigUserPrivilegios',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', false);
         $("#overlayprincipal").show();
         $("#bt_act_fv_priv").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Aplicar cambio de Fecha Vigencia');
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
                  cerrarmodalPrivi();
                  getConsultaUsuariosPrivilegios();
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
         $("#bt_act_fv_priv").html('<i class="fa-solid fa-arrow-right-arrow-left me-2"></i>Aplicar cambio de Fecha vigencia');
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
function cerrarmodalPrivi() {
   $("#overlay2").hide();
   closeModal();
}