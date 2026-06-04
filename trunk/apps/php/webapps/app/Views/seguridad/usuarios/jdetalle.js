function detalleUser(reg) {
   let botones = '';
   let html = '';
   const titulo = 'Datos Generales del Usuario';
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/datosUsuario',
      async: true,
      dataType: 'json',
      data: 'usuario='+reg.usuario,
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         targetPrincipal = document.getElementById('fusuario');
         spinnerPrincipal = new Spinner().spin(targetPrincipal);
      },
      success: function (data) {
         let color_estatus = (data.duser.estatus.toUpperCase() == 'ACTIVO') ? '#66bb6a':'#ea4335';
         let color_bloqueo = (parseInt(data.duser.usuario_bloqueado) > 0) ? '#ea4335':'';
         let img_user = '';
         if(parseInt(data.existeFoto) == 0) {
            if (data.duser.codigo_genero == 'F') {
               img_user = contexto+'includes/imagenes/avatars/avatarF.jpg';
            }
            else  if (data.duser.codigo_genero == 'M') {
               img_user = contexto+'includes/imagenes/avatars/avatarM.jpg';
            }
            else {
               img_user = contexto+'includes/imagenes/avatars/avatar_desconocidos.jpg';
            }
         }
         else {
            img_user = contexto+data.duser.path_foto;
         }
         let nombreGenero = (parseNull(data.duser.nombre_genero) == '') ? '-':data.duser.nombre_genero;
         html +=  `<div class="row">
                     <div class="col-sm-5 text-center">
                        <div class="card bg-light-light">
                           <div class="card-body">
                              <div class="profile-container">
                                 <div class="image-details">
                                    <img class="rounded-circle" src="${img_user}" width="200"/>
                                 </div>
                                 <div class="person-details">
                                    <h6 class="f-w-600">${data.duser.nombre_completo}</h6>
                                    <p class="fw-bold text-dark">${data.duser.usuario}</p>
                                    <div class="details">
                                       <div>
                                          <h4 style="color:${color_estatus}">${data.duser.estatus}</h4>
                                          <p class="text-secondary">Vigencia</p>
                                       </div>
                                       <div>
                                          <h4 style="color:${color_bloqueo}">${data.duser.desc_usuario_bloqueado}</h4>
                                          <p class="text-secondary">Bloqueado</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="col-sm-7 overflow-auto" style="max-height:450px">
                        <div class="card bg-light-light">
                           <div class="card-body">
                              <ul class="notified-contet share-menu-list">
                                 <li>
                                    <div class="share-menu-item mb-2">
                                       <span class="share-menu-img text-outline-primary h-45 w-45 d-flex-center b-r-10">
                                          <i class="fa-solid fa-sitemap f-s-30"></i>
                                       </span>
                                       <div class="share-menu-content">
                                          <h6 class="mb-0 txt-ellipsis-1">${data.duser.nombre_nivel_usuario}</h6>
                                          <p class="mb-0 txt-ellipsis-1 text-secondary">Nivel de Usuario</p>
                                       </div>
                                    </div>
                                 </li>
                                 <li>
                                    <div class="share-menu-item mb-2">
                                       <span class="share-menu-img text-outline-primary h-45 w-45 d-flex-center b-r-10">
                                          <i class="fa-solid fa-venus-mars f-s-30"></i>
                                       </span>
                                       <div class="share-menu-content">
                                          <h6 class="mb-0 txt-ellipsis-1">${nombreGenero}</h6>
                                          <p class="mb-0 txt-ellipsis-1 text-secondary">Genero</p>
                                       </div>
                                    </div>
                                 </li>`;
         if(parseInt(data.duser.es_notificador) > 0) {
            html +=  `<li>
                        <div class="share-menu-item mb-2">
                           <span class="share-menu-img text-outline-primary h-45 w-45 d-flex-center b-r-10">
                              <i class="fa-solid fa-person-chalkboard f-s-30"></i>
                           </span>
                           <div class="share-menu-content">
                              <h6 class="mb-0 txt-ellipsis-1">${parseNull(data.duser.desc_es_notificador)}</h6>
                              <p class="mb-0 txt-ellipsis-1 text-secondary">Es Notificador</p>
                           </div>
                        </div>
                     </li>`;
         }
         let email = (parseNull(data.duser.correo_electronico) == '') ? '-':data.duser.correo_electronico;
         let celular = (parseNull(data.duser.num_celular) == '') ? '-':data.duser.num_celular;
         let telFijo = (parseNull(data.duser.num_telefono_fijo) == '') ? '-':data.duser.num_telefono_fijo;
         html +=  `              <li>
                                    <div class="share-menu-item mb-2">
                                       <span class="share-menu-img text-outline-primary h-45 w-45 d-flex-center b-r-10">
                                          <i class="fa-solid fa-calendar-days f-s-30"></i>
                                       </span>
                                       <div class="share-menu-content">
                                          <h6 class="mb-0 txt-ellipsis-1">${data.duser.fecha_vigencia}</h6>
                                          <p class="mb-0 txt-ellipsis-1 text-secondary">Fecha Vigencia</p>
                                       </div>
                                    </div>
                                 </li>
                                 <li>
                                    <div class="share-menu-item mb-2">
                                       <span class="share-menu-img text-outline-primary h-45 w-45 d-flex-center b-r-10">
                                          <i class="fa-solid fa-envelope f-s-30"></i>
                                       </span>
                                       <div class="share-menu-content">
                                          <h6 class="mb-0 txt-ellipsis-1">${email}</h6>
                                          <p class="mb-0 txt-ellipsis-1 text-secondary">Correo Electr&oacute;nico</p>
                                       </div>
                                    </div>
                                 </li>
                                 <li>
                                    <div class="share-menu-item mb-2">
                                       <span class="share-menu-img text-outline-primary h-45 w-45 d-flex-center b-r-10">
                                          <i class="fa-solid fa-mobile-screen-button f-s-30"></i>
                                       </span>
                                       <div class="share-menu-content">
                                          <h6 class="mb-0 txt-ellipsis-1">${celular}</h6>
                                          <p class="mb-0 txt-ellipsis-1 text-secondary">Tel&eacute;fono M&oacute;vil</p>
                                       </div>
                                    </div>
                                 </li>
                                 <li>
                                    <div class="share-menu-item mb-2">
                                       <span class="share-menu-img text-outline-primary h-45 w-45 d-flex-center b-r-10">
                                          <i class="fa-solid fa-phone f-s-30"></i>
                                       </span>
                                       <div class="share-menu-content">
                                          <h6 class="mb-0 txt-ellipsis-1">${telFijo}</h6>
                                          <p class="mb-0 txt-ellipsis-1 text-secondary">Tel&eacute;fono Fijo</p>
                                       </div>
                                    </div>
                                 </li>
                              </ul>    
                           </div>
                        </div>
                     </div>
                  </div>`;
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         $("#overlayprincipal").hide();
         spinnerPrincipal.stop();
         botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn">
                        <i class="fa-solid fa-xmark me-2"></i>Cerrar
                     </button>`;
         modalLG('fusuario', titulo, html, 'formlg_scrollable', botones, null);
      }
   });
}