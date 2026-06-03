$.notifyDefaults({
   placement: {
      from: "bottom",
      align: "right"
   },
   animate:{
      enter: 'animated bounceIn',
      exit: 'animated bounceOut'
   },
   delay: 6000
});
let tableNotifications = new MTable();
socket.emit("get-notificaciones",{"mensaje":"Obtiene notificaciones","usuario":$("#userIdSession").val()});
socket.on("mis-notificaciones", async(data) => {
   let base = $("#context").val();
   if(data.para === $("#userIdSession").val()) {
      $("#notificationContentHTML").empty();
      if(data.notificaciones.length === 0) {
         $("#bellAlert").removeClass('heartbit').addClass('badge');
         $("#bellNotifications").hide();
      }
      else{
         $("#bellAlert").removeClass('badge').addClass('heartbit');
         $("#bellNotifications").show();
      }

      $.each(data.notificaciones, function(index,item) {
         let img_user = '';
         if(item.fotoUserDe !== "" && item.fotoUserDe !== null && item.fotoUserDe !== undefined) {
            let validUrl = validURL(base+'/'+item.fotoUserDe);
            if(!validUrl) {
               if (item.generoUserDe === 'M') {
                  img_user = base+'/includes/imagenes/avatarM.jpg';
               }
               else if (item.generoUserDe === 'F') {
                  img_user = base+'/includes/imagenes/avatarF.jpg';
               }
               else {
                  img_user = base+'/includes/imagenes/avatarO.jpg';
               }
            }
            else {
               img_user = base+'/'+item.fotoUserDe;
            }
         }
         else {
            if (item.generoUserDe === 'M') {
               img_user = base+'/includes/imagenes/avatarM.jpg';
            }
            else if (item.generoUserDe === 'F') {
               img_user = base+'/includes/imagenes/avatarF.jpg';
            }
            else {
               img_user = base+'/includes/imagenes/avatarO.jpg';
            }
         }
         
         let mensaje =  "<a href='javascript:void(0)' class='message-item d-flex align-items-center border-bottom px-3 py-2' onclick='verNotificacion("+item.idNotificacion+",0)'>"+
                        "  <span class='user-img position-relative d-inline-block'>"+
                        "     <img src='"+img_user+"' class='rounded-circle w-100'/>"+
                        "  </span>"+
                        "  <div class='w-75 d-inline-block v-middle ps-3'>"+
                        "     <h5 class='message-title mb-0 mt-1 fs-3 fw-bold'>"+item.nombreDe+"</h5>"+
                        "     <span class='fs-2 text-nowrap d-block time text-truncate fw-normal text-muted mt-1'>"+item.mensaje+"</span>"+
                        "     <span class='fs-2 text-nowrap d-block subtext text-muted'>"+item.fecha+"</span>"+
                        "  </div>"+
                        "</a>";

         $("#notificationContentHTML").append(mensaje);
      });
   }
});
//!
socket.on("notificacion-privada", async(data) => {
   if(data.para === $("#userIdSession").val()) {
      let vicon = 'fa-solid fa-circle-check';
      if(data.icono === 'warning') {
         vicon = 'fa-solid fa-triangle-exclamation';
      }
      else if(data.icono === 'error') {
         vicon = 'fa-solid fa-circle-xmark';
      }
      $.notify({
         icon: vicon,
         title: '<strong>'+data.nombreDe+'</strong>',
         message: data.mensaje,
         fechaHora: data.hora
      },{
         type: data.icono
      });

      socket.emit("get-notificaciones",{"mensaje":"Obtiene notificaciones","usuario":$("#userIdSession").val()});
   }
});
//!
function verNotificacion(idNotificacion, param) {
   let html = "";
   let botones = "";
   let formData = new FormData();
   formData.append("idNotificacion", idNotificacion);
   $.ajax({
      type: 'post',
      url: contexto+'/Inicio/leidoNotificacion',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: formData,
      beforeSend(xhr) {
         $('#overlayprincipal').show();
         $('button[btn="btn"]').prop('disabled', true);
         targetp = document.getElementById('frmprincipal');
         spinnerp = new Spinner().spin(targetp);
      },
      success: function (data) {
         if (data.respuesta === false) {
            Swal.fire({
               title: 'HA OCURRIDO UN ERROR!',
               html: '<p class="p-font-msg">'+data.mensaje+'</p>',
               icon: 'error',
               showDenyButton: true,
               denyButtonText: 'Aceptar',
               showConfirmButton: false
            });
         }
         else {
            if(parseInt(param) > 0) {
               $("#overlayprindos").show();
               getNotificacionesAll('');
            }
            let titulo = 'Notificaci&oacute;n de: '+data.notificacion.nombre_completo;
            html +=  '<div class="row mb-2">'+
                     '  <div class="col-sm-12">'+
                     '     <label class="p-font-color_black p-font-msg p-font-weight-500">'+data.notificacion.mensaje+'</label>'+
                     '  </div>'+
                     '</div>';
            botones +=  '<div class="row">'+
                        '  <div class="col-sm-12 text-end">'+
                        '     <figure>'+
                        '        <blockquote class="blockquote">'+
                        '           <p class="p-font-color_black p-font-msg-08 p-font-weight-500 text-end">'+data.notificacion.fecha_reg_not+'</p>'+
                        '        </blockquote>'+
                        '        <figcaption class="blockquote-footer">Fecha de la notificaci&oacute;n</figcaption>'+
                        '     </figure>'+
                        '  </div>'+
                        '</div>';
            modal('frmprincipal', titulo, html, 'formdefault_scrollable_center', botones, 'cerrarfondo2()');
            socket.emit("get-notificaciones",{"mensaje":"Obtiene notificaciones","usuario":$("#userIdSession").val()});
         }
      },
      error: function (xhr, ajaxOptions, thrownError) {
         Swal.fire({
            title: 'HA OCURRIDO UN ERROR!',
            html: '<p class="p-font-msg">'+thrownError+'</p>',
            icon: 'error',
            showDenyButton: true,
            showConfirmButton: false,
            denyButtonText: "Aceptar"
        });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spinnerp.stop();
         $("#overlayprincipal").hide();
      }
   });
}
// TODO: Proceso de lista de notificaciones
function viewAllNotifications(){
   let html = "";
   let botones = "";

   html +=  '<div class="row">'+
            '  <div class="col-md-3">'+
            '     <form method="post" name="frmMisNotif" id="frmMisNotif" onsubmit="return false;">'+
            '        <input type="hidden" id="cnothab" value="0">'+
            '        <div class="row mb-2">'+
            '           <div class="col-sm-12">'+
            '              <div class="form-floating">'+
            '                 <input type="text" class="form-control" id="busqueda_notif" name="busqueda_notif" '+
            '                        placeholder="Buscar" onkeypress="keyEventNotif(event)">'+
            '                 <label><i class="fa-solid fa-magnifying-glass feather-sm text-dark fill-white me-2"></i>'+
            '                       <span class="border-start border-light-secondary ps-3">Buscar</span></label>'+
            '              </div>'+
            '           </div>'+
            '        </div>'+
            '     </form>'+
            '     <hr>'+
            '     <div class="row gap-2">'+
            '        <div class="col-md-12">'+
            '           <button type="button" class="btn btn-secondary w-100 d-flex d-block font-weight-medium" onclick="redactarNotificacion()">'+
            '           Redactar <span class="badge ms-auto"><i class="fa-solid fa-pen fa-lg"></i></span>'+
            '           </button>'+
            '        </div>'+
            '        <div class="col-md-12">'+
            '           <button type="button" class="btn btn-rounded btn-light-info w-100 d-flex d-block text-info font-weight-medium" onclick="rconsultaNotifPag(0,0)">'+
            '           Recibidos <span class="badge ms-auto"><i class="fa-solid fa-inbox fa-lg text-info"></i></span>'+
            '           </button>'+
            '        </div>'+
            '        <div class="col-md-12">'+
            '           <button type="button" class="btn btn-rounded btn-light-secondary w-100 d-flex d-block text-secondary font-weight-medium" onclick="rconsultaNotifPag(1,0)">'+
            '           Leido <span class="badge ms-auto"><i class="fa-solid fa-envelope-open fa-lg text-secondary"></i></span>'+
            '           </button>'+
            '        </div>'+
            '        <div class="col-md-12">'+
            '           <button type="button" class="btn btn-rounded btn-light-danger w-100 d-flex d-block text-danger font-weight-medium" onclick="rconsultaNotifPag(2,0)">'+
            '           No Leido <span class="badge ms-auto"><i class="fa-solid fa-envelope fa-lg text-danger"></i></span>'+
            '           </button>'+
            '        </div>'+
            '        <div class="col-md-12">'+
            '           <button type="button" class="btn btn-rounded btn-light-success w-100 d-flex d-block text-success font-weight-medium" onclick="rconsultaNotifPag(3,1)">'+
            '           Enviados <span class="badge ms-auto"><i class="fa-solid fa-paper-plane fa-lg text-success"></i></span>'+
            '           </button>'+
            '        </div>'+
            '     </div>'+
            '  </div>'+
            '  <div class="col-sm-9 overflow-auto" style="max-height:500px">'+
            '     <div class="table-responsive-sm">'+
            '        <table class="table table-hover" width="100%" id="gridNotificaciones">'+
            '           <thead class="table-secondary">'+
            '              <tr class="p-font-msg-09">'+
            '                 <th width="30%" class="text-start" id="tx_tnotifdepara">De</th>'+
            '                 <th width="50%" class="text-start">Mensaje</th>'+
            '                 <th width="20%" class="text-center">Fecha</th>'+
            '                 <th width="2%" class="text-center"></th>'+
            '              </tr>'+
            '           </thead>'+
            '           <tbody></tbody>'+
            '        </table>'+
            '     </div>'+
            '  </div>'+
            '</div>'+
            '<div id="overlayprindos" class="overlay"></div>';

   botones +=  '<button type="button" class="btn btn-light-danger text-danger font-weight-medium" data-bs-dismiss="modal" onclick="cerrarAllNotificaciones()">'+
               '  <i class="fa-solid fa-xmark"></i>&nbsp;Cerrar</button>';
   modalXL('frmprincipal', 'Mis Notificaciones', html, 'formxl_scrollable', botones, 'cerrarAllNotificaciones()');
   getNotificacionesAll('');
}

