function configuracionRol(reg) {
   let html = '';
   let botones = '';
   let titulo = 'Configuraci&oacute;n de Privilegios del Rol';

   html +=  `<form method="post" class="app-form frm-modal-rp" id="frmRolesPriv" name="frmRolesPriv" novalidate onSubmit="return false;">
               <input type="hidden" id="vm_id_rol" name="vm_id_rol" value="${reg.id_rol}"/>
               <div class="row">
                  <div class="col-sm-5">
            		   <figure>
                        <blockquote class="blockquote">
            				   <p class="p-font-weight-500 p-font-msg-09">${reg.nombre_rol}</p>
            			   </blockquote>
            			   <figcaption class="blockquote-footer fw-bold">Nombre del Rol</figcaption>
                     </figure>
            		</div>
                  <div class="col-sm-7">
            		   <figure>
                        <blockquote class="blockquote">
            				   <p class="p-font-weight-500 p-font-msg-09">${reg.descripcion}</p>
            			   </blockquote>
            			   <figcaption class="blockquote-footer fw-bold">Descripci&oacute;n del Rol</figcaption>
                     </figure>
            		</div>
               </div>
               <hr style="margin-top:-10px">
               <div class="row">
                  <div class="col-sm-7" id="divmsg">
                     <div class="row">
                        <div class="col-sm-12" style="max-height:300px; overflow-y:auto">
            		         <div class="dtree" id="divtree"></div>
                        </div>
                     </div>
            	   </div>
                  <div class="col-sm-5" id="divradio">
                     <div class="row">
                        <div class="col-12">
                           <div class="card shadow-none">
                              <div class="card-body custom-selection address-content">
                                 <div class="position-relative">
                                    <label class="check-box">
                                       <input type="radio" class="form-check-input" id="radio_l" name="tipolec[]" required value="1">
                                       <span class="radiomark outline-secondary position-absolute"></span>
                                       <span class="ms-4 fs-6">Solo Lectura</span>
                                    </label>
                                 </div>
                                 <div>
                                    <i class="ti ti-pencil-off icon-bg"></i>
                                    <p class="text-muted">
                                       Esta configuraci&oacute;n es de solo lectura. No se admiten modificaciones
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div class="col-12">
                           <div class="card shadow-none">
                              <div class="card-body custom-selection address-content">
                                 <div class="position-relative">
                                    <label class="check-box">
                                       <input type="radio" class="form-check-input" id="radio_le" name="tipolec[]" required value="2">
                                       <span class="radiomark outline-secondary position-absolute"></span>
                                       <span class="ms-4 fs-6">Lectura y Escritura</span>
                                    </label>
                                 </div>
                                 <div>
                                    <i class="ti ti-pencil icon-bg"></i>
                                    <p class="text-muted">
                                       Tiene permisos de edici&oacute;n completos. Puede realizar y guardar cambios
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </form>`;

   if(parseInt(reg.save_config) > 0) {
      botones +=  '<button type="button" class="btn btn-info me-1" btn="btn" id="bt_guardar_rol_priv" onclick="validacionRolPriv()">'+
                  '  <i class="fa-solid fa-floppy-disk me-2"></i>Guardar Configuraci&oacute;n</button>';
   }
   botones +=  '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="recargaPaginadoPrincipal()">'+
               '  <i class="fa-solid fa-xmark me-2"></i>Cerrar</button>';

   modalLG('froles', titulo, html,'formlg_scrollable',botones, 'recargaPaginadoPrincipal()');
   treeMenuRolesPriv(reg.id_rol,'PAINANI');
}
//!
function treeMenuRolesPriv(id_rol,nombre_sistema) {
   let html = '';
   $("#divtree").empty();
   //
   $.ajax({
      method: 'post',
      url: contexto+'Roles/getTreeMenuRolPrivilegio',
      async: true,
      dataType: 'json',
      data: 'id_rol='+id_rol,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled',true);
         $('#overlay').show();
         target = document.getElementById('froles');
         spinner = new Spinner().spin(target);         
      },
      success:function(data) {
         contador = 0;
         tree = new dTree("tree",contexto+"includes/imagenes/","frmRolesPriv");
         tree.closeAll();
         tree.add(0, -1, '<img src="'+contexto+'includes/imagenes/dtree_checkbox/img/globe.gif" /><span class="fw-bold">'+nombre_sistema+'</span>');
         $(data.tree).each(function(i, v) {
            contador++;
            let band = false;
            if(v.activado > 0){ band = true;}
            tree.add(
               v.id_menu,
               v.id_menu_padre,
               '<span style="font-size:0.8rem">'+v.nombre_menu+'</span>',
               'javascript:void(0)',"","","","",false,
               band,
               false
            );
            
            if(data.datale != null){
               if(parseInt(data.datale.solo_lectura) > 0) {
                  $('#radio_l').prop('checked', true);
               }
               if(parseInt(data.datale.lectura_escritura) > 0) {
                  $('#radio_le').prop('checked', true);
               }
            }
         });
         if(contador > 0) {
            html += tree;
         }
         else {
            $('#divradio').hide();
            $('#bt_guardar_rol_priv').hide();
            $('#divmsg').removeClass("col-sm-8").addClass('col-sm-12');
            html +=  '<div class="light-border-warning text-center" role="alert" style="font-size:1.1rem">'+
                     '<i class="fas fa-exclamation-triangle fa-lg"></i>&nbsp;'+
                     'Sin datos para mostrar de plataforma <br><span class="p-font-weight">'+nombre_sistema+'</span></div>';
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
         spinner.stop();
         $("#overlay").hide();
      }
   });
}
//! función de validación configuracion del rol
function validacionRolPriv() {
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal-rp');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
      }
      form.classList.add('was-validated');
   });
   
   confirmarcionConfigRolPrivilegios();
}
//! función de validación de selección de check - menu
function validCheckRol() {
   let msj = "";
   let contador = 0;
   let contador2 = 0;

   $('#frmRolesPriv input[type=checkbox]').each(function() {
      if(this.checked) {
         contador++;
      }
   });

   $('#frmRolesPriv input[type=radio]').each(function() {
      if(this.checked) {
         contador2++;
      }
   });

   if(contador2 === 0) {
        msj += "<li>Selecionar lectura o lectura y escritura</li>";
   }

   if(contador === 0) {
      msj += '<li>Seleccionar una opci&oacute;n del men&uacute;</li>';
   }
   
   return msj;
}
//! función de confirmación de guardar privilegios
function confirmarcionConfigRolPrivilegios() {
   let msg = validCheckRol();
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
            guardarConfiguracioRolPrivilegios();
         }
      });
   }
}
//! función de guardar privilegios
function guardarConfiguracioRolPrivilegios() {
   $.ajax({
      type: 'post',
      url: contexto+'Roles/guardaConfigRolesPrivilegios',
      async: true,
      dataType:"json",
      data: $("#frmRolesPriv").serialize(),
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', false);
         $("#overlay").show();
         $("#bt_guardar_rol_priv").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Guardar Configuraci&oacute;n');
         target = document.getElementById('froles');
         spinner = new Spinner().spin(target);
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
                  recargaPaginadoPrincipal();
                  closeModalLG();
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
         $("#bt_guardar_rol_priv").html('<i class="fa-solid fa-floppy-disk me-2"></i>Guardar Configuraci&oacute;n');
         spinner.stop();
         $("#overlay").hide();
      }
   });
}