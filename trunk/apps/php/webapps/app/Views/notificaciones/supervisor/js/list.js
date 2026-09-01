let table = new MTable();
let tblHistorial = new MTable();
const nameController = 'NotificacionesSupervisor';
const Toast = Swal.mixin({
   toast: true,
   position: 'top-right',
   customClass: {
      popup: 'colored-toast'
   },
   showConfirmButton: false,
   timer: 1500,
   timerProgressBar: true
});

$(document).ready(function() {
	$(".preloader").fadeOut();
	loadNotificacionesPag();

	$("#btnBuscar").on("click", function () {
		loadNotificacionesPag();
	});

   $("#fecha_inicio").on("change", function () {
		validFechaSearch();
	});

	$("#num_orden").keypress(function (e) {
      keyEvent(e);
   });
});

const loadNotificacionesPag = () => {
	table.setTablaHTML("gridNotificaciones");
	table.setUrl(contexto+nameController+"/notificacionesPag");
	table.setRegistrosPagina(10);
	table.setColumnas("desc_num_oficio,desc_fofico,domicilio,referencia_ubicacion,nombre_verificacion,total_asignacion,desc_estatus,band");
	table.setColTipos("textHTML,textHTML,text,text,text,numeroSD,textHTML,dropdown");
	table.setAlineacion("left,center,left,left,center,center,center,center");
	let dropdown = {
      "col8": {
         "opciones": [
            {"etiqueta":"", "titulo": "Opc. Notificación", "icono": "fa-solid fa-list-ul fa-lg", "tooltip": "Lista de opciones", "tipoicono": "i",
               "menu":[
                  { "campo_bd": "band_detalle", "valor_campo": "1", "icono": "fa-solid fa-circle-info fa-lg", "callback": "historialNotificacion", "etiqueta": "Historial", "tipoicono": "i", "color": "color_blue" },
                  { "campo_bd": "icon_ubicacion", "valor_campo": "1", "icono": "fa-solid fa-map-location-dot fa-lg", "callback": "verUbicacion", "etiqueta": "Ubicación", "tipoicono": "i", "color": "color_green" },
                  { "campo_bd": "icon_soportes", "valor_campo": "1", "icono": "fa-solid fa-folder-open fa-lg", "callback": "verSoporte", "etiqueta": "Soporte", "tipoicono": "i", "color": "color_blue" }
               ]
            }
         ]
      }
   }
	table.setDropDown(dropdown);
   table.loading = true;
	table.setParametros($("#frmNotificaciones").serialize());
	table.loadJSON();
}
//!
const recargaPaginadoPrincipal = () => {
   table.loading = true;
   table.parametros = $("#frmNotificaciones").serialize();
   table.loadJSON(table.pagina);
}
//!
const recargaPagPrincipalSinLoading = () => {
   table.loading = false;
   table.parametros = $("#frmNotificaciones").serialize();
   table.loadJSON(table.pagina);
}
//!
socket.on('refresh_cambio_estatus', async(data) => {
   recargaPagPrincipalSinLoading();
});
//!
const keyEvent = (event) => {
   let tecla = (event.all) ? event.keyCode : event.which;
   if (tecla == 13) {
      loadNotificacionesPag();
   }
   else {
      return false;
   }
}
//!
const validFechaSearch = () => {
   fActual = fechaActual();
	const fechaInicio = $("#fecha_inicio").val();
	if(fechaInicio > fActual.fecha2) {
		$("#fecha_termino").val(fechaInicio);
	}
	else{
		$("#fecha_termino").val(fActual.fecha2);
	}
	$("#fecha_termino").prop("min",fechaInicio);
}
//!
const validCombos = (id,id2) => {
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