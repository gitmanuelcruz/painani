function rolesUser(reg) {
   let html = "";
   let botones = "";
   let titulo = 'Roles del Usuario &raquo; <span class="p-font-weight">'+reg.usuario+'</span>';
   const privAddInd = reg.add_ind_rol;
   const privAddAll = reg.add_mas_rol;
   const privRemoveInd = reg.elim_ind_rol;
   const privRemoveAll = reg.elim_mas_rol;

   html +=  '<form method="post" id="frmRolesUser" name="frmRolesUser" onSubmit="return false;">'+
            '  <input type="hidden" name="pidUsuario" id="pidUsuario" value="'+reg.usuario+'"/>'+
            '</form>';         
   html +=  '<div class="row">'+
            '  <div class="col-sm-5">'+
            '     <div class="card w-100">'+
            '        <div class="card-header h-50 bg-secondary fw-bold f-s-16 text-white">Roles Disponibles</div>'+
            '        <div class="card-body overflow-auto" style="height:700px; max-height:700px; background-color:#f9f4f4">'+
            '           <div class="row">'+
            '              <div class="col-sm-12">'+
            '                 <div class="form-floating mb-3">'+
            '                    <input type="text" class="form-control form-input-bg" id="busq_roles_disp" name="busq_roles_disp" '+
            '                       placeholder="Nombre o Descripción" onKeyPress="keyEventRolDisp(event)">'+
            '                    <label>'+
            '                       <i class="fa-solid fa-user feather-sm text-dark fill-white me-2"></i>'+
            '                       <span class="border-start border-light-secondary ps-3">Nombre o Descripci&oacute;n</span>'+
            '                    </label>'+
            '                 </div>'+
            '              </div>'+
            '           </div>'+
            '           <div class="row">'+
            '              <div class="col-sm-12">'+
            '                 <div class="card">'+
            '                    <div class="card-body">'+
            '                       <div class="table-responsive-sm">'+
            '                          <table class="table table-sm table-striped table-hover" id="tblRolesDisponibles" width="100%">'+
            '                             <thead class="table-dark">'+
            '                                <tr class="p-font-msg-08">'+
            '                                   <th width="1%"  class="text-center"></th>'+
            '                                   <th width="20%" class="text-start text-white">Nombre Rol</th>'+
            '                                   <th width="25%" class="text-start text-white">Descripci&oacute;n Rol</th>'+
            '                                   <th width="5%"  class="text-center"></th>'+
            '                                   </tr>'+
            '                             </thead>'+
            '                             <tbody></tbody>'+
            '                          </table>'+
            '                       </div>'+
            '                    </div>'+
            '                 </div>'+
            '              </div>'+
            '           </div>'+
            '        </div>'+
            '     </div>'+
            '  </div>';
            
   html +=  '  <div class="col-sm-1">'+
            '     <div class="row" style="margin-top:80px">';
   if(parseInt(privAddInd) > 0) {
      html +=  '     <div class="col-12 text-center mb-1">'+
               '        <button type="button" class="btn btn-info tooltip_icon_roles" btn="btn" data-bs-toggle="tooltip" '+
               '           data-bs-html="true" data-bs-placement="top" data-bs-title="Agregar selecionados" '+
               '           onclick="confirmacionAsignarRoles('+"'INDIVIDUAL'"+')">'+
               '           &nbsp;<i class="fa-solid fa-angle-right feather-sm"></i>&nbsp;'+
               '        </button>'+
               '     </div>';
   }
   if(parseInt(privAddAll) > 0){   
      html +=  '     <div class="col-12 text-center mb-1">'+
               '        <button type="button" class="btn btn-info tooltip_icon_roles" btn="btn" data-bs-toggle="tooltip" '+
               '           data-bs-html="true" data-bs-placement="top" data-bs-title="Agregar todos" '+
               '           onclick="confirmacionAsignarRoles('+"'MASIVO'"+')">'+
               '           <i class="fa-solid fa-angles-right feather-sm"></i>'+
               '        </button>'+
               '     </div>';
   }
   if(parseInt(privRemoveInd) > 0){
      html +=  '     <div class="col-12 text-center mb-1">'+
               '        <button type="button" class="btn btn-info tooltip_icon_roles" btn="btn" data-bs-toggle="tooltip" '+
               '           data-bs-html="true" data-bs-placement="top" data-bs-title="Eliminar selecionados" '+
               '           onclick="confirmacionQuitarRoles('+"'INDIVIDUAL'"+')">'+
               '           &nbsp;<i class="fa-solid fa-angle-left feather-sm"></i>&nbsp;'+
               '        </button>'+
               '     </div>';
   }
   if(parseInt(privRemoveAll) > 0) {
      html +=  '     <div class="col-12 text-center mb-1">'+
               '        <button type="button" class="btn btn-info tooltip_icon_roles" btn="btn" data-bs-toggle="tooltip" '+
               '           data-bs-html="true" data-bs-placement="top" data-bs-title="Eliminar todos" '+
               '           onclick="confirmacionQuitarRoles('+"'MASIVO'"+')">'+
               '           <i class="fa-solid fa-angles-left feather-sm"></i>'+
               '        </button>'+
               '     </div>';
   }
   html +=  '     </div>'+
            '  </div>';

   html +=  '  <div class="col-sm-6">'+
            '     <div class="card w-100">'+
            '        <div class="card-header h-50 bg-secondary fw-bold f-s-16 text-white">Roles Asignados</div>'+
            '        <div class="card-body overflow-auto" style="height:700px; max-height:700px; background-color:#f9f4f4">'+
            '           <div class="row">'+
            '              <div class="col-sm-12">'+
            '                 <div class="form-floating mb-3">'+
            '                    <input type="text" class="form-control form-input-bg" id="busq_roles_asig" name="busq_roles_asig" '+
            '                           placeholder="Nombre o Descripción" onKeyPress="keyEventRolAsig(event)">'+
            '                    <label>'+
            '                       <i class="fa-solid fa-user feather-sm text-dark fill-white me-2"></i>'+
            '                       <span class="border-start border-light-secondary ps-3">Nombre o Descripci&oacute;n</span>'+
            '                    </label>'+
            '                 </div>'+
            '              </div>'+
            '           </div>'+
            '           <div class="row">'+
            '              <div class="col-sm-12">'+
            '                 <div class="card">'+
            '                    <div class="card-body">'+
            '                       <div class="table-responsive-sm">'+
            '                          <table class="table table-sm table-hover" id="tblRolesAsignados" width="100%">'+
            '                             <thead class="table-dark">'+
            '                                <tr class="p-font-msg-08">'+
            '                                   <th width="1%"  class="text-center"></th>'+
            '                                   <th width="15%" class="text-start text-white">Nombre Rol</th>'+
            '                                   <th width="20%" class="text-start text-white">Descripci&oacute;n Rol</th>'+
            '                                   <th width="15%" class="text-center text-white">Fecha Vigencia</th>'+
            '                                   <th width="3%"  class="text-center"></th>'+
            '                                </tr>'+
            '                             </thead>'+
            '                             <tbody></tbody>'+
            '                          </table>'+
            '                       </div>'+
            '                    </div>'+
            '                 </div>'+
            '              </div>'+
            '           </div>'+
            '        </div>'+
            '     </div>'+
            '  </div>'+
            '</div>'+
            '<div id="overlay2" class="overlay"></div>';

   botones +=  '<button type="button" class="btn btn-info me-1" btn="btn" onclick="cargartableRol()">'+
               '  <i class="fa-solid fa-arrows-rotate me-2"></i>Actualizar Consultas'+
               '</button>';
   botones +=  '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="cerrarVMRoles()">'+
               '  <i class="fa-solid fa-xmark me-2"></i>Cerrar'+
               '</button>';
   modalFullScreen('fusuario', titulo, html, 'formxxl_scrollable', botones, 'cerrarVMRoles()');
   $(".tooltip_icon_roles").tooltip();
   cargartableRol();
}
//!
function cargartableRol() {
   getRolesDisponible();
   setTimeout(() => {
      getRolesAsignados();
   }, 800);
}
//!
function getRolesDisponible() {
   let idUsuario = $("#pidUsuario").val();
   tableRolesDisponible.setTablaHTML("tblRolesDisponibles");
   tableRolesDisponible.setUrl(contexto+"Usuarios/getConsultaRolesUsuarios");
   tableRolesDisponible.setRegistrosPagina(10);
   tableRolesDisponible.setColumnas("id_rol,nombre_rol,descripcion,detalle");
   tableRolesDisponible.setColTipos("checkbox,text,text,icon");
   tableRolesDisponible.setAlineacion("center,left,left,center");
   let iconos = {
      "col4": {
         "opciones": [
            { "campo_bd": "detalle", "valor_campo": "1", "icono": "fa-solid fa-magnifying-glass fa-sm", "callback": "detalleRol", "tooltip": "Detalle del Rol", "tipoicono": "i", "color": "color_black" }
         ]
      }
   };
   tableRolesDisponible.fontSize = '0.75rem';
   tableRolesDisponible.setIconos(iconos);
   tableRolesDisponible.parametros = "id_usuario="+idUsuario+"&nombre_descripcion="+$("#busq_roles_disp").val()+"&tipo=RD";
   tableRolesDisponible.loadJSON();
}
//!
function getRolesAsignados() {
   let idUsuario = $("#pidUsuario").val();
   tableRolesAsignados.setTablaHTML("tblRolesAsignados");
   tableRolesAsignados.setUrl(contexto+"Usuarios/getConsultaRolesUsuarios");
   tableRolesAsignados.setRegistrosPagina(10);
   tableRolesAsignados.setColumnas("id_usuario_rol,nombre_rol,descripcion,fecha_vigencia,detalle");
   tableRolesAsignados.setColTipos("checkbox,text,text,link,icon");
   tableRolesAsignados.setAlineacion("center,left,left,center,center");
   let iconos = {
      "col4": {
         "opciones": [
            { "campo_bd": "edit_fv", "valor_campo": "0", "tooltip": "Sin privilegio para editar fecha vigencia"},
            { "campo_bd": "edit_fv", "valor_campo": "1", "callback": "actualizaVigencia", "tooltip": "Actualizar Fecha de Vigencia"}
         ]
      },
      "col5": {
         "opciones": [
            { "campo_bd": "detalle", "valor_campo": "1", "icono": "fa-solid fa-magnifying-glass fa-sm", "callback": "detalleRol", "tooltip": "Detalle del Rol", "tipoicono": "i", "color": "color_black" }
         ]
      }
   };
   tableRolesAsignados.fontSize = '0.75rem';
   tableRolesAsignados.setIconos(iconos);
   tableRolesAsignados.parametros = "id_usuario="+idUsuario+"&nombre_descripcion="+$("#busq_roles_asig").val()+"&tipo=RA";
   tableRolesAsignados.loadJSON();
}
//!
function cerrarVMRoles() {
   tableRolesDisponible.barraDibujada = false;
   tableRolesAsignados.barraDibujada = false;
   recargaPaginadoPrincipal();
}
//!
function confirmacionAsignarRoles(tipo_asginacion) {
   let msg = "";
   let html = "";
   let botones = "";
   let titulo = 'Asignaci&oacute;n de Fecha de Vigencia';
   let filasTblRoldisp = tableRolesDisponible.countMarcados(0);

   if(tipo_asginacion === 'INDIVIDUAL') {
      if(parseInt(filasTblRoldisp) === 0) {
         msg += "<li>Seleccionar un rol</li>";
      }

      if (msg.length > 0) {
         Swal.fire({
            title: 'Dato Requerido',
            html: "<ul class='p-font-msg-1-2 text-dark'>"+msg+"</ul>",
            icon: 'warning',
            showDenyButton: true,
            denyButtonText: "Aceptar",
            showConfirmButton: false
         });
         return false;
      }
   }
   else {
      filasTblRoldisp = $('#tblRolesDisponibles').find('tbody tr').length;
   }

   if (msg.length === 0 && parseInt(filasTblRoldisp) > 0) {
      $("#overlay2").show();
      html +=  `<form method="post" class="form-horizontal frm-fecha-vg" id="frmfecha" name="frmfecha" novalidate onsubmit="return false;">
                  <div class="row">
                     <div class="col-sm-6">
               		   <div class="form-floating mb-3">
                           <input type="date" class="form-control" id="vm_fecha_vig_inicio_rol" name="vm_fecha_vig_inicio_rol"
                              onchange="validRangoFechaVigenciaRol()" placeholder="Fecha Inicio Vigencia" required>
                           <label>
                             <span class="border-start border-light-secondary ps-3">Fecha Inicio Vigencia</span>
                           </label>
                           <div class="invalid-feedback">Fecha inicio vigencia requerido</div>
                        </div>
               		</div>
                     <div class="col-sm-6">
               		   <div class="form-floating mb-3">
                           <input type="date" class="form-control" id="vm_fecha_vig_termino_rol" name="vm_fecha_vig_termino_rol"
                              placeholder="Fecha T&eacute;rmino Vigencia">
                           <label>
                              <span class="border-start border-light-secondary ps-3">Fecha T&eacute;rmino Vigencia</span>
                           </label>
                        </div>
               		</div>
                  </div>
               </form>`;

      botones +=  `<button type="button" class="btn btn-info me-1" btn="btn" id="bt_asig_rol" onclick="validacionAsignacionRol('${tipo_asginacion}')">
                     <i class="fa-solid fa-arrow-right-arrow-left me-2"></i>Aplicar asignaci&oacute;n de role (s)
                  </button>`;
      botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="cerrarmodalRol()">
                     <i class="fa-solid fa-xmark me-2"></i>Cerrar
                  </button>`;

      modal('fusuario', titulo, html, 'formdefault-center', botones, 'cerrarmodalRol()');
   }
   else {
      Swal.fire({
         title: 'Asignación de Roles',
         html: '<p class="p-font-msg-1-2">No hay roles <span class="fw-bold">disponible</span></p>',
         icon: 'warning',
         showDenyButton: true,
         denyButtonText: "Aceptar",
         showConfirmButton: false
      });
   }
}
//!
function validRangoFechaVigenciaRol() {
   $("#vm_fecha_vig_termino_rol").val('');
   $("#vm_fecha_vig_termino_rol").prop("min",$("#vm_fecha_vig_inicio_rol").val());
}
//! Función de validacion de asignacion de roles
function validacionAsignacionRol(tipo_asginacion) {
   let contador = 0;
   //? Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-fecha-vg');
   //? Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0){
      agregarRoles(tipo_asginacion);
   }
}
//! Función de agregar roles al usuario
function agregarRoles(tipo_asginacion) {
   const id_user = $("#pidUsuario").val();
   let formData = new FormData();
   formData.append("id_usuario", id_user);
   formData.append("tipo_asginacion", tipo_asginacion);
   formData.append("id_roles", tableRolesDisponible.getCheckMarcados(0));
   formData.append("fecha_vigencia_inicio", $("#vm_fecha_vig_inicio_rol").val());
   formData.append("fecha_vigencia_termino", $("#vm_fecha_vig_termino_rol").val());
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/getAgregarRolesUsuarios',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', false);
         $("#overlayprincipal").show();
         $("#bt_asig_rol").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Aplicar asignaci&oacute;n de role (s)');
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
                  cerrarmodalRol();
                  cargartableRol();
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
         $("#bt_asig_rol").html('<i class="fa-solid fa-arrow-right-arrow-left me-2"></i>Aplicar asignaci&oacute;n de role (s)');
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
function confirmacionQuitarRoles(tipo_remove) {
   let msg = "";
   let filasTblRolasig = tableRolesAsignados.countMarcados(0);

   if(tipo_remove == 'INDIVIDUAL') {
      if(parseInt(filasTblRolasig) === 0) {
         msg += "<li>Seleccionar un rol</li>";
      }

      if (msg.length > 0) {
         Swal.fire({
            title: 'Dato Requerido',
            html: "<ul class='p-font-msg-1-2 text-dark'>"+msg+"</ul>",
            icon: 'warning',
            showDenyButton: true,
            denyButtonText: "Aceptar",
            showConfirmButton: false
         });
         
         return false;
      }
   }
   else {
      filasTblRolasig = $('#tblRolesAsignados').find('tbody tr').length;
   }

   if (msg.length === 0 && parseInt(filasTblRolasig) > 0) {
      eliminarRoles(tipo_remove);
   }
   else {
      Swal.fire({
         title: 'Eliminación de Roles',
         html: '<p class="p-font-msg-1-2 text-dark">No hay roles <span class="fw-bold">asignados</span></p>',
         icon: 'warning',
         showDenyButton: true,
         denyButtonText: "Aceptar",
         showConfirmButton: false
      });
   }
}
//!
function eliminarRoles(tipo_remove) {
   const id_user = $("#pidUsuario").val();
   let formData = new FormData();
   formData.append("id_usuario", id_user);
   formData.append("tipo_remove", tipo_remove);
   formData.append("id_usuario_roles", tableRolesAsignados.getCheckMarcados(0));
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/getEliminarRoles',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', false);
         $("#overlayprincipal").show();
         targetPrincipal = document.getElementById('fusuario');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         if (data.respuesta === false) {
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
                  getRolesAsignados();
                  setTimeout(() => {
                     getRolesDisponible();
                  }, 800);
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
function actualizaVigencia(reg) {
   let html = '';
   let botones = '';
   let titulo = 'Actulizaci&oacute;n de Vigencia del Rol Asignado';
   $("#overlay2").show();
   //
   html +=  `<form method="post" class="frm-act-fecha_vig" id="frmActFVRol" name="frmActFVRol" novalidate onSubmit="return false;">
               <div class="row">
                  <div class="col-sm-12">
            		   <div style="margin-left:15px;">
            			   <figure>
                           <blockquote class="blockquote"><p class="p-font-weight-500 p-font-msg-09">${reg.nombre_rol}</p></blockquote>
            			      <figcaption class="blockquote-footer fw-bold">Nombre del Rol</figcaption>
                        </figure>
            			   <hr style="margin-top:-10px">
            		   </div>
            	   </div>
               </div>
               <div class="row">
                  <div class="col-sm-6">
            		   <div class="form-floating mb-3">
                        <input type="date" class="form-control" id="fecha_vigencia_inicio_rol" name="fecha_vigencia_inicio_rol"
                           onchange="validActFechaVigenciaRol()" placeholder="Fecha Inicio Vigencia" required>
                        <label>
                           <span class="border-start border-light-secondary ps-3">Fecha Inicio Vigencia</span>
                        </label>
                       <div class="invalid-feedback">Fecha inicio vigencia requerido</div>
                    </div>
            		</div>
                  <div class="col-sm-6">
            		   <div class="form-floating mb-3">
                        <input type="date" class="form-control" id="fecha_vigencia_termino_rol" name="fecha_vigencia_termino_rol"
                           placeholder="Fecha T&eacute;rmino Vigencia">
                        <label>
                           <span class="border-start border-light-secondary ps-3">Fecha T&eacute;rmino Vigencia</span>
                        </label>
                    </div>
            		</div>
               </div>
            </form>`;

   botones +=  `<button type="button" id="bt_act_fv_rol" class="btn btn-info me-1" btn="btn" onclick="validacionActFechaVigRol(${reg.id_usuario_rol})">
                  <i class="fa-solid fa-arrow-right-arrow-left me-2"></i>Aplicar Cambio
               </button>`;
   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="cerrarmodalRol()">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modal('fusuario', titulo, html, 'formdefault_scrollable_center', botones, 'cerrarmodalRol()');
   $("#fecha_vigencia_inicio_rol").val(reg.fvigencia_inicio);
   validActFechaVigenciaRol();
   $("#fecha_vigencia_termino_rol").val(reg.fvigencia_fin);
}
//!
function validActFechaVigenciaRol() {
   $("#fecha_vigencia_termino_rol").val('');
   $("#fecha_vigencia_termino_rol").prop('min',$("#fecha_vigencia_inicio_rol").val());
}
//! Función de validacion de cambio de fecha de vigencia de roles asginados
function validacionActFechaVigRol(id_usuario_rol) {
   let contador = 0;
   //? Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-act-fecha_vig');
   //? Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0){
      actuaizarFechaVigenciaRolesAsignados(id_usuario_rol);
   }
}
//! Función de agregar roles al usuario
function actuaizarFechaVigenciaRolesAsignados(id_usuario_rol) {
   let formData = new FormData();
   formData.append("id_usuario_rol", id_usuario_rol);
   formData.append("fecha_vigencia_inicio", $("#fecha_vigencia_inicio_rol").val());
   formData.append("fecha_vigencia_termino", $("#fecha_vigencia_termino_rol").val());
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/updateFechaVigenciaUsuarioRol',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', false);
         $("#overlayprincipal").show();
         $("#bt_act_fv_rol").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Aplicar Cambio');
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
                  cerrarmodalRol();
                  getRolesAsignados();
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
         $("#bt_act_fv_rol").html('<i class="fa-solid fa-arrow-right-arrow-left me-2"></i>Aplicar Cambio');
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
function getTreeRoles(idRol) {
   let json = "";
   let formData = new FormData();
   formData.append("id_rol", idRol);
   $.ajax({
      method: 'post',
      url: contexto+'Usuarios/getDetalleRol',
      async: false,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: formData,
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         targetPrincipal = document.getElementById('fusuario');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success:function(data){
         json = data;
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
   
   return json;
}
//!
function detalleRol(reg) {
   let html = '';
   let botones = '';
   let titulo = 'Configuraci&oacute;n del Rol';
   let nombreSistema = 'PAINANI';
   $("#overlay2").show();
   //
   html +=  `<form method="post" name="frmDetRol" id="frmDetRol" onSubmit="return false;">
               <div class="row">
                  <div class="col-sm-12">
            		   <div style="margin-left:15px;">
            			   <figure><blockquote class="blockquote">
            				   <p class="p-font-weight-500 p-font-msg-09">${reg.nombre_rol}</p>
            			   </blockquote>
            			   <figcaption class="blockquote-footer fw-bold">Nombre del Rol</figcaption></figure>
            		   </div>
            	   </div>
               </div>
               <hr style="margin-top:-5px">
               <div class="row">
                  <div class="col-sm-12">
                     <div style="margin-left:10px;" id="tree"></div>
                  </div>
               </div>
            </form>`;
   
   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="cerrarmodalRol()">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;
   modal('fusuario',titulo,html,'formdefault_scrollable_center',botones,'cerrarmodalRol()');
   
   $('#tree').html(`<span class="fw-bold">${nombreSistema}</span>`);
   const tree = new dhx.Tree("tree", {
      css: "custom-class",
      template: ({ value }, isFolder) => {
         const template =
            `<div class="dhx_tree_template"><span class="dhx_tree_template__value" style="font-size:14px">${value}</span></div>`
				return isFolder ? null : template;
      }
   });
   
   const dataset = getTreeRoles(reg.id_rol);
   if(dataset.length > 0){
      tree.data.parse(dataset);
      tree.collapseAll();
   }
   else{
      $("#tree").html(`<div class="alert alert-light-border-danger text-center" role="alert" style="font-size:1.2rem">
                     <i class="fas fa-exclamation-triangle fa-lg"></i>&nbsp;
                     El rol no tiene configuraci&oacute;n registrada en <span class="fw-bold">${nombreSistema}</span></div>`);
   }
}
//!
function cerrarmodalRol() {
   $("#overlay2").hide();
   closeModal();
}
//!
function keyEventRolDisp(event) {
   let tecla = (event.all) ? event.keyCode : event.which;
   if (tecla == 13) {
      getRolesDisponible();
   }
   else {
      return false;
   }
}
//!
function keyEventRolAsig(event) {
   let tecla = (event.all) ? event.keyCode : event.which;
   if (tecla == 13) {
      getRolesAsignados();
   }
   else {
      return false;
   }
}