// JavaScript Document
function modal(id_Body, titulo, mensaje, estilo, button, funcion) {
   vModal(id_Body, titulo, mensaje, estilo, button, funcion);
   $('#vModal').modal('toggle');
}

function vModal(id_Body, titulo, mensaje, estilo, button, funcion) {
   let title = titulo;
   let message = mensaje;
   let stile = estilo;
   let btn = button;
   let fc = funcion;
   let opcion = "";
   let botonx = "";
   let opcionbtn = null;

   $("#vModal").remove();
   if (fc == null) {
      botonx = "<button type='button' class='btn-close text-white' data-bs-dismiss='modal' aria-label='Close'></button>";
   }
   else {
      opcion = "onclick='setTimeout(function(){" + funcion + "},400)'";
      botonx = "<button type='button' class='btn-close text-white' data-bs-dismiss='modal' aria-label='Close' " + opcion + "></button>";
   }

   if (btn == null) {
      opcionbtn = "";
   }
   else {
      opcionbtn = btn;
   }

   if (stile == 'formdefault') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModal' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "		    <div class='modal-body' id='divModal'>" + message + "</div>" +
         "	    	<div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "   </div>" +
         "</div>");
   }
   else if (stile == 'formdefault-center') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModal' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-dialog-centered'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "		    <div class='modal-body' id='divModal'>" + message + "</div>" +
         "		    <div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "   </div>" +
         "</div>");
   }
   else if (stile == 'formdefault_scrollable') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModal' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-dialog-scrollable'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' style='max-height:510px;' id='divModal'>" + message + "</div>" +
         "	    	<div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
   else if (stile == 'formdefault_btn_sformat') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModal' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' id='divModal'>" + message + "</div>" +
         "	    	<div class='modal-footer-2'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
   else if (stile == 'formdefault_scrollable_center') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModal' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-dialog-centered modal-dialog-scrollable'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' style='max-height:500px;' id='divModal'>" + message + "</div>" +
         "	    	<div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
   if (stile == 'formdefault_scrollable_error') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModal' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-dialog-scrollable'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-danger-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " "+
         "	    	</div>" +
         "	    	<div class='modal-body' style='max-height:510px;' id='divModal'>" + message + "</div>" +
         "	    	<div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
}

function closeModal() {
   $('#divModal').empty();
   $('#vModal').modal('hide');
}
/* ********************** MODAL LG ************************************** */
function modalLG(id_Body, titulo, mensaje, estilo, button, funcion) {
   vModalLG(id_Body, titulo, mensaje, estilo, button, funcion);
   $('#vModalLG').modal('toggle');
}

function vModalLG(id_Body, titulo, mensaje, estilo, button, funcion) {
   let title = titulo;
   let message = mensaje;
   let stile = estilo;
   let btn = button;
   let fc = funcion;
   let opcion = "";
   let botonx = "";
   let opcionbtn = null;

   $("#vModalLG").remove();
   if (fc == null) {
      botonx = "<button type='button' class='btn-close text-white' data-bs-dismiss='modal' aria-label='Close'></button>";
   }
   else {
      opcion = "onclick='setTimeout(function(){" + funcion + "},400)'";
      botonx = "<button type='button' class='btn-close text-white' data-bs-dismiss='modal' aria-label='Close' " + opcion + "></button>";
   }

   if (btn == null) {
      opcionbtn = "";
   }
   else {
      opcionbtn = btn;
   }

   if (stile == 'formlg') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalLG' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-lg'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "		    <div class='modal-body' id='divModalLG'>" + message + "</div>" +
         "		    <div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "   </div>" +
         "</div>");
   }
   if (stile == 'formlg_btn_sformat') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalLG' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-lg'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "		    <div class='modal-body' id='divModalLG'>" + message + "</div>" +
         "		    <div class='modal-footer-2'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "   </div>" +
         "</div>");
   }
   if (stile == 'formlg_scrollable_center') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalLG' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "		    <div class='modal-body' style='max-height:510px;' id='divModalLG'>" + message + "</div>" +
         "		    <div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "   </div>" +
         "</div>");
   }
   if (stile == 'formlg_scrollable') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalLG' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-lg modal-dialog-scrollable'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' style='max-height:510px;' id='divModalLG'>" + message + "</div>" +
         "	    	<div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
   else if (stile == 'formlg_scrollable_btn_sformat') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalLG' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-lg modal-dialog-scrollable'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' style='max-height:510px;' id='divModalLG'>" + message + "</div>" +
         "	    	<div class='modal-footer-2'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
   if (stile == 'formlg_scrollable_esc') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalLG' data-bs-backdrop='static' data-bs-keyboard='true' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-lg modal-dialog-scrollable'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' style='max-height:510px;' id='divModalLG'>" + message + "</div>" +
         "	    	<div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
   if (stile == 'formlg_scrollable_error') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalLG' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-lg modal-dialog-scrollable'>" +
         "	    <div class='modal-content'>" +
          "	    	<div class='modal-header bg-danger-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' style='max-height:510px;' id='divModalLG'>" + message + "</div>" +
         "	    	<div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
}