function cerrarAllNotificaciones() {
   tableNotifications.barraDibujada = false;
   closeModalXL();
}

function getNotificacionesAll(pleido) {
   const vcnotif = $("#cnothab").val();
   if(parseInt(vcnotif) > 0) {
      $("#tx_tnotifdepara").text('Para');
   }
   else {
      $("#tx_tnotifdepara").text('De');
   }
   let vcolor = '#2d2c2c';
   tableNotifications.setTablaHTML("gridNotificaciones");
   tableNotifications.setUrl(contexto+"/Inicio/getAll");
   tableNotifications.setRegistrosPagina(5);
   tableNotifications.setColumnas("nombre,mensaje,fecha,leido");
   tableNotifications.setColTipos("text,text,text,icon");
   tableNotifications.setAlineacion("left,left,center,center");
   let iconos = {
      "col4": {
         "opciones":[
            { "campo_bd": "leido", "valor_campo": "0", "icono": "fa-solid fa-eye fa-sm", "callback": "leerNotificacion", "tooltip": "Ver notificación", "tipoicono": "i", "color": "color_blue" }
         ]
      }
   }
   
   let atributos = {
      "tr":{
         opciones:[
            { "campo_bd": "leido", "valor_campo":"0", "atributo": "font-weight:600; color:"+vcolor+""}
         ]
      }
   }
   tableNotifications.setIconos(iconos);
   tableNotifications.setAtributos(atributos);
   tableNotifications.fontSize = "0.8rem";
   tableNotifications.parametros = 'busqueda_notif='+$("#busqueda_notif").val()+'&leido='+pleido+'&tipoconsulta='+vcnotif;
   tableNotifications.loadJSON();
}

