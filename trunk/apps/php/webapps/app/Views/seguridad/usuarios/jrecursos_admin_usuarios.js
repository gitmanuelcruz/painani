// TODO: Proceso donde se asigna recurso para administrar
function adminRecurso(reg) {
   let html = "";
   let botones = "";
   let titulo = 'Asignaci&oacute;n de Recursos para Administrar por el Usuario &raquo; <span class="p-font-weight">'+reg.nombre_completo+' ('+reg.usuario+')</span>';
   const privAddIndAR = reg.add_ind_rec_admin;
   const privAddAllAR = reg.add_mas_rec_admin;
   const privRemoveIndAR = reg.elim_ind_rec_admin;
   const privRemoveAllAR = reg.elim_mas_rec_admin;

   html +=  '<form method="post" id="frmAdminRecursoUser" name="frmAdminRecursoUser" onSubmit="return false;">'+
            '  <input type="hidden" name="pidUsuarioAR" id="pidUsuarioAR" value="'+reg.usuario+'"/>'+
            '</form>';        
   html +=  '<div class="row">'+
            '  <div class="col-sm-5">'+
            '     <div class="card w-100">'+
            '        <div class="card-header h-50 bg-secondary fw-bold f-s-16 text-white">Recursos Disponibles</div>'+
            '        <div class="card-body overflow-auto" style="height:700px; max-height:700px; background-color:#f9f4f4">'+
            '           <div class="row">'+
            '              <div class="col-sm-12">'+
            '                 <div class="form-floating mb-3">'+
            '                    <input type="text" class="form-control form-input-bg" id="busq_recursos_admin_disp" name="busq_recursos_admin_disp" '+
            '                       placeholder="Descripción" onKeyPress="keyEventAR(event, '+"'ARD'"+')">'+
            '                    <label>'+
            '                       <i class="fa-solid fa-magnifying-glass feather-sm text-dark fill-white me-2"></i>'+
            '                       <span class="border-start border-light-secondary ps-3">Descripci&oacute;n</span>'+
            '                    </label>'+
            '                 </div>'+
            '              </div>'+
            '           </div>'+
            '           <div class="row">'+
            '              <div class="col-sm-12">'+
            '                 <div class="card">'+
            '                    <div class="card-body">'+
            '                       <div class="table-responsive-sm">'+
            '                          <table class="table table-sm table-hover" id="tblRecursoAdminDisponibles" width="100%">'+
            '                             <thead class="table-dark">'+
            '                                <tr class="p-font-msg-09">'+
            '                                   <th width="5%" class="text-center text-white"></th>'+
            '                                   <th width="95%" class="text-start text-white">Descripci&oacute;n</th>'+
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
            '  </div>';
            
   html +=  '  <div class="col-sm-1">'+
            '     <div class="row" style="margin-top:80px">';
   if(parseInt(privAddIndAR) > 0) {
      html +=  '     <div class="col-12 text-center mb-1">'+
               '        <button type="button" class="btn btn-info tooltip_icon_recadmin" btn="btn" data-bs-toggle="tooltip" '+
               '           data-bs-html="true" data-bs-placement="top" data-bs-title="Agregar selecionados" '+
               '           onclick="confirmacionAsignarAdminRecursos('+"'INDIVIDUAL'"+')">'+
               '           &nbsp;<i class="fa-solid fa-angle-right feather-sm"></i>&nbsp;'+
               '        </button>'+
               '     </div>';
   }
   if(parseInt(privAddAllAR) > 0){   
      html +=  '     <div class="col-12 text-center mb-1">'+
               '        <button type="button" class="btn btn-info tooltip_icon_recadmin" btn="btn" data-bs-toggle="tooltip" '+
               '           data-bs-html="true" data-bs-placement="top" data-bs-title="Agregar todos" '+
               '           onclick="confirmacionAsignarAdminRecursos('+"'MASIVO'"+')">'+
               '           <i class="fa-solid fa-angles-right feather-sm"></i>'+
               '        </button>'+
               '     </div>';
   }
   if(parseInt(privRemoveIndAR) > 0){
      html +=  '     <div class="col-12 text-center mb-1">'+
               '        <button type="button" class="btn btn-info tooltip_icon_recadmin" btn="btn" data-bs-toggle="tooltip" '+
               '           data-bs-html="true" data-bs-placement="top" data-bs-title="Eliminar selecionados" '+
               '           onclick="confirmacionQuitarRecursosAdmin('+"'INDIVIDUAL'"+')">'+
               '           &nbsp;<i class="fa-solid fa-angle-left feather-sm"></i>&nbsp;'+
               '        </button>'+
               '     </div>';
   }
   if(parseInt(privRemoveAllAR) > 0) {
      html +=  '     <div class="col-12 text-center mb-1">'+
               '        <button type="button" class="btn btn-info tooltip_icon_recadmin" btn="btn" data-bs-toggle="tooltip" '+
               '           data-bs-html="true" data-bs-placement="top" data-bs-title="Eliminar selecionados" '+
               '           onclick="confirmacionQuitarRecursosAdmin('+"'MASIVO'"+')">'+
               '           <i class="fa-solid fa-angles-left feather-sm"></i>'+
               '        </button>'+
               '     </div>';
   }
   html +=  '     </div>'+
            '  </div>';
   html +=  '  <div class="col-sm-6">'+
            '     <div class="card w-100">'+
            '        <div class="card-header h-50 bg-secondary fw-bold f-s-16 text-white">Recursos Asignados</div>'+
            '        <div class="card-body overflow-auto" style="height:700px; max-height:700px; background-color:#f9f4f4">'+
            '           <div class="row">'+
            '              <div class="col-sm-12">'+
            '                 <div class="form-floating mb-3">'+
            '                    <input type="text" class="form-control form-input-bg" id="busq_recursos_admin_asig" name="busq_recursos_admin_asig" '+
            '                           placeholder="Descripción" onKeyPress="keyEventAR(event, '+"'ARA'"+')">'+
            '                    <label>'+
            '                       <i class="fa-solid fa-magnifying-glass feather-sm text-dark fill-white me-2"></i>'+
            '                       <span class="border-start border-light-secondary ps-3">Descripci&oacute;n</span>'+
            '                    </label>'+
            '                 </div>'+
            '              </div>'+
            '           </div>'+
            '           <div class="row">'+
            '              <div class="col-sm-12">'+
            '                 <div class="card">'+
            '                    <div class="card-body">'+
            '                       <div class="table-responsive-sm">'+
            '                          <table class="table table-sm table-hover" id="tblRecursosAdminAsignados" width="100%">'+
            '                             <thead class="table-dark">'+
            '                                <tr class="p-font-msg-09">'+
            '                                   <th width="5%" class="text-center text-white"></th>'+
            '                                   <th width="95%" class="text-start text-white">Descripci&oacute;n</th>'+
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
            '</div>';

   botones +=  '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="cerrarVMRecursoAdmin()">'+
               '  <i class="fa-solid fa-xmark me-2"></i>Cerrar'+
               '</button>';
   modalFullScreen('fusuario', titulo, html, 'formxxl_scrollable', botones, 'cerrarVMRecursoAdmin()');
   $(".tooltip_icon_recadmin").tooltip();
   cargaTablaRecursosAdmin();
}
//!
function cargaTablaRecursosAdmin() {
   getAdminRecursosDisponible();
   setTimeout(() => {
      getAdminRecursosAsignado();
   }, 800);
}
//!
function getAdminRecursosDisponible() {
   let idUsuario = $("#pidUsuarioAR").val();
   tableAdminRecursosDisponible.setTablaHTML("tblRecursoAdminDisponibles");
   tableAdminRecursosDisponible.setUrl(contexto+"Usuarios/getConsultaAdminRecurso");
   tableAdminRecursosDisponible.setRegistrosPagina(15);
   tableAdminRecursosDisponible.setColumnas("id_recurso,nombre_recurso");
   tableAdminRecursosDisponible.setColTipos("checkbox,text");
   tableAdminRecursosDisponible.setAlineacion("center,left");
   tableAdminRecursosDisponible.fontSize = '0.8rem';
   tableAdminRecursosDisponible.parametros = "id_usuario="+idUsuario+"&busq_recursos_admin_disp="+$("#busq_recursos_admin_disp").val()+"&tipo=ARD";
   tableAdminRecursosDisponible.loadJSON();
}
//!
function getAdminRecursosAsignado() {
   let idUsuario = $("#pidUsuarioAR").val();
   tableAdminRecursosAsignados.setTablaHTML("tblRecursosAdminAsignados");
   tableAdminRecursosAsignados.setUrl(contexto+"Usuarios/getConsultaAdminRecurso");
   tableAdminRecursosAsignados.setRegistrosPagina(15);
   tableAdminRecursosAsignados.setColumnas("id_usuario_recurso_admin,nombre_recurso");
   tableAdminRecursosAsignados.setColTipos("checkbox,text");
   tableAdminRecursosAsignados.setAlineacion("center,left");
   tableAdminRecursosAsignados.fontSize = '0.8rem';
   tableAdminRecursosAsignados.parametros = "id_usuario="+idUsuario+"&busq_recursos_admin_asig="+$("#busq_recursos_admin_asig").val()+"&tipo=ARA";
   tableAdminRecursosAsignados.loadJSON();
}
//!
function cerrarVMRecursoAdmin() {
   tableAdminRecursosDisponible.barraDibujada = false;
   tableAdminRecursosAsignados.barraDibujada = false;
   recargaPaginadoPrincipal();
}
//!
function keyEventAR(event, tipo) {
   let tecla = (event.all) ? event.keyCode : event.which;
   if (tecla == 13) {
      if(tipo == 'ARD') {
         getAdminRecursosDisponible();
      }
      else {
         getAdminRecursosAsignado();
      }
   }
   else {
      return false;
   }
}
//!
function confirmacionAsignarAdminRecursos(tipo_asginacion) {
   let msg = "";
   let filasTblAdminRecdisp = tableAdminRecursosDisponible.countMarcados(0);

   if(tipo_asginacion == 'INDIVIDUAL') {
      if(parseInt(filasTblAdminRecdisp) == 0) {
         msg += "<li>Seleccionar un recurso</li>";
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
      filasTblAdminRecdisp = $('#tblRecursoAdminDisponibles').find('tbody tr').length;
   }

   if (msg.length === 0 && parseInt(filasTblAdminRecdisp) > 0) {
      agregarAdminRecursos(tipo_asginacion);
   }
   else {
      Swal.fire({
         title: 'Asignación de Recursos',
         html: '<p class="p-font-msg-1-2 text-dark">No hay recursos <span class="fw-bold">disponible</span></p>',
         icon: 'warning',
         showDenyButton: true,
         denyButtonText: "Aceptar",
         showConfirmButton: false
      });
   }
}
//!
function agregarAdminRecursos(tipo_asginacion) {
   const id_user = $("#pidUsuarioAR").val();
   let formData = new FormData();
   formData.append("id_usuario", id_user);
   formData.append("tipo_asginacion", tipo_asginacion);
   formData.append("id_recurso", tableAdminRecursosDisponible.getCheckMarcados(0));
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/getAgregarAdminRecursos',
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
                  cargaTablaRecursosAdmin();
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
function confirmacionQuitarRecursosAdmin(tipo_remove) {
   let msg = "";
   let filasTblAdminRecAsig = tableAdminRecursosAsignados.countMarcados(0);

   if(tipo_remove == 'INDIVIDUAL') {
      if(parseInt(filasTblAdminRecAsig) == 0) {
         msg += "<li>Seleccionar un rol</li>";
      }

      if (msg.length > 0) {
         Swal.fire({
            title: 'Dato Requerido',
            html: "<ul class='p-font-msg-1-2 text-dark'>"+msg+"</ul>",
            icon: 'warning',
            showDenyButton: true,
            denyButtonText: "ok",
            showConfirmButton: false
         });
         
         return false;
      }
   }
   else {
      filasTblAdminRecAsig = $('#tblRecursosAdminAsignados').find('tbody tr').length;
   }

   if (msg.length === 0 && parseInt(filasTblAdminRecAsig) > 0) {
      eliminarAdminRecursos(tipo_remove);
   }
   else {
      Swal.fire({
         title: 'Eliminación de Recursos',
         html: '<p class="p-font-msg-1-2 text-dark">No hay recursos <span class="p-font-weight">asignados</span></p>',
         icon: 'warning',
         showDenyButton: true,
         denyButtonText: "Aceptar",
         showConfirmButton: false
      });
   }
}
//! Función de eliminar recurso admin al usuario
function eliminarAdminRecursos(tipo_remove) {
   const id_user = $("#pidUsuarioAR").val();
   let formData = new FormData();
   formData.append("id_usuario", id_user);
   formData.append("id_usuario_recurso_admin", tableAdminRecursosAsignados.getCheckMarcados(0));
   formData.append("tipo_remove", tipo_remove);
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/getEliminarAdminRecursos',
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
                  getAdminRecursosAsignado();
                  setTimeout(() => {
                     getAdminRecursosDisponible();
                  }, 1000);
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