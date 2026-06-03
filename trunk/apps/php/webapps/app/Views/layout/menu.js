let contexto = '';
let contextoInfo = '';
let targetPrincipal,spinnerPrincipal;
$(document).ready(function() {
	contexto = $("#context").val();
	contextoInfo = $("#contextInfo").val();
	loadMenu();
   nobackbutton();
   $("#btn_ver_perfil").on('click', function (event) {
      let reg = {
         'usuario':$("#userIdSession").val()
      }
      detalleUser(reg);
   });

   $("#btn_cambio_pass").on('click', function (event) {
      cambioPassword();
   });

   $("#btn_sing_up,#btn_cerrar_sesion").on('click', function (event) {
      logout();
   });
});
//!
socket.on("exitSession",async(data) => {
   if(data.userBloqueado == $("#userIdSession").val()) {
      logout();
   }
});
//!
function loadMenu(){
   let vmenu = '';
   let menu = '';
	$.ajax({
		type: 'post',
		url: contexto+'Home/getMenu',
      async: true,
		dataType: 'html',
		success:  function (response) {
         vmenu = `<li class="menu-title"><span>Componentes</span></li>`;
         menu = response;
		},
      complete(xhr, status) {
         $("#vmenu").html(vmenu+menu);
         minimizarMenu();
      }
	});
}
//!
function minimizarMenu() {
   var closeCollaps = document.querySelectorAll('.main-nav li a[colapsar="colapsar"]');
   closeCollaps.forEach(function (element) {
      element.addEventListener('click', function () {
         var parent = element.closest('.qwery');
         var all = document.querySelectorAll('.qwery');
         all.forEach(function (e) {
            if (e != parent) {
               e.classList.remove('show');
               var ariaexpand = e.previousElementSibling;
               if (ariaexpand) ariaexpand.setAttribute('aria-expanded', 'false');
            }
         });
         parent?.classList.add('show');
         var ariaexpand = element;
         if (ariaexpand) ariaexpand.setAttribute('aria-expanded', 'true');
      });
   });
}
// TODO: Proceso de cambio de contrasenia
const cambioPassword = () => {
   let html = '';
   let botones = '';
	let titulo = 'Cambio de Contrase&ntilde;a';
   //
   html +=  `<form method="post" class="frm-modal-password" id="frmodalpass" name="frmodalpass" novalidate onsubmit="return false">
               <div class="row app-form">
            	   <div class="col-sm-12">
            		   <div class="card-body">
                    	   <p class="lead text-center text-primary fw-bold">Est&aacute; a solo un paso de su nueva contrase&ntilde;a</p>
							   <hr style="margin-top:0">
                        <div class="row">
                    	      <div class="col-sm-12">
				        		      <label class="form-label">Nueva Contrase&ntilde;a</label>
                              <div class="input-group">
                                 <input type="password" class="form-control" id="passnvo" name="passnvo" maxlength="20" required>
                                 <button type="button" class="btn btn-info tooltip_icon_cpassword" data-bs-toggle="tooltip" data-bs-html="true"
                                    data-bs-placement="top" data-bs-title="Ver Contrase&ntilde;a" onclick="viewPass(1)">
                                    <i class="fa-solid fa-eye-slash" id="npass"></i>
                                 </button>
                                 <div class="invalid-feedback">Nueva contrase&ntilde;a requerido</div>
                              </div>
                           </div>
                    	   </div>
                        <div class="row">
                           <div class="col-sm-12">
                              <label class="form-label">Confirmar Nueva Contrase&ntilde;a</label>
                              <div class="input-group">
                                 <input type="password" class="form-control" id="passconfnvo" name="passconfnvo" maxlength="20" required>
                                 <button type="button" class="btn btn-info tooltip_icon_cpassword" data-bs-toggle="tooltip" data-bs-html="true"
                                    data-bs-placement="top" data-bs-title="Ver Contrase&ntilde;a" onclick="viewPass(2)">
                                    <i class="fa-solid fa-eye-slash" id="cnpass"></i>
                                 </button>
                                 <div class="invalid-feedback">Confirmar nueva contrase&ntilde;a requerido</div>
                              </div>
                           </div>
                        </div>
            		   </div>
            	   </div>
               </div>
            </form>`;

   botones +=  `<button type="button" class="btn btn-primary me-1" btn="btn" id="bt_guardar_cam_pass">
                  <i class="fa-solid fa-floppy-disk me-2"></i>Guardar
               </button>`;
   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;

   modal('frmprincipal', titulo, html, 'formdefault', botones, null);
	$(".tooltip_icon_cpassword").tooltip();
   //
   $("#bt_guardar_cam_pass").on('click', function() {
      validacionCambioPass();
   });
}
//!
let cpass = 0;
let ccpass = 0;
const viewPass = (tipo) => {
	$('.tooltip_icon_cpassword').tooltip('hide');
	if(parseInt(tipo) === 1) {
		if(parseInt(cpass) === 0) {
			cpass = 1;
			$("#passnvo").attr('type', 'text');
			$("#npass").removeClass('fa-solid fa-eye-slash').addClass('fa-solid fa-eye');
		}
		else {
			cpass = 0;
			$("#passnvo").attr('type', 'password');
			$("#npass").removeClass('fa-solid fa-eye').addClass('fa-solid fa-eye-slash');
		}
	}
	else if(parseInt(tipo) == 2) {
		if(parseInt(ccpass) == 0) {
			ccpass = 1;
			$("#passconfnvo").attr('type', 'text');
			$("#cnpass").removeClass('fa-solid fa-eye-slash').addClass('fa-solid fa-eye');
		}
		else {
			ccpass = 0;
			$("#passconfnvo").attr('type', 'password');
			$("#cnpass").removeClass('fa-solid fa-eye').addClass('fa-solid fa-eye-slash');
		}
	}
}
//!
const validacionCambioPass = () => {
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal-password');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
      .forEach(function (form) {
         if (!form.checkValidity()) {
            contador++;
         }
         form.classList.add('was-validated');
      });

   if (contador === 0) {
      confirmacionPass();
   }
}
//!
const validacion_cambio_pass = () => {
   let msg = "";
   if (($("#passnvo").val() != '' && $("#passconfnvo").val() != '') && ($("#passnvo").val() != $("#passconfnvo").val())) {
      msg += "<li>Las contrase&ntilde;as nueva no coinciden con la confirmaci&oacute;n</li>";
   }

   return msg;
}
//!
const confirmacionPass = () => {
   let validacion = validacion_cambio_pass();
   if (validacion.length > 0) {
      Swal.fire({
         title: 'Dato Requerido',
         html: "<ul class='p-font-msg-1-2 text-dark'>"+validacion+"</ul>",
         icon: 'warning',
         showDenyButton: true,
         denyButtonText: "aceptar",
         showConfirmButton: false
      });
   }
   else {
      Swal.fire({
         title: 'Confirmaci&oacute;n',
         html: '<p class="p-font-msg-1-2 text-dark">\u{BF}Confirma aplicar el cambio de Contrase&ntilde;a?</p>',
         icon: 'warning',
         showCancelButton: true,
         cancelButtonText: 'Cancelar',
         confirmButtonText: 'Si, confirmar',
      }).then((result) => {
         if (result.isConfirmed) {
            guardarCambioPass();
         }
      });
   }
}
//!
const guardarCambioPass = () => {
   let pass = $("#passnvo").val();
   let formData = new FormData();
   formData.append("id_usuario", $("#userIdSession").val());
   formData.append("password", $.md5(pass));
   $.ajax({
      type: 'post',
      url: contexto+'Home/actualizarPassword',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlayprincipal").show();
         $("#bt_guardar_cam_pass").html('<i class="fa fa-sync fa-spin me-2"></i>Guardar Cambio');
         targetPrincipal = document.getElementById('frmprincipal');
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
               confirmButtonText: 'Aceptar',
            }).then((result) => {
               if (result.isConfirmed) {
                  closeModal();
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
         $("#bt_guardar_cam_pass").html('<i class="fa-solid fa-floppy-disk me-2"></i>Guardar Cambio');
         spinnerPrincipal.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
const logout = () => {
   document.forms['frmprincipal'].action = contexto+'Home/logout';
   document.forms['frmprincipal'].target = '_parent';
   document.forms['frmprincipal'].submit();
}
//!
function nobackbutton() {
   window.location.hash = "no-back-button";
   window.location.hash = "Again-No-back-button"; //chrome
   window.onhashchange = function () { window.location.hash = "no-back-button"; }
}