function closeModalLG() {
   $('#divModalLG').empty();
   $('#vModalLG').modal('hide');
}
/* ********************** MODAL LG 2************************************** */
function modalLG2(id_Body, titulo, mensaje, estilo, button, funcion) {
   vModalLG2(id_Body, titulo, mensaje, estilo, button, funcion);
   $('#vModalLG2').modal('toggle');
}

function vModalLG2(id_Body, titulo, mensaje, estilo, button, funcion) {
   let title = titulo;
   let message = mensaje;
   let stile = estilo;
   let btn = button;
   let fc = funcion;
   let opcion = "";
   let botonx = "";
   let opcionbtn = null;

   $("#vModalLG2").remove();
   if (fc == null) {
      botonx = "<button type='button' class='btn-close text-white' data-bs-dismiss='modal' aria-label='Close'></button>";
   }
   else {
      opcion = "onclick='setTimeout(function(){" + funcion + "},400)'";
      botonx = "<button type='button' class='btn-close text-white' data-bs-dismiss='modal' aria-label='Close' " + opcion + "></button>";
   }

   if (btn == null) {
      opcionbtn = "";
   }
   else {
      opcionbtn = btn;
   }

   if (stile == 'formlg_scrollable_center') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalLG2' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "		    <div class='modal-body' style='max-height:510px;' id='divModalLG2'>" + message + "</div>" +
         "		    <div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "   </div>" +
         "</div>");
   }
   if (stile == 'formlg_scrollable') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalLG2' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-lg modal-dialog-scrollable'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' style='max-height:510px;' id='divModalLG2'>" + message + "</div>" +
         "	    	<div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
   if (stile == 'formlg_scrollable_error') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalLG2' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-lg modal-dialog-scrollable'>" +
         "	    <div class='modal-content'>" +
          "	    	<div class='modal-header bg-danger-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' style='max-height:510px;' id='divModalLG2'>" + message + "</div>" +
         "	    	<div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
}

function closeModalLG2() {
   $('#divModalLG2').empty();
   $('#vModalLG2').modal('hide');
}
/* ********************** MODAL XL ************************************** */
function modalXL(id_Body, titulo, mensaje, estilo, button, funcion) {
   vModalXL(id_Body, titulo, mensaje, estilo, button, funcion);
   $('#vModalXL').modal('toggle');
}

function vModalXL(id_Body,titulo,mensaje,estilo,button,funcion) {
   let title = titulo;
   let message = mensaje;
   let stile = estilo;
   let btn = button;
   let fc = funcion;
   let opcion = "";
   let botonx = "";
   let opcionbtn = null;

   $("#vModalXL").remove();
   if (fc == null) {
      botonx = "<button type='button' class='btn-close text-white' data-bs-dismiss='modal' aria-label='Close'></button>";
   }
   else {
      opcion = "onclick='setTimeout(function(){" + funcion + "},400)'";
      botonx = "<button type='button' class='btn-close text-white' data-bs-dismiss='modal' aria-label='Close' " + opcion + "></button>";
   }

   if (btn == null) {
      opcionbtn = "";
   }
   else {
      opcionbtn = btn;
   }

   if (stile == 'formxl') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalXL' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-xl'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "		    <div class='modal-body' id='divModalXL'>" + message + "</div>" +
         "		    <div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "   </div>" +
         "</div>");
   }
   else if (stile == 'formxl_btn_sformat') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalXL' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-xl'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' id='divModalXL'>" + message + "</div>" +
         "	    	<div class='modal-footer-2'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
   else if (stile == 'formxl_scrollable') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalXL' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-xl modal-dialog-scrollable'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' style='max-height:510px;' id='divModalXL'>" + message + "</div>" +
         "	    	<div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
   else if (stile == 'formxl_scrollable_btn_sformat') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalXL' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-xl modal-dialog-scrollable'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' style='max-height:510px;' id='divModalXL'>" + message + "</div>" +
         "	    	<div class='modal-footer-2'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
}

