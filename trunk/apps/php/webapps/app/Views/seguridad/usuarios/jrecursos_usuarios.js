let contadorRec = "";
// TODO: Proceso donde se asigna recurso al usuario
function asignarRecurso(reg) {
   let html = "";
   let botones = "";
   let titulo = 'Asignaci&oacute;n de Recursos para el Usuario &raquo; <span class="p-font-weight">'+reg.nombre_completo+' ('+reg.usuario+')</span>';
   const privAddIndARE = reg.add_ind_rec_asig;
   const privAddAllARE = reg.add_mas_rec_asig;
   const privRemoveIndARE = reg.elim_ind_rec_asig;
   const privRemoveAllARE = reg.elim_mas_rec_asig;

   html +=  '<form method="post" id="frmAsignarRecursoUser" name="frmAsignarRecursoUser" onSubmit="return false;">'+
            '  <input type="hidden" name="pidUsuarioARE" id="pidUsuarioARE" value="'+reg.usuario+'"/>'+
            '</form>';
   html +=  '<div class="row app-form">'+
            '  <div class="col-sm-12">'+
            '     <label class="form-label">Tipo de Recurso</label>'+
            '		<div class="form-group" id="divTipoRec">'+
            '        <select class="form-control selectpicker" id="vm_id_tipo_recurso" name="vm_id_tipo_recurso" required style="width:100%" '+
            '				onchange="cargaTablaRecursos(this.value);validCombos(this.id,'+"'divTipoRec'"+')">'+
            '			   <option value="">[Seleccione una opci&oacute;n]</option>'+
            '        </select>'+
            '        <div class="invalid-feedback">Tipo de recurso requerido</div>'+
            '		</div>'+
            '  </div>'+
            '</div>'+
            '<hr>';
   html +=  '<div class="row">'+
            '  <div class="col-sm-5">'+
            '     <div class="card w-100">'+
            '        <div class="card-header h-50 bg-secondary fw-bold f-s-16 text-white">Recursos Disponibles</div>'+
            '        <div class="card-body overflow-auto" style="height:700px; max-height:700px; background-color:#f9f4f4">'+
            '           <div class="row">'+
            '              <div class="col-sm-12">'+
            '                 <div class="form-floating mb-3">'+
            '                    <input type="text" class="form-control form-input-bg" id="busq_asig_recursos_disp" name="busq_asig_recursos_disp" '+
            '                           placeholder="Descripción" onKeyPress="keyEventARE(event,'+"'ARD'"+')">'+
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
            '                          <table class="table table-sm table-hover" id="tblAsigRecursoDisponibles" width="100%">'+
            '                             <thead class="table-dark">'+
            '                                <tr class="p-font-msg-08">'+
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
   if(parseInt(privAddIndARE) > 0) {
      html +=  '     <div class="col-12 text-center mb-1">'+
               '        <button type="button" class="btn btn-info tooltip_icon_rec" btn="btn" data-bs-toggle="tooltip" '+
               '           data-bs-html="true" data-bs-placement="top" data-bs-title="Agregar selecionados" '+
               '           onclick="confirmacionAsignarRecursos('+"'INDIVIDUAL'"+')">'+
               '           &nbsp;<i class="fa-solid fa-angle-right feather-sm"></i>&nbsp;'+
               '        </button>'+
               '     </div>';
   }
   if(parseInt(privAddAllARE) > 0){
      html +=  '     <div class="col-12 text-center mb-1">'+
               '        <button type="button" class="btn btn-info tooltip_icon_rec" btn="btn" data-bs-toggle="tooltip" '+
               '           data-bs-html="true" data-bs-placement="top" data-bs-title="Agregar todos" '+
               '           onclick="confirmacionAsignarRecursos('+"'MASIVO'"+')">'+
               '           <i class="fa-solid fa-angles-right feather-sm"></i>'+
               '        </button>'+
               '     </div>';
   }
   if(parseInt(privRemoveIndARE) > 0){
      html +=  '     <div class="col-12 text-center mb-1">'+
               '        <button type="button" class="btn btn-info tooltip_icon_rec" btn="btn" data-bs-toggle="tooltip" '+
               '           data-bs-html="true" data-bs-placement="top" data-bs-title="Eliminar selecionados" '+
               '           onclick="confirmacionQuitarRecursos('+"'INDIVIDUAL'"+')">'+
               '           &nbsp;<i class="fa-solid fa-angle-left feather-sm"></i>&nbsp;'+
               '        </button>'+
               '     </div>';
   }
   if(parseInt(privRemoveAllARE) > 0) {
      html +=  '     <div class="col-12 text-center mb-1">'+
               '        <button type="button" class="btn btn-info tooltip_icon_rec" btn="btn" data-bs-toggle="tooltip" '+
               '           data-bs-html="true" data-bs-placement="top" data-bs-title="Eliminar selecionados" '+
               '           onclick="confirmacionQuitarRecursos('+"'MASIVO'"+')">'+
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
            '                    <input type="text" class="form-control form-input-bg" id="busq_asig_recursos_asig" name="busq_asig_recursos_asig" '+
            '                           placeholder="Descripción" onKeyPress="keyEventARE(event,'+"'ARA'"+')">'+
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
            '                          <table class="table table-sm table-hover" id="tblAsigRecursosAsignados" width="100%">'+
            '                             <thead class="table-dark">'+
            '                                <tr class="p-font-msg-08">'+
            '                                   <th width="5%" class="text-center"></th>'+
            '                                   <th width="60%" class="text-start text-white">Descripci&oacute;n</th>'+
            '                                   <th width="35%" class="text-center text-white">Fecha Vigencia</th>'+
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

   botones +=  '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="cerrarVMRecurso()">'+
               '  <i class="fa-solid fa-xmark me-2"></i>Cerrar</button>';

   modalFullScreen('fusuario', titulo, html, 'formxxl_scrollable', botones, 'cerrarVMRecurso()');
   $(".selectpicker").select2({dropdownParent: $("#vModalFullScreen")});
   $(".tooltip_icon_rec").tooltip();
   cargaCombosTiposRecurso();
}
//!
function cargaCombosTiposRecurso() {
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/getComboRecursos',
      async: true,
      dataType: 'json',
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         targetPrincipal = document.getElementById('fusuario');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         $("#vm_id_tipo_recurso").html('<option value="">[Seleccione una opci&oacute;n]</option>');
         $(data).each(function(i, v) {
            $("#vm_id_tipo_recurso").append('<option value="'+v.id+'">'+v.descripcion+'</option>');
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
function cargaTablaRecursos(id_recurso) {
   if(id_recurso !== '') {
      getRecursosDisponible();
      setTimeout(() => {
         getRecursosAsignados()
      }, 800);
   }
}
//!
function getRecursosDisponible() {
   const idUsuario = $('#pidUsuarioARE').val();
   let idTipoRecurso = $("#vm_id_tipo_recurso").val();
   tableRecursosDisponible.setTablaHTML("tblAsigRecursoDisponibles");
   tableRecursosDisponible.setUrl(contexto+"Usuarios/getConsultaRecursos");
   tableRecursosDisponible.setRegistrosPagina(10);
   tableRecursosDisponible.setColumnas("id,descripcion");
   tableRecursosDisponible.setColTipos("checkbox,text");
   tableRecursosDisponible.setAlineacion("center,left");
   tableRecursosDisponible.fontSize = '0.75rem';
   tableRecursosDisponible.parametros = "id_usuario="+idUsuario+"&id_recurso="+idTipoRecurso+"&busq_asig_recursos_disp="+$("#busq_asig_recursos_disp").val()+"&tipo=ARD";
   tableRecursosDisponible.loadJSON();
}
//!
function getRecursosAsignados() {
   const idUsuario = $('#pidUsuarioARE').val();
   let idTipoRecurso = $("#vm_id_tipo_recurso").val();
   tableRecursosAsignados.setTablaHTML("tblAsigRecursosAsignados");
   tableRecursosAsignados.setUrl(contexto+"Usuarios/getConsultaRecursos");
   tableRecursosAsignados.setRegistrosPagina(10);
   tableRecursosAsignados.setColumnas("id,descripcion,fecha_vigencia");
   tableRecursosAsignados.setColTipos("checkbox,text,link");
   tableRecursosAsignados.setAlineacion("center,left,center");
   let iconos = {
      "col3": {
         "opciones": [
            { "campo_bd": "edit_fv", "valor_campo": "0", "tooltip": "Sin privilegio para actualizar fecha vigencia"},
            { "campo_bd": "edit_fv", "valor_campo": "1", "callback": "actualizaVigenciaRecurso", "tooltip": "Actualizar Fecha Vigencia"}
         ]
      }
   };
   tableRecursosAsignados.fontSize = '0.75rem';
   tableRecursosAsignados.setIconos(iconos);
   tableRecursosAsignados.parametros = "id_usuario="+idUsuario+"&id_recurso="+idTipoRecurso+"&busq_asig_recursos_asig="+$("#busq_asig_recursos_asig").val()+"&tipo=ARA";
   tableRecursosAsignados.loadJSON();
}
//!
function cerrarVMRecurso() {
   tableRecursosDisponible.barraDibujada = false;
   tableRecursosAsignados.barraDibujada = false;
   recargaPaginadoPrincipal();
}
//!
function keyEventARE(event, tipo) {
   let tecla = (event.all) ? event.keyCode : event.which;
   if (tecla == 13) {
      if(tipo == 'ARD') {
         getRecursosDisponible();
      }
      else {
         getRecursosAsignados();
      }
   }
   else {
      return false;
   }
}
//!
function confirmacionAsignarRecursos(tipo_asginacion) {
   let msg = "";
   let html = "";
   let botones = "";
   let titulo = 'Asignaci&oacute;n de Fecha de Vigencia';
   let filasTblRecursosDisp = tableRecursosDisponible.countMarcados(0);

   if(tipo_asginacion == 'INDIVIDUAL') {
      if(parseInt(filasTblRecursosDisp) === 0) {
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
      filasTblRecursosDisp = $('#tblAsigRecursoDisponibles').find('tbody tr').length;
   }

   if (msg.length == 0 && parseInt(filasTblRecursosDisp) > 0) {
      $("#overlay2").show();
      html +=  `<form method="post" class="form-horizontal frm-fecha-vg_rec" id="frmfecha_rec" name="frmfecha_rec" novalidate onsubmit="return false;">
                  <div class="row">
                     <div class="col-sm-6">
               		   <div class="form-floating mb-3">
                           <input type="date" class="form-control" id="vm_fecha_vig_inicio_recurso" name="vm_fecha_vig_inicio_recurso"
                              onchange="validFechaVigenciaRecurso()" placeholder="Fecha Inicio Vigencia" required>
                           <label>
                              <span class="border-start border-light-secondary ps-3">Fecha Inicio Vigencia</span>
                           </label>
                           <div class="invalid-feedback">Fecha inicio vigencia requerido</div>
                        </div>
               		</div>
                     <div class="col-sm-6">
               		   <div class="form-floating mb-3">
                           <input type="date" class="form-control" id="vm_fecha_vig_termino_recurso" name="vm_fecha_vig_termino_recurso"
                              placeholder="Fecha T&eacute;rmino Vigencia">
                           <label>
                              <span class="border-start border-light-secondary ps-3">Fecha T&eacute;rmino Vigencia</span>
                           </label>
                        </div>
               		</div>
                  </div>
               </form>`;

      botones +=  `<button type="button" class="btn btn-info me-1" btn="btn" id="bt_asig_recruso" onclick="validacionAsignacionRecurso('${tipo_asginacion}')">
                     <i class="fa-solid fa-arrow-right-arrow-left me-2"></i>Aplicar asignaci&oacute;n de recurso (s)
                  </button>`;
      botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="cerrarmodalRol()">
                     <i class="fa-solid fa-xmark me-2"></i>Cerrar
                  </button>`;
      modal('fusuario', titulo, html, 'formdefault-center', botones, 'cerrarmodalRol()');
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
function validFechaVigenciaRecurso() {
   $("#vm_fecha_vig_termino_recurso").val('');
   $("#vm_fecha_vig_termino_recurso").prop("min",$("#vm_fecha_vig_inicio_recurso").val());
}
//! Función de validacion de asignacion de roles
function validacionAsignacionRecurso(tipo_asginacion) {
   let contador = 0;
   //? Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-fecha-vg_rec');
   //? Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0){
      agregarRecurso(tipo_asginacion);
   }
}
//!
function agregarRecurso(tipo_asginacion) {
   const id_user = $("#pidUsuarioARE").val();
   const id_recurso = $('#vm_id_tipo_recurso').val();
   let formData = new FormData();
   formData.append("id_usuario", id_user);
   formData.append("id_recurso", id_recurso);
   formData.append("recurso_asignado", tableRecursosDisponible.getCheckMarcados(0));
   formData.append("fecha_vigencia_inicio", $("#vm_fecha_vig_inicio_recurso").val());
   formData.append("fecha_vigencia_termino", $("#vm_fecha_vig_termino_recurso").val());
   formData.append("tipo_asginacion", tipo_asginacion);
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/agregarRecursosUsuario',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', false);
         $("#overlayprincipal").show();
         $("#bt_asig_recruso").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Aplicar asignaci&oacute;n de recurso (s)');
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
                  cerrarmodalRecurso();
                  cargaTablaRecursos(id_recurso);
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
         $("#bt_asig_recruso").html('<i class="fa-solid fa-arrow-right-arrow-left me-2"></i>Aplicar asignaci&oacute;n de recurso (s)');
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
function confirmacionQuitarRecursos(tipo_remove) {
   let msg = "";
   let filasTblRecursoAsig = tableRecursosAsignados.countMarcados(0);

   if(tipo_remove === 'INDIVIDUAL') {
      if(parseInt(filasTblRecursoAsig) == 0) {
         msg += "<li>Seleccionar un recurso</li>";
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
      filasTblRecursoAsig = $('#tblAsigRecursosAsignados').find('tbody tr').length;
   }

   if (msg.length == 0 && parseInt(filasTblRecursoAsig) > 0) {
      eliminarRecurso(tipo_remove);
   }
   else {
      Swal.fire({
         title: 'Eliminación de Recursos',
         html: '<p class="p-font-msg-1-2 text-dark">No hay recursos <span class="fw-bold">asignados</span></p>',
         icon: 'warning',
         showDenyButton: true,
         denyButtonText: "Aceptar",
         showConfirmButton: false
      });
   }
}
//!
function eliminarRecurso(tipo_remove) {
   const id_user = $("#pidUsuarioARE").val();
   const id_recurso = $('#vm_id_tipo_recurso').val();
   let formData = new FormData();
   formData.append("id_usuario", id_user);
   formData.append("id_recurso", id_recurso);
   formData.append("id_recurso_asig", tableRecursosAsignados.getCheckMarcados(0));
   formData.append("tipo_remove", tipo_remove);
   
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/quitarRecursosUsuario',
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
                  getRecursosAsignados();
                  setTimeout(() => {
                     getRecursosDisponible();
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
function actualizaVigenciaRecurso(reg) {
   let html = '';
   let botones = '';
   let titulo = 'Actulizaci&oacute;n de Vigencia del Rol Asignado';
   $("#overlay2").show();
   //
   html +=  `<form method="post" class="frm-act-fecha_vig-rec" id="frmActFVRecurso" name="frmActFVRecurso" novalidate onSubmit="return false;">
               <div class="row">
                  <div class="col-sm-12">
            		   <div style="margin-left:15px;">
            			   <figure>
                           <blockquote class="blockquote"><p class="p-font-weight-500 p-font-msg-09">${reg.descripcion}</p></blockquote>
            			      <figcaption class="blockquote-footer fw-bold">Nombre del Recurso</figcaption>
                        </figure>
            			   <hr style="margin-top:-10px">
            		   </div>
            	   </div>
               </div>
               <div class="row">
                  <div class="col-sm-6">
            		   <div class="form-floating mb-3">
                        <input type="date" class="form-control" id="fecha_vigencia_inicio_rec" name="fecha_vigencia_inicio_rec"
                           onchange="validActFechaVigenciaRec()" placeholder="Fecha Inicio Vigencia" required>
                        <label>
                           <span class="border-start border-light-secondary ps-3">Fecha Inicio Vigencia</span>
                        </label>
                        <div class="invalid-feedback">Fecha inicio vigencia requerido</div>
                     </div>
            		</div>
                  <div class="col-sm-6">
            		   <div class="form-floating mb-3">
                        <input type="date" class="form-control" id="fecha_vigencia_termino_rec" name="fecha_vigencia_termino_rec"
                           placeholder="Fecha T&eacute;rmino Vigencia">
                        <label>
                           <span class="border-start border-light-secondary ps-3">Fecha T&eacute;rmino Vigencia</span>
                        </label>
                     </div>
            		</div>
               </div>
            </form>`;

   botones +=  `<button type="button" class="btn btn-info me-1" btn="btn" id="bt_act_fv_rec" onclick="validacionActFechaVigRec(${reg.id_usuario_recurso_asignado})">
                  <i class="fa-solid fa-arrow-right-arrow-left me-2"></i>Aplicar Cambio
               </button>`;
   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="cerrarmodalRecurso()">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modal('fusuario', titulo, html, 'formdefault_scrollable_center', botones, 'cerrarmodalRecurso()');
   $("#fecha_vigencia_inicio_rec").val(reg.fvigencia_inicio);
   validActFechaVigenciaRec();
   $("#fecha_vigencia_termino_rec").val(reg.fvigencia_fin);
}
//!
function validActFechaVigenciaRec() {
   $("#fecha_vigencia_termino_rec").val('');
   $("#fecha_vigencia_termino_rec").prop("min",$("#fecha_vigencia_inicio_rec").val());
}
//!
function validacionActFechaVigRec(id_usuario_rec_asig) {
   let contador = 0;
   //? Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-act-fecha_vig-rec');
   //? Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
      }
      form.classList.add('was-validated');
   });
   
   if(contador == 0){
      actFechaVigRecursosAsig(id_usuario_rec_asig);
   }
}
//!
function actFechaVigRecursosAsig(id_usuario_rec_asig) {
   let formData = new FormData();
   formData.append("id_usuario_rec_asig", id_usuario_rec_asig);
   formData.append("fecha_vigencia_inicio", $("#fecha_vigencia_inicio_rec").val());
   formData.append("fecha_vigencia_termino", $("#fecha_vigencia_termino_rec").val());
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/updateFechaVigenciaUserRecurso',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', false);
         $("#overlayprincipal").show();
         $("#bt_act_fv_rec").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Aplicar Cambio');
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
                  cerrarmodalRecurso();
                  getRecursosAsignados();
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
         $("#bt_act_fv_rec").html('<i class="fa-solid fa-arrow-right-arrow-left me-2"></i>Aplicar Cambio');
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
function cerrarmodalRecurso(){
   $("#overlay2").hide();
   closeModal();
}