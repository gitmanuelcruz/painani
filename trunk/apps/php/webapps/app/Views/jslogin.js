let contador = 0;
$(document).ready(function () {
   $("#show_hide_password a").on('click', function (event) {
      event.preventDefault();
      if ($("#show_hide_password input").attr('type') == 'text') {
         $("#show_hide_password input").attr('type', 'password');
         $("#show_hide_password i").addClass('bx-hide');
         $("#show_hide_password i").removeClass('bx-show');
      }
      else if ($("#show_hide_password input").attr('type') == 'password') {
         $("#show_hide_password input").attr('type', 'text');
         $("#show_hide_password i").removeClass('bx-hide');
         $("#show_hide_password i").addClass('bx-show');
      }
   });
   //
   $('#btn_login').on('click', function (event) {
      validate(event);
   });

   $("#usuario").focus();
});
//!
function keyLogin(event) {
   let tecla = (event.all) ? event.keyCode : event.which;
   if (tecla == 13) {
      validate(event);
      return false;
   }
   else {
      return true;
   }
}
//!
function validate(event) {
   event.preventDefault();
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación de Bootstrap personalizados
   let forms = document.querySelectorAll('.app-form');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
      }
      form.classList.add('was-validated');
   });
   
   if (parseInt(contador) == 0) {
     grecaptcha.execute();
   }
}

function login() {
   const user = $("#usuario").val();
   const contrasenia = $("#password").val();
   let formData = new FormData();
   formData.append("usuario", $('#usuario').val());
   formData.append("password", $.md5(contrasenia));
   $.ajax({
      type: 'post',
      url: 'WLogin/autenticarUser',
      async: true,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: formData,
      beforeSend(xhr) {
         $(".inptlogin").prop('disabled', true);
         $('button[btn="btn"]').prop('disabled', true);
         $("#btn_login").html('<i class="fa-solid fa-circle-notch me-2 fa-spin"></i>Iniciar Sesi&oacute;n');
      },
      success: function (data) {
         if (data.band) {
            localStorage.setItem('socket_user_id', $('#usuario').val());

            contador++;
            $("#usuario_t").val(user);
            $("#contador").val(contador);
            document.forms["frmlt"].action = "WLogin/getSessionUsuario";
            document.forms["frmlt"].target = "_parent";
            document.forms["frmlt"].submit();
         }
         else {
            contador++;
            $('button[btn="btn"]').prop('disabled', false);
            $(".inptlogin").prop('disabled', false);
            Swal.fire({
               title: data.title,
               html: '<p class="p-font-msg-1-2">'+data.message+'</p>',
               icon: 'warning',
               showConfirmButton: false,
               showDenyButton: true,
               denyButtonText: 'Aceptar'
            });
         }
      },
      error: function (xhr, ajaxOptions, thrownError) {
         contador++;
         $('button[btn="btn"]').prop('disabled', false);
         $(".inptlogin").prop('disabled', false);
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
         $("#btn_login").html('Iniciar Sesi&oacute;n');
      }
   });
}
// TODO: Función de generación de nueva contraseña
function generarNuevoPassword() {
   $.ajax({
      type: 'post',
      url: 'WLogin/generarNuevaPassword',
      async: true,
      processData: false,
      contentType: false,
      dataType: "JSON",
      data: new FormData($("#frmGNP")[0]),
      beforeSend(xhr) {
         $(".inptlogin").prop('readonly', false);
         $('button[btn="btn"]').prop('disabled', true);
         $('#btn_recovery').html('<i class="fa-solid fa-circle-notch fa-spin"></i> Enviar');
      },
      success: function (data) {
         if (data.respuesta) {
            Swal.fire({
               title: '¡ P r o c e s o &nbsp;&nbsp; E x i t o s o !',
               html: '<p class="p-font-msg-1-2">'+data.mensaje+'</p>',
               icon: 'success',
               showCancelButton: false,
               allowOutsideClick: false,
               allowEscapeKey: false,
               allowEnterKey: false,
               confirmButtonColor: '#3085d6',
               confirmButtonText: 'Aceptar',
            }).then((result) => {
               if (result.isConfirmed) {
                  $("#frmGNP").removeClass("form-horizontal mt-4 pt-4 frm-Recovery was-validated").addClass('form-horizontal mt-4 pt-4 frm-Recovery');
                  $('#usuario_rest').val('');
                  $('#email_rest').val('');
                  $("#loginform").fadeIn();
                  $("#recoverform").hide();
               }
            });
         }
         else {
            Swal.fire({
               title: 'Validación',
               html: '<p class="p-font-msg-1-2 text-dark">'+data.mensaje+'</p>',
               icon: 'warning',
               showDenyButton: true,
               showConfirmButton: false,
               denyButtonText: "Aceptar"
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
         $(".inptlogin").prop('readonly', false);
         $('button[btn="btn"]').prop('disabled', false);
         $('#btn_recovery').html('Enviar');
      }
   });
}
//!
function nobackbutton() {
   window.location.hash = "no-back-button";
   window.location.hash = "Again-No-back-button"; //chrome
   window.onhashchange = function () { window.location.hash = "no-back-button"; }
}