function closeModalXL() {
   $('#divModalXL').empty();
   $('#vModalXL').modal('hide');
}
/* ********************** MODAL XL 2************************************** */
function modalXL2(id_Body, titulo, mensaje, estilo, button, funcion) {
   vModalXL2(id_Body, titulo, mensaje, estilo, button, funcion);
   $('#vModalXL2').modal('toggle');
}

function vModalXL2(id_Body,titulo,mensaje,estilo,button,funcion) {
   let title = titulo;
   let message = mensaje;
   let stile = estilo;
   let btn = button;
   let fc = funcion;
   let opcion = "";
   let botonx = "";
   let opcionbtn = null;

   $("#vModalXL2").remove();
   if (fc == null) {
      botonx = "<button type='button' class='btn-close text-white' data-bs-dismiss='modal' aria-label='Close'></button>";
   }
   else {
      opcion = "onclick='setTimeout(function(){" + funcion + "},400)'";
      botonx = "<button type='button' class='btn-close text-white' data-bs-dismiss='modal' aria-label='Close' " + opcion + "></button>";
   }

   if (btn == null) {
      opcionbtn = "";
   }
   else {
      opcionbtn = btn;
   }

   if (stile == 'formxl') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalXL2' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-xl'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "		    <div class='modal-body' id='divModalXL2'>" + message + "</div>" +
         "		    <div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "   </div>" +
         "</div>");

   }
   else if (stile == 'formxl_scrollable') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalXL2' data-bs-backdrop='static' data-bs-keyboard='false' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' style='max-height:510px;' id='divModalXL2'>" + message + "</div>" +
         "	    	<div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");

        
   }
}

function closeModalXL2() {
   $('#divModalXL2').empty();
   $('#vModalXL2').modal('hide');
}

/* ********************** MODAL FullScreen ************************************** */
function modalFullScreen(id_Body, titulo, mensaje, estilo, button, funcion) {
   vModalFullScreen(id_Body, titulo, mensaje, estilo, button, funcion);
   $('#vModalFullScreen').modal('toggle');
}

function vModalFullScreen(id_Body, titulo, mensaje, estilo, button, funcion) {
   let title = titulo;
   let message = mensaje;
   let stile = estilo;
   let btn = button;
   let fc = funcion;
   let opcion = "";
   let botonx = "";
   let opcionbtn = null;

   $("#vModalFullScreen").remove();
   if (fc == null) {
      botonx = "<button type='button' class='btn-close text-white' data-bs-dismiss='modal' aria-label='Close'></button>";
   }
   else {
      opcion = "onclick='setTimeout(function(){" + funcion + "},400)'";
      botonx = "<button type='button' class='btn-close text-white' data-bs-dismiss='modal' aria-label='Close' " + opcion + "></button>";
   }

   if (btn == null) {
      opcionbtn = "";
   }
   else {
      opcionbtn = btn;
   }

   if (stile == 'formxxl_scrollable') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalFullScreen' data-bs-backdrop='static' data-bs-keyboard='true' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-fullscreen'>" +
         "	    <div class='modal-content'>" +
          "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' id='divModalFullScreen'>" + message + "</div>" +
         "	    	<div class='modal-footer'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
   if (stile == 'formxxl_scrollable_btn_sformat') {
      $("#" + id_Body + "").before(
         "<div class='modal fade' id='vModalFullScreen' data-bs-backdrop='static' data-bs-keyboard='true' tabindex='-1' aria-labelledby='myModalLabel' aria-hidden='true'>" +
         "	<div class='modal-dialog modal-fullscreen'>" +
         "	    <div class='modal-content'>" +
         "	    	<div class='modal-header bg-primary-800'>" +
         "	    	    <h4 class='modal-title fs-5' style='color: #f5fbfb;'>" + title + "</h4>" +
         "	    	    " + botonx + " " +
         "	    	</div>" +
         "	    	<div class='modal-body' id='divModalFullScreen'>" + message + "</div>" +
         "	    	<div class='modal-footer-2'>" + opcionbtn + "</div>" +
         "	    </div>" +
         "	</div>" +
         "</div>");
   }
}