function leerNotificacion(reg) {
   verNotificacion(reg.id_notificacion, 1);
}

function cerrarfondo2() {
   $("#overlayprindos").hide();
}

function rconsultaNotifPag(param, param2) {
   $("#cnothab").val(param2);
   getNotificacionesAll(param);
}

function keyEventNotif(event) {
   var tecla = (event.all) ? window.event : event.which;
   if (tecla === 13) {
      getNotificacionesAll('');
   }
   else {
      return false;
   }
}

function redactarNotificacion() {
   let html = "";
   let botones = "";
   $("#overlayprindos").show();

   html +=  '<form method="post" class="frm-modal-notif" id="frmRedNotif" name="frmRedNotif" novalidate onsubmit="return false">'+
            '  <input type="hidden" id="vm_contador_valid_notificacion" value="0">';
   html +=  '  <div class="row mb-2">' +
            '     <div class="col-sm-12">' +
            '        <label class="form-label">Para</label>'+
            '			<div class="form-group" id="divUserPara">'+
				'        	<select class="form-control selectpicker" id="vm_id_user_para" name="vm_id_user_para[]" multiple="multiple" required style="width:100%" '+
				'					  	  onchange="validCombos(this.id,'+"'divUserPara'"+')">'+
				'        	</select>'+
				'        	<div class="invalid-feedback">Para requerido</div>'+
				'			</div>'+
            '     </div>'+
            '  </div>';
   html +=  '  <div class="row mb-2">' +
            '     <div class="col-sm-12">' +
            '        <label class="form-label">Mensaje</label>'+
            '        <textarea class="form-control" id="vm_msj_notificacion" name="vm_msj_notificacion" rows="3" maxlength="3000" required></textarea>'+
            '        <div class="invalid-feedback">Mensaje requerido</div>'+
            '     </div>'+
            '  </div>';
   html +=  '</form>';

   botones +=  '<button type="button" id="bt_enviar_notif" class="btn btn-info" btn="btn" onclick="validacionRegNotificacion()">'+
               '  <i class="fa-solid fa-paper-plane me-2"></i>Enviar</button>&nbsp;';
   botones +=  '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="cerrarfondo2()">'+
               '  <i class="fa-solid fa-xmark me-2"></i>Cerrar</button>';
   modalLG('frmprincipal', 'Mensaje Nuevo', html, 'formlg', botones, 'cerrarfondo2()');
   $(".selectpicker").select2({dropdownParent: $("#vModalLG")});
   cargaCombosNotificaciones();
}
//! función de combos de usuario notificaciones
function cargaCombosNotificaciones() {
   $.ajax({
      type: 'post',
      url: contexto+'/Inicio/getDatosUsuariosParaNotif',
      async: true,
      dataType: 'json',
      beforeSend(xhr){
         $('button[btn="btn"]').prop('disabled',true);
         $("#overlayprincipal").show();
         targetp = document.getElementById('frmprincipal');
         spinnerp = new Spinner().spin(targetp);
      },
      success: function (data) {
         $(data).each(function(i, v) {
            $('#vm_id_user_para').append('<option value="'+v.id_usuario+'">'+v.nombre_completo+' - '+v.id_usuario+'</option>');
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spinnerp.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//! función de validación formulario registro de notificacion
function validacionRegNotificacion() {
   $("#vm_contador_valid_notificacion").val(1);
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal-notif');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
         if($("#vm_id_user_para").val() === "") {
				$("#divUserPara").removeClass("has-valid");
				$("#divUserPara").addClass("has-error");
			}
			else {
				$("#divUserPara").addClass("has-valid");
			}
      }
      form.classList.add('was-validated');
   });
   
   if(contador === 0) {
      $("#divUserPara").addClass("has-valid");
      confirmarcionRegNotificacion();
   }
}

//! función de confirmación de registro de notifiacion
function confirmarcionRegNotificacion() {
   Swal.fire({
      title: 'Confirmaci&oacute;n',
      html: '<p class="p-font-msg-1-2">\u{BF}Confirma que los datos son correctos?</p>',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, confirmar',
   }).then((result) => {
      if (result.isConfirmed) {
         $('#bt_enviar_notif').html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Enviar');
         $('button[btn="btn"]').prop('disabled', true);
         guardarNotificacion();
      }
   });
}
//! función de guardar notificacion
function guardarNotificacion() {
   socket.emit("registro_notificacion", {
      "mensaje": $("#vm_msj_notificacion").val(),
      "usuario": $("#userIdSession").val(),
      "icono": "success",
      "sendUser": $("#vm_id_user_para").val(),
      "refresh": 'aviso_send_notificacion'
   });
   cerrarfondo2();
   closeModalLG();
}

socket.on('aviso_send_notificacion', async(data) => {
   const cactual = $("#cnothab").val();
   rconsultaNotifPag(0,cactual);
});