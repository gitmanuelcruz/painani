let table = new MTable();
let tableRolesDisponible = new MTable();
let tableRolesAsignados = new MTable();
let tablePrivilegiosUser = new MTable();
let tableAdminRecursosDisponible = new MTable();
let tableAdminRecursosAsignados = new MTable();
let tableRecursosDisponible = new MTable();
let tableRecursosAsignados = new MTable();

$(document).ready(function () {
   getUsuarios();

   $("#btnBuscar").on("click", function () {
      getUsuarios();
   });

   $("#btnNuevo").on("click", function () {
      ventanaNuevo('', 'Registro de Usuario', 'N');
   });

   $("#usuario_name").keypress(function (e) {
      keyEvent(e);
   });
});

function getUsuarios() {
   table.setTablaHTML("tblUsuarios");
   table.setUrl(contexto+"Usuarios/getUsuarios");
   table.setRegistrosPagina(10);
   table.setColumnas("usuario,nombre_completo,nombre_nivel_usuario,fecha_vigencia,estatus,desc_usuario_bloqueado,usuario");
   table.setColTipos("text,text,text,text,text,text,dropdown");
   table.setAlineacion("left,left,left,center,center,center,center");
   let atributos = {
      "tr":{
         opciones:[
            { "campo_bd": "usuario_bloqueado", "valor_campo":"1", "atributo": "font-weight:500; color:#ea4335"},
            { "campo_bd": "vigencia_fecha", "valor_campo":"0", "atributo": "font-weight:500; color:#ea4335"}
         ]
      }
   }
   let dropdown = {
      "col7": {
         "opciones": [
            {"etiqueta":"", "titulo": "Opciones del Usuario", "icono": "fa-solid fa-list-ul fa-lg", "tooltip": "Lista de opciones", "tipoicono": "i",
               "menu":[
                  { "campo_bd": "detalle", "valor_campo": "1", "callback": "detalleUser","icono": "fa-solid fa-circle-info fa-lg", "etiqueta": "Detalle Usuario", "tipoicono": "i", "color": "color_blue" },
                  { "campo_bd": "bloqueo", "valor_campo": "0", "icono": "fa-solid fa-circle-xmark fa-lg", "callback": "bloquearUser", "etiqueta": "Bloquear Usuario", "tipoicono": "i", "color": "color_red" },
                  { "campo_bd": "bloqueo", "valor_campo": "1", "icono": "fa-solid fa-circle-check fa-lg", "callback": "bloquearUser", "etiqueta": "Desbloquear Usuario", "tipoicono": "i", "color": "color_green" },
                  { "campo_bd": "roles", "valor_campo": "1", "icono": "fa-solid fa-gear fa-lg", "callback": "rolesUser", "etiqueta": "Asignar Roles", "tipoicono": "i", "color": "color_green" },
                  { "campo_bd": "roles", "valor_campo": "2", "icono": "fa-solid fa-gear fa-lg", "callback": "rolesUser", "etiqueta": "Asignar Roles", "tipoicono": "i", "color": "color_black" },
                  { "campo_bd": "privilegios", "valor_campo": "1", "icono": "fa-solid fa-list-check fa-lg", "callback": "privilegiosUser", "etiqueta": "Asignar Privilegios", "tipoicono": "i", "color": "color_green" },
                  { "campo_bd": "privilegios", "valor_campo": "2", "icono": "fa-solid fa-list-check fa-lg", "callback": "privilegiosUser", "etiqueta": "Asignar Privilegios", "tipoicono": "i", "color": "color_black" },
                  { "campo_bd": "recursos", "valor_campo": "1", "icono": "fa-solid fa-user-gear fa-lg", "callback": "recursosUser", "etiqueta": "Asignar Recurso", "tipoicono": "i", "color": "color_green" },
                  { "campo_bd": "recursos", "valor_campo": "2", "icono": "fa-solid fa-user-gear fa-lg", "callback": "recursosUser", "etiqueta": "Asignar Recurso", "tipoicono": "i", "color": "color_black" },
                  { "campo_bd": "edicion", "valor_campo": "1", "icono": "fa-solid fa-pen-to-square fa-lg", "callback": "editarUser", "etiqueta": "Editar Usuario", "tipoicono": "i", "color": "color_black" }
               ]
            }
         ]
      }
   }
   table.setAtributos(atributos);
   table.setDropDown(dropdown);
   table.fontSize = "0.8rem";
   table.parametros = $("#fusuario").serialize();
   table.loadJSON();
}