function closeModalFullScreen() {
   $('#divModalFullScreen').empty();
   $('#vModalFullScreen').modal('hide');
}
/* ********************* Preloader ************************************** */
jQuery(window).on("load", function () {
   if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
         $(this).remove();
      });
   }
});
//!
function parseNull(dato){
   if(dato == null)
      return "";
   else if (dato == "null")
      return "";
   else if (dato == "NULL")
      return "";
   else if (dato == "undefined")
      return "";
   else if (dato == undefined)
      return "";
   else
      return dato;
}
//!
function validURL(miurl) {
   let band = true;
   if(miurl !== '') {
      let request = new XMLHttpRequest();  
      request.open('GET', miurl, false);  
      request.send();  
      
      if (request.status == "404") {  
         band = false;
      }
   }
   else {
      band = false;
   }

   return band;
}
//!
function validarIsNumeroEntero(valor) {
   let regexPattern = /^-?[0-9]+$/;
   let result = regexPattern.test(valor);
   if(result) {
      return true;
   }
   else {
      return false;
   }
}
/*
* Validar solo numero, letras y espacios input.
* Uso:  onkeypress="return getKeyNumberLetrasEspacio(event);"
*/
function getKeyNumberLetrasEspacio(events) {
   var regex = new RegExp("^[a-zA-Z0-9 ]+$");
   var key = String.fromCharCode(!events.charCode ? events.which : events.charCode);
   if (!regex.test(key)) {
      events.preventDefault();
      return false;
   }
}
/*
* Validar solo numero y letras input.
* Uso:  onkeypress="return getKeyNumberLetras(event);"
*/
function getKeyNumberLetras(events) {
   var regex = new RegExp("^[a-zA-Z0-9]+$");
   var key = String.fromCharCode(!events.charCode ? events.which : events.charCode);
   if (!regex.test(key)) {
      events.preventDefault();
      return false;
   }
}
//Valida valor que sea un importe con decimales
function getValidaNumberDecimal(valor) {
   var re = "^[0-9]+(.[0-9]+)?$";
   return valor.match(re) !== null
}
//Valida valor que sean numeros y letras
function getValidaNumberLetras(valor) {
   var re = /^[a-z0-9]*$/i;
   return valor.match(re) !== null
}
/*
* Convierte los String a Mayusculas.
* Uso: onkeyup="mayus(this);"
*/
function mayus(e) {
   e.value = e.value.toUpperCase();
}

