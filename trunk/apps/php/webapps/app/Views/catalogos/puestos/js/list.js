let target,spinner;
let table = new MTable();
let tblSueldos = new MTable();
let tblCentroTrab = new MTable();

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
   loadPuestos();

	$("#btnBuscar").on("click", function () {
      loadPuestos();
	});

   $("#btnInfo").on("click", function () {
      descargarInforme();
   });

	$("#btnNuevo").on("click", function () {
      vmdal_reg_puesto('','N');
	});

	$("#desc_puesto").keypress(function (e) {
      keyEvent(e);
   });
});

function loadPuestos() {
   table.setTablaHTML("gridPuestos");
   table.setUrl(contexto+"Puestos/puestosPag");
   table.setRegistrosPagina(10);
   table.setColumnas("id_puesto,nombre_puesto,desc_tipo,detalle");
   table.setColTipos("text,text,text,dropdown");
   table.setAlineacion("left,left,center,center");
	let dropdown = {
      "col4": {
         "opciones": [
            {"etiqueta":"", "titulo": "Opciones", "icono": "fa-solid fa-list-ul fa-lg", "tooltip": "Lista de opciones", "tipoicono": "i",
               "menu":[
                  { "campo_bd": "sueldos", "valor_campo": "1", "icono": "fa-solid fa-hand-holding-dollar fa-lg", "callback": "agregarSueldos", "etiqueta": "Sueldo", "tipoicono": "i", "color": "color_black" },
                  { "campo_bd": "sueldos", "valor_campo": "2", "icono": "fa-solid fa-hand-holding-dollar fa-lg", "callback": "agregarSueldos", "etiqueta": "Sueldo", "tipoicono": "i", "color": "color_green" },
                  { "campo_bd": "editar", "valor_campo": "1", "icono": "fa-solid fa-pen-to-square fa-lg", "callback": "editarPuesto", "etiqueta": "Editar", "tipoicono": "i", "color": "color_blue" }
               ]
            }
         ]
      }
   }
   table.setDropDown(dropdown);
   table.fontSize = '0.8rem';
   table.setParametros($("#frmPuestos").serialize());
   table.loadJSON();
}
//
function recargaPaginadoPrincipal() {
   table.parametros = $("#frmPuestos").serialize();
   table.loadJSON(table.pagina);
}
// TODO: Proceso de editar
function editarPuesto(reg){
   vmdal_reg_puesto(reg.id_puesto,'E');
	$("#vm_nombre_puesto").val(reg.nombre_puesto);
   $("#vm_nombre_puesto_tmp").val(reg.nombre_puesto);
   if(reg.administrativo > 0){
      $("#vm_check_admin").prop('checked',true);
	   $("#vm_check_admin").val(1);
   }
   else{
      $("#vm_check_admin").prop('checked',false);
	   $("#vm_check_admin").val(0);
   }
   $("#vm_num_orden").val(reg.num_orden_puesto);
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
//!
function keyEvent(event) {
   var tecla = (event.all) ? window.event : event.which;
   if (tecla == 13) {
      loadPuestos();
   }
   else {
      return false;
   }
}
// TODO: Proceso de descargar de nomina
function descargarInforme() {
   let formData = new FormData($("#frmPuestos")[0]);
   formData.append("desc_puesto",$("#desc_puesto").val());
   $('button[btn="btn"]').prop('disabled',true);
   $("#overlayprincipal").show();
   target = document.getElementById('frmPuestos');
   spinner = new Spinner().spin(target);
   let xhr = new XMLHttpRequest();
   xhr.open('post', contexto+'Puestos/descargarInforme', true);
   xhr.responseType = 'blob';
   xhr.onload = function () {
      let blob = new Blob([this.response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      if(window.navigator && window.navigator.msSaveOrOpenBlob){
         window.navigator.msSaveOrOpenBlob(blob);
         return;
      }
      let downloadURL = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = downloadURL;
      a.download = "INFORME_PUESTOS.xlsx";
      a.click();
      window.URL.revokeObjectURL(downloadURL);
      a.remove();
      $('button[btn="btn"]').prop('disabled',false);
      spinner.stop();
      $("#overlayprincipal").hide();
   }
   xhr.send(formData);
}