function recargaPaginadoPrincipal() {
   table.parametros = $("#fusuario").serialize();
   table.loadJSON(table.pagina);
}
//!
function editarUser(reg) {
   ventanaNuevo(reg.usuario, 'Edici&oacute;n del Usuario', 'E');
   $("#vm_usuario").val(reg.usuario);
   $("#vm_usuario").prop("disabled", true);
   $("#vm_nombre").val(reg.nombre_completo);
   $("#vm_fecha_vig_inicio").val(reg.fvigencia_inicio);
   validRangoFechaVigencia();
   $("#vm_fecha_vig_termino").val(reg.fvigencia_fin);
   $("#vm_correo_electronico").val(reg.correo_electronico);
   $("#vm_tel_movil").val(reg.num_celular);
   $("#vm_tel_fijo").val(reg.num_telefono_fijo);
   cargaCombos(true,reg.id_genero,reg.id_nivel_usuario,reg.es_notificador,reg.theme_css,reg.id_idioma);
}
//!
function validCombos(id,id2) {
	let valid = $("#vm_contador_valid").val();
	if(parseInt(valid) > 0) {
		if($("#"+id+"").val() == '') {
			$("#"+id2+"").removeClass('has-valid').addClass('has-error');
		}
		else {
			$("#"+id2+"").removeClass('has-error').addClass('has-valid');
		}
	}
}
// TODO:
function bloquearUser(reg) {
   let titulo = "Confirma <b>BLOQUEAR</b> al usuario <span class='fw-bold'>"+reg.usuario+"</span>";
   let status = 1;
   if (parseInt(reg.usuario_bloqueado) > 0) {
      titulo = "Confirma <b>DESBLOQUEAR</b> al usuario <span class='fw-bold'>"+reg.usuario+"</span>";
      status = 0;
   }

   Swal.fire({
      title: 'Confirmaci&oacute;n',
      html: '<p class="p-font-msg-1-2 text-dark">\u{BF}'+titulo+'?</p>',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, confirmar',
   }).then((result) => {
      if (result.isConfirmed) {
         bloquearUsuario(reg.usuario,status);
      }
   });
}

function bloquearUsuario(usuario,status) {
   let formData = new FormData();
   formData.append("usuario", usuario);
   formData.append("bloqueo", status);
   $.ajax({
      type: 'post',
      url: contexto+'Usuarios/bloquearUser',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: formData,
      beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $('#overlayprincipal').show();
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
               denyButtonText: "Aceptar",
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
                  if(parseInt(status) > 0) {
                     socket.emit("close-session", {
                        "userBloqueado" : usuario, 
                        "refresh": "exitSession"
                     });
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
            denyButtonText: 'Aceptar'
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         spinner.stop();
         $("#overlay").hide();
      }
   });
}
//! funcrión de asigna o administra recurso usuarios
function recursosUser(reg) {
   contadorRec = '';
   if (parseInt(reg.recursos_admin) > 0) {
      Swal.fire({
         title: 'Confirmaci&oacute;n',
         html: '<p class="p-font-msg-1-2 text-dark">\u{BF}Que recurso desea registrar al usuario <span class="fw-bold">'+reg.usuario+'</span>?</p>',
         icon: 'warning',
         showCancelButton: true,
         showDenyButton: true,
         cancelButtonText: 'Cancelar',
         cancelButtonColor: '#d33',
         denyButtonColor: '#3085d6',
         denyButtonText: 'Administrar Recurso',
         confirmButtonColor: '#3085d6',
         confirmButtonText: 'Asignar Recurso',
      }).then((result) => {
         if (result.isConfirmed) {
            asignarRecurso(reg);
         }
         if (result.isDenied) {
            adminRecurso(reg);
         }
      });
   }
   else {
      asignarRecurso(reg);
   }
}
//!
function keyEvent(event) {
   let tecla = (event.all) ? event.keyCode : event.which;
   if (tecla == 13) {
      getUsuarios();
   }
   else {
      return false;
   }
}