function convertMayusMinus(cadena) {
   let pletra = cadena.charAt(0).toUpperCase();
   let resto = cadena.slice(1).toLowerCase();

   return pletra + resto;
}
/*
* FUNCION PARA VALIDAR EL FORMATO DEL EMAIL
* USO: SE NECESITA ENVIAR EL ID DEL INPUT DEL EMAIL
* @param id
* @return boolean
*/
function validacion_email(id_email) {
   let regex = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;
   if (regex.test($("#" + id_email + "").val().trim())) {
      return true;
   }
   else {
      return false;
   }
}
/*
* Valida que el texto escrito en el campo sea un 
*  caracter numerico.
* Uso: onkeypress="return getKeyNumber(event);"
*/
function getKeyNumber(events) {
   let regex = new RegExp("^[0-9]+$");
   let key = String.fromCharCode(!events.charCode ? events.which : events.charCode);
   if (!regex.test(key)) {
      events.preventDefault();
      return false;
   }
}
/*
* Valida que el texto escrito en el campo sea un 
*  caracter numerico.
* Uso: onkeypress="return getKeyNumberDecimal(event);"
*/
function getKeyNumberDecimal(events) {
   let regex = new RegExp("^[a-zA-Z0-9]+$");
   let key = (window.event) ? events.keyCode : events.which;
   if (((key >= 48 && key <= 57) || key == 8 || key == 0) ||
      (key == 44 || key == 46 || key == 45)) {
         if (!regex.test(key)) {
            events.preventDefault();
            return true;
         }
   }
   else {
      return false;
   }
}
//poner formato de numeros
function formatNumber(num, prefix) {
   prefix = prefix || '';
   num += '';
   let splitStr = num.split('.');
   let splitLeft = splitStr[0];
   let splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '';
   let regx = /(\d+)(\d{3})/;
   while (regx.test(splitLeft)) {
      splitLeft = splitLeft.replace(regx, ' $1' + ',' + '$2');
   }
   if (splitRight.length == 0)
      splitRight = ".00";
   else if (splitRight.length == 2)
      splitRight += "0";

   let cadNumero = splitRight.substring(0,3);
   return prefix + splitLeft + cadNumero;
}
//poner formato de numeros con N decimales
function formatNumberxDecimal(num,numDecimal,prefix='') {
   prefix = prefix||'';
   num += '';
   let splitStr = num.split('.');
   let splitLeft = splitStr[0];
   let splitRight = (splitStr.length > 1) ? '.'+splitStr[1]:'';
   let regx = /(\d+)(\d{3})/;
   while (regx.test(splitLeft)) {
      splitLeft = splitLeft.replace(regx, ' $1' + ',' + '$2');
   }

   if (splitRight.length == 0)
      splitRight = "."+rpad('0', numDecimal);
   else if (splitRight.length == numDecimal)
      splitRight += "0";

   let decimal = numDecimal + 1;
   let cadNumero = splitRight.substring(0,decimal);

   return prefix + splitLeft + cadNumero;
}
//poner formato de numeros sin decimal
function formatNumberSD(num, prefix) {
   prefix = prefix || '';
   num += '';
   let splitStr = num.split('.');
   let splitLeft = splitStr[0];
   let regx = /(\d+)(\d{3})/;
   while (regx.test(splitLeft)) {
      splitLeft = splitLeft.replace(regx, ' $1' + ',' + '$2');
   }

   return prefix + splitLeft;
}
//quita formato de numeros
function unFormatNumber(param) {
   return param.replace(/([^0-9.-])/g, '') * 1;
}
/*Funcion donde formatea el numeros*/
function formateo(elemento) {
   if (elemento.value != "")
      elemento.value = formatNumber(elemento.value);
}
/*Funcion donde formatea el numeros con N decimales*/
function formateoxDecimal(elemento,Numdecimal) {
   if (elemento.value != "")
      elemento.value = formatNumberxDecimal(elemento.value,Numdecimal);
}
/*Funcion donde formatea el numeros sin decimal*/
function formateoSD(elemento) {
   if (elemento.value != "")
      elemento.value = formatNumberSD(elemento.value);
}
/*Funcion donde quita el formato de numeros*/
function sinformateo(elemento) {
   if (elemento.value != "")
      elemento.value = unFormatNumber(elemento.value);
}
/* Ajax Con Return de Respuesta
* var Variable = ajaxJim(url,parametros,function(data){})
*/
function ajax(urldoc, parametros, success) {
   ajaxOption({ url: urldoc, type: 'POST', data: parametros, success: success });
}

function ajaxOption(property) {
   let prop = jQuery.extend
      ({
         dataType: 'JSON',
         async: false
      }, property);

   jQuery.ajax({
      url: prop.url,
      type: prop.type,
      data: prop.data,
      async: prop.async,
      dataType: prop.dataType,
      success: function (data, textStatus, transport) {
         prop.success(data);
      },
      error: function (xhr, ajaxOptions, thrownError) {
         prop.success(null);
      }
   });
}

function lpad(str, max) {
   str = str.toString(); 
   return str.length < max ? lpad("0"+str,max):str;
}

function rpad(str, max) {
   str = str.toString(); 
   return str.length < max ? rpad(str+"0",max):str;
}

function pesoFile(num_mb) {
   /*
   * 100 Megabytes = 104857600 Bytes
   * 90 Megabytes = 94371840 Bytes
   * 80 Megabytes = 83886080 Bytes
   * 70 Megabytes = 73400320 Bytes
   * 60 Megabytes = 62914560 Bytes
   * 50 Megabytes = 52428800 Bytes
   * 40 Megabytes = 41943040 Bytes
   * 30 Megabytes = 31457280 Bytes
   * 20 Megabytes = 20971520 Bytes
   * 15 Megabytes = 15728640 Bytes 
   * 10 Megabytes = 10485760 Bytes (default)
   * 5 Megabytes = 5242880 Bytes
   * 2 Megabytes = 2097152 Bytes
   */
   let tamanioByte = 0;

   if(parseInt(num_mb) === 2) {
      tamanioByte = 2097152;
   }
   else if(parseInt(num_mb) === 5) {
      tamanioByte = 5242880;
   }
   else if(parseInt(num_mb) === 10) {
      tamanioByte = 10485760;
   }
   else if(parseInt(num_mb) === 15) {
      tamanioByte = 15728640;
   }
   else if(parseInt(num_mb) === 20) {
      tamanioByte = 20971520;
   }
   else if(parseInt(num_mb) === 30) {
      tamanioByte = 31457280;
   }
   else if(parseInt(num_mb) === 40) {
      tamanioByte = 41943040;
   }
   else if(parseInt(num_mb) === 50) {
      tamanioByte = 52428800;
   }
   else if(parseInt(num_mb) === 60) {
      tamanioByte = 62914560;
   }
   else if(parseInt(num_mb) === 70) {
      tamanioByte = 73400320;
   }
   else if(parseInt(num_mb) === 80) {
      tamanioByte = 83886080;
   }
   else if(parseInt(num_mb) === 90) {
      tamanioByte = 94371840;
   }
   else if(parseInt(num_mb) === 100) {
      tamanioByte = 104857600;
   }
   else {
      tamanioByte = 10485760;
   }

   return tamanioByte;
}

function verifcar_peso_archivo(archivo, tamanio) {
   let pesoLimite = pesoFile(tamanio);
   let input = document.getElementById(''+archivo+'');
   let file = input.files[0];
   let sizeFile = file.size;

   if (sizeFile > pesoLimite) {
      return true;
   }
   else {
      return false;
   }
}

function comprueba_extension(archivo, extensiones_permitidas) {
   if (archivo) {
      extension = (archivo.substring(archivo.lastIndexOf("."))).toLowerCase();
      permitida = false;
      for (let i = 0; i < extensiones_permitidas.length; i++) {
         if (extensiones_permitidas[i] === extension) {
            permitida = true;
            break;
         }
      }

      if (permitida) {
         return 1;
      }
   }

   return 0;
}

//Función para validar una CURP
function validacionCURP(curp) {
   let re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
      validado = curp.match(re);

   if (!validado) //Coincide con el formato general?
      return false;

   //Validar que coincida el dígito verificador
   function digitoVerificador(curp17) {
      //Fuente https://consultas.curp.gob.mx/CurpSP/
      let diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
         lngSuma = 0.0,
         lngDigito = 0.0;

      for (var i = 0; i < 17; i++) {
         lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
      }

      lngDigito = 10 - lngSuma % 10;

      if (lngDigito == 10) {
         return 0;
      }

      return lngDigito;
   }

   if (validado[2] != digitoVerificador(validado[1])) {
      return false;
   }

   //Validado
   return true;
}

function obtenerRFCSinHomoclabe(curp) {
   let rfc = curp.substring(0, 10);
   return rfc;
}

function obtenerGenero(curp) {
   let sexo = curp.substring(10, 11);
   let genero;

   if (sexo === 'H') {
      genero = 'M';
   }
   if (sexo === 'M') {
      genero = 'F';
   }

   return genero;
}

function obtenerFechaNacimiento(curp) {
   let anio;
   let ano;
   let mes;
   let dia;
   let fechaNacimiento;

   anio = curp.substring(4, 6);
   ano = parseInt(anio, 10) + 1900;
   mes = curp.substring(6, 8);
   dia = curp.substring(8, 10);

   if (ano <= 1901) {
      ano += 100;
   }

   fechaNacimiento = dia + '/' + mes + '/' + ano;
   return fechaNacimiento;
}

function obtenerEdad(curp) {
   let hoy = new Date();
   let anio;
   let ano;
   let mes;
   let dia;
   let fechaNacimiento;
   let edad;
   let diferenciaMeses;

   anio = curp.substring(4, 6);
   ano = parseInt(anio, 10) + 1900;
   mes = curp.substring(6, 8);
   dia = curp.substring(8, 10);

   if (ano <= 1901) {
      ano += 100;
   }

   fechaNacimiento = new Date(ano + '/' + mes + '/' + dia);
   edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
   diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
   if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
   }

   return edad;
}

function logout_session() {
   document.forms['frmprincipal'].action = $("#context").val()+'Home/logout';
   document.forms['frmprincipal'].target = '_parent';
   document.forms['frmprincipal'].submit();
}

//Función para validar un RFC
// Devuelve el RFC sin espacios ni guiones si es correcto
// Devuelve false si es inválido
// (debe estar en mayúsculas, guiones y espacios intermedios opcionales)
function rfcValido(rfc, aceptarGenerico = true) {
   const re       = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
   var   validado = rfc.match(re);
   let resultado ='';
   if (!validado)  //Coincide con el formato general del regex?
       return false;

   //Separar el dígito verificador del resto del RFC
   const digitoVerificador = validado.pop(),
      rfcSinDigito = validado.slice(1).join(''),
      len          = rfcSinDigito.length,
   //Obtener el digito esperado
      diccionario = "0123456789ABCDEFGHIJKLMN&OPQRSTUVWXYZ Ñ",
      indice      = len + 1;
   var suma,
      digitoEsperado;

   if (len == 12)
      suma = 0
   else 
      suma = 481; //Ajuste para persona moral

   for(var i=0; i<len; i++)
      suma += diccionario.indexOf(rfcSinDigito.charAt(i)) * (indice - i);
   digitoEsperado = 11 - suma % 11;
   if (digitoEsperado == 11) digitoEsperado = 0;
   else if (digitoEsperado == 10) digitoEsperado = "A";

   //El dígito verificador coincide con el esperado?
   // o es un RFC Genérico (ventas a público general)?
   if ((digitoVerificador != digitoEsperado) && (!aceptarGenerico || rfcSinDigito + digitoVerificador != "XAXX010101000"))
      return false;
   else if (!aceptarGenerico && rfcSinDigito + digitoVerificador == "XEXX010101000")
      return false;

   resultado = rfcSinDigito + digitoVerificador;
   return resultado;
}

function ValidaRfc(rfcStr) {
	let strCorrecta;
   let valid
	strCorrecta = rfcStr;	
	if (rfcStr.length == 12){
	   valid = '^(([A-Z]|[a-z]){3})([0-9]{6})((([A-Z]|[a-z]|[0-9]){3}))';
	}
   else{
	   valid = '^(([A-Z]|[a-z]|\s){1})(([A-Z]|[a-z]){3})([0-9]{6})((([A-Z]|[a-z]|[0-9]){3}))';
	}
	let validRfc=new RegExp(valid);
	let matchArray=strCorrecta.match(validRfc);
	if (matchArray==null) {
		return false;
	}
	else {
		return true;
	}
}

padre = $(window.parent.document);
/***************Checkbox****************************************************************/
function seleccionarAll(ele_check,num_columna,tbl) {
   if(ele_check.checked == true){
      marcarAll(num_columna,tbl);
   }
   else {
      desmarcarAll(num_columna,tbl);
   }
}

function marcarAll(num_columna,tbl) {
   let checks = document.getElementsByClassName(tbl+"check"+num_columna);
   for(let i=0; i<checks.length; i++) {
       checks[i].checked = true;
   }
}

function desmarcarAll(num_columna,tbl) {
   let checks = document.getElementsByClassName(tbl+"check"+num_columna);
   for(let i=0; i<checks.length; i++){
       checks[i].checked = false;
   }
}

function totalSelecionados(param,tbl) {
   let checks = document.getElementsByClassName(tbl+"check"+param);
   let totalMarcados  = 0;

   for(let i=0; i<checks.length; i++){
      if(checks[i].checked == true){
         totalMarcados++;
      }
   }
   
   return totalMarcados;
}

function checkSelecionados(param,tbl) {
   let checks = document.getElementsByClassName(tbl+"check"+param);
   let chMarcados  = "";
   
   for(let i=0; i<checks.length; i++){
      if(checks[i].checked == true){
         chMarcados += (chMarcados == "")? checks[i].value:","+checks[i].value;  
      }
   }
   return chMarcados;
}

function checkSelecionadosString(param,tbl) {
   let checks = document.getElementsByClassName(tbl+"check"+param);
   let chMarcados  = "";
   
   for(let i=0; i<checks.length; i++){
      if(checks[i].checked == true){
         chMarcados += (chMarcados == "") ? "'"+checks[i].value+"'":","+"'"+checks[i].value+"'";  
      }
   }
   return chMarcados;
}

function agregarToast({ tipo, titulo, descripcion, autoCierre }){
   const contenedorToast = document.getElementById('contenedor-toast');
   // Crear el nuevo toast
	const nuevoToast = document.createElement('div');

	// Agregar clases correspondientes
	nuevoToast.classList.add('toast_hana');
	nuevoToast.classList.add(tipo);
	if (autoCierre) nuevoToast.classList.add('autoCierre');

	// Agregar id del toast
	const numeroAlAzar = Math.floor(Math.random() * 100);
	const fecha = Date.now();
	const toastId = fecha + numeroAlAzar;
	nuevoToast.id = toastId;

	// Iconos
	const iconos = {
		exito: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
					<path
						d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"
					/>
				</svg>`,
		error: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
								<path
									d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
								/>
							</svg>`,
		info: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
								<path
									d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
								/>
							</svg>`,
		warning: `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
								<path
									d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
								/>
							</svg>`,
	};

	// Plantilla del toast
	const toast = `
		<div class="contenido_toast_hana">
			<div class="icono">
				${iconos[tipo]}
			</div>
			<div class="texto">
				<p class="titulo">${titulo}</p>
				<h6 class="descripcion"><strong>${descripcion}</strong></h6>
			</div>
		</div>
		<button class="btnes-cerrar">
			<div class="icono">
				<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
					<path
						d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
					/>
				</svg>
			</div>
		</button>
	`;
   // Agregar la plantilla al nuevo toast
	nuevoToast.innerHTML = toast;

	// Agregamos el nuevo toast al contenedor
	contenedorToast.appendChild(nuevoToast);

	// Función para menajera el cierre del toast
	const handleAnimacionCierre = (e) => {
		if (e.animationName === 'cierre') {
			nuevoToast.removeEventListener('animationend', handleAnimacionCierre);
			nuevoToast.remove();
		}
	};

	if (autoCierre) {
		setTimeout(() => cerrarToasts(toastId), 4600);
	}

	// Agregamos event listener para detectar cuando termine la animación
	nuevoToast.addEventListener('animationend', handleAnimacionCierre);
}

function cerrarToasts(id){
   document.getElementById(id)?.classList.add("cerrando");           
}

function fechaInvalida(date) {
   return !isNaN(new Date(date));
}

function fechaActual() {
   let fecha = {}
   let hoy     = new Date();
   let dia     = lpad(hoy.getDate(),2);
   let diaNum  = hoy.getDate();
   let mes     = lpad(hoy.getMonth()+1,2);
   let mesNum  = hoy.getMonth()+1;
   let year    = hoy.getFullYear();
   let hora    = lpad(hoy.getHours(),2);
   let min     = lpad(hoy.getMinutes(),2);
   let sec     = lpad(hoy.getSeconds(),2);
   //
   fecha.dia      = dia;
   fecha.diaNum   = diaNum;
   fecha.mes      = mes;
   fecha.mesNum   = mesNum;
   fecha.anio     = year;
   fecha.fecha1   = dia+'/'+mes+'/'+year;
   fecha.fecha2   = year+'-'+mes+'-'+dia;
   fecha.fechaNum = year+mes+dia;
   fecha.hora1    = hora+':'+min+':'+sec;
   fecha.hora2    = hora+':'+min;
   fecha.horaNum  = hora+min+sec;

   return fecha;
}