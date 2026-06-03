function agregarSueldos(reg) {
   let html = '';
   let botones = '';
   let titulo = 'Sueldo para el Puesto';
   html +=  `<form method="post" id="frmSueldoPue" name="frmSueldoPue" onSubmit="return false;">
              <input type="hidden" id="vm_id_puesto_s" name="vm_id_puesto_s" value="${reg.id_puesto}"/>
              <input type="hidden" id="vm_es_admin" name="vm_es_admin" value="${reg.administrativo}"/>
            </form>`;
   html +=  `<div class="row">
              <div class="col-sm-9">
                 <figure>
                    <blockquote class="blockquote"><p class="p-font-msg-09 p-font-weight-500" id="labelPuesto">${reg.nombre_puesto}</p></blockquote>
                    <figcaption class="blockquote-footer p-font-weight">Nombre del Puesto</figcaption>
                </figure>
              </div>
              <div class="col-sm-3">
                 <figure>
                    <blockquote class="blockquote"><p class="p-font-msg-09 p-font-weight-500" id="labelPuesto">${reg.desc_tipo}</p></blockquote>
                    <figcaption class="blockquote-footer p-font-weight">Tipo Puesto</figcaption>
                </figure>
              </div>
            </div>
            <hr style="margin-top:-3px">`;
   html +=  `<div class="table-responsive-sm">
               <table class="table table-sm table-hover" id="tblSueldos" width="100%">
                  <thead class="table-secondary">
                     <tr class="p-font-msg-08">
                        <th width="5%" class="text-start" rowspan="2">ID</th>
                        <th width="20%" class="text-start" rowspan="2">Centro Trabajo</th>
                        <th width="5%" class="text-end" rowspan="2">Personal</th>
                        <th width="20%" class="text-center" colspan="2">Sueldo C/Timbre</th>
                        <th width="20%" class="text-center" colspan="2">Sueldo S/Timbre</th>
                        <th width="20%" class="text-center" colspan="2">Sueldo Neto</th>
                        <th width="5%" class="text-center" rowspan="2"></th>
                     </tr>
                     <tr class="p-font-msg-08">
                        <th class="text-center">Salario Diario</th>
                        <th class="text-center">Sueldo Mensual</th>
                        <th class="text-center">Salario Diario</th>
                        <th class="text-center">Sueldo Mensual</th>
                        <th class="text-center">Salario Diario</th>
                        <th class="text-center">Sueldo Mensual</th>
                     </tr>
                  </thead>
                  <tbody></tbody>
               </table>
            </div>
            <div id="overlay2" class="overlay"></div>`;
 
   
   if(parseInt(reg.add_sueldo) > 0) {
      botones +=  '<button type="button" class="btn btn-info me-1" btn="btn" onclick="vmAgregarSueldo('+"''"+','+"'N'"+')" >'+
                  '<i class="fa-solid fa-plus me-2"></i>Agregar Sueldo</button>';
   }
   botones +=  '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="cerrarVMSueldos()">'+
               '<i class="fa-solid fa-xmark me-2"></i>Cerrar</button>';
   modalXL('frmPuestos', titulo, html,'formxl_scrollable',botones, 'cerrarVMSueldos()');
   getConsultaSueldosPuesto();
}
//!
function cerrarVMSueldos() {
   tblSueldos.barraDibujada = false;
   closeModalXL();
   recargaPaginadoPrincipal()
}
//!
function getConsultaSueldosPuesto() {
   tblSueldos.setTablaHTML("tblSueldos");
   tblSueldos.setUrl(contexto+"Puestos/sueldosPuestoPag");
   tblSueldos.setRegistrosPagina(10);
   tblSueldos.setColumnas("id_centro_trabajo_plantilla,nombre_centro_trabajo,total_puestos,sueldo_diario_timbre,sueldo_timbre_mensual,"+
                        "sueldo_diario_sintimbre,sueldo_sintimbre_mensual,sueldo_diario,sueldo_mensual,band");
   tblSueldos.setColTipos("text,text,numeroSD,numero,numero,numero,numero,numero,numero,icon");
   tblSueldos.setAlineacion("left,left,right,right,right,right,right,right,right,center");
   let iconos = {
      "col10": {
         "opciones":[
            { "campo_bd": "band_editar", "valor_campo": "1", "icono": "fa-solid fa-pen-to-square fa-sm", "callback": "editarSueldo", "tooltip": "Editar", "tipoicono": "i", "color": "color_blue" },
            { "campo_bd": "band_eliminar", "valor_campo": "1", "icono": "fa-solid fa-trash-can fa-sm", "callback": "eliminarSueldo", "tooltip": "Eliminar", "tipoicono": "i", "color": "color_red" }
         ]
      }
   }
   tblSueldos.setIconos(iconos);
   tblSueldos.fontSize = "0.75rem";
   tblSueldos.setParametros($("#frmSueldoPue").serialize());
   tblSueldos.loadJSON();
}
//!
function vmAgregarSueldo(id_centro_trabajo_plantilla,tipo) {
   let idPuesto = $("#vm_id_puesto_s").val();
   let html = '';
   let botones = '';
   let titulo = (tipo === 'N') ? 'Registro de Sueldo de Puesto':'Edici&oacute;n de Sueldo de Puesto';
   $("#overlay2").show();

   html +=  `<form method="post" class="app-form frm-modal-regSueldo" id="frmRegSueldo" name="frmRegSueldo" novalidate onsubmit="return false">
               <input type="hidden" id="vm_id_centro_trabajo_plantilla" name="vm_id_centro_trabajo_plantilla" value="${id_centro_trabajo_plantilla}">
               <input type="hidden" id="vm_tipo_ctp" name="vm_tipo_ctp" value="${tipo}">
               <input type="hidden" id="vm_id_puesto_ctp" name="vm_id_puesto_ctp" value="${idPuesto}">
               <input type="hidden" id="vm_id_centro_trabajo" name="vm_id_centro_trabajo">
               <input type="hidden" id="vm_id_centro_trabajo_tmp" name="vm_id_centro_trabajo_tmp">
               <input type="hidden" id="vm_contador_valid" value="0">`;
   html +=  `<div class="row mb-2">
               <div class="col-sm-12">
                  <label class="form-label">Centro de Trabajo</label>
                  <div class="input-group">
                     <span class="input-group-text b-r-left bg-danger" onclick="vm_centroTrabajo()" style="height:40px;cursor:pointer">
                        <i class="fa-solid fa-magnifying-glass"></i>
                     </span>
                     <input type="text" class="form-control" id="vm_centro_trabajo" name="vm_centro_trabajo" style="height:40px" required>
                     <div class="invalid-feedback">Centro de trabajo requerido</div>
                  </div>
            	</div>
            </div>`;
    html +=  `<div class="row mb-2">
               <div class="col-sm-4">
                  <label class="form-label">Total de Personal</label>
                  <input type="text" class="form-control text-end" id="vm_total_personal" name="vm_total_personal"
                     onkeypress="return getKeyNumber(event);" maxlength="5" required style="height:40px" value="0">
                  <div class="invalid-feedback">Total de personal requerido</div>
               </div>
               <div class="col-sm-4">
                  <label class="form-label">D&iacute;as C&aacute;lculo Sueldo</label>
                  <div class="form-group" id="divDiasCalculoSueldo">
                     <select class="form-control selectpicker" id="vm_dias_calculo_sueldo" name="vm_dias_calculo_sueldo" required style="width:100%"
                        onchange="validCombos(this.id,'divDiasCalculoSueldo');operacion_dias_calculo_sueldo()">
                        <option value="">[Seleccione una opci&oacute;n]</option>
                        <option value="15.00">15 D&iacute;as</option>
                        <option value="20.00">20 D&iacute;as</option>
                        <option value="30.00">30 D&iacute;as</option>
                     </select>
                     <div class="invalid-feedback">D&iacute;as de c&aacute;lculo sueldo requerido</div>
                  </div>
               </div>
            </div>`;

   html +=  `<div class="row mb-2">
               <div class="col-sm-4">
                  <label class="form-label">Sueldo Mensual C/Timbre</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_sueldo_mensual_ctimbre" name="vm_sueldo_mensual_ctimbre"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" required style="height:40px"
                        onBlur="formateo(this); operacion_sueldo_ctimbre()" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Sueldo mensual C/Timbre requerido</div>
                  </div>
            	</div>
            	<div class="col-sm-4">
                  <label class="form-label">Sueldo Quincenal C/Timbre</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_sueldo_quincenal_ctimbre" name="vm_sueldo_quincenal_ctimbre"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required readonly
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Sueldo quincenal C/Timbre requerido</div>
                  </div>
            	</div>
            	<div class="col-sm-4">
                  <label class="form-label">Salario Diario C/Timbre</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_salario_diario_ctimbre" name="vm_salario_diario_ctimbre"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required readonly
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Salario diario C/Timbre requerido</div>
                  </div>
            	</div>
             </div>`;
   html +=  `<div class="row mb-2">
               <div class="col-sm-4">
                  <label class="form-label">Sueldo Mensual S/Timbre</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_sueldo_mensual_stimbre" name="vm_sueldo_mensual_stimbre"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required
                        onBlur="formateo(this); operacion_sueldo_stimbre()" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Sueldo mensual S/Timbre requerido</div>
                  </div>
            	</div>
            	<div class="col-sm-4">
                  <label class="form-label">Sueldo Quincenal S/Timbre</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_sueldo_quincenal_stimbre" name="vm_sueldo_quincenal_stimbre"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required readonly
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Sueldo quincenal S/Timbre requerido</div>
                  </div>
            	</div>
            	<div class="col-sm-4">
                  <label class="form-label">Salario Diario S/Timbre</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_salario_diario_stimbre" name="vm_salario_diario_stimbre"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required readonly
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Salario diario S/Timbre requerido</div>
                  </div>
            	</div>
             </div>`;
   html +=  `<div class="row mb-2">
               <div class="col-sm-4">
                  <label class="form-label">Imp. Desc. por Falta</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_descuento_xfalta" name="vm_descuento_xfalta"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Imp. Descuento por falta requerido</div>
                  </div>
            	</div>
            	<div class="col-sm-4">
                  <label class="form-label">Imp. Desc. por Falta Justif.</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_descuento_xfalta_justif" name="vm_descuento_xfalta_justif"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Imp. Descuento por falta justif. requerido</div>
                  </div>
            	</div>
            	<div class="col-sm-4">
                  <label class="form-label">Imp. Desc. por Permiso</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_descuento_xpermiso" name="vm_descuento_xpermiso"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Imp. Descuento por permiso requerido</div>
                  </div>
            	</div>
             </div>`;
   html +=  `<div class="row mb-2">
               <div class="col-sm-4">
                  <label class="form-label">Imp. D&iacute;a Festivo 16 Hrs.</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_dia_festivo_16hrs" name="vm_dia_festivo_16hrs"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Imp. d&iacute;a festivo 16 hrs. requerido</div>
                  </div>
            	</div>
               <div class="col-sm-4">
                  <label class="form-label">Imp. D&iacute;a Festivo 12 Hrs.</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_dia_festivo_12hrs" name="vm_dia_festivo_12hrs"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Imp. d&iacute;a festivo 12 hrs. requerido</div>
                  </div>
            	</div>
            	<div class="col-sm-4">
                  <label class="form-label">Imp. D&iacute;a Festivo 8 Hrs.</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_dia_festivo_8hrs" name="vm_dia_festivo_8hrs"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Imp. d&iacute;a festivo 8 hrs. requerido</div>
                  </div>
            	</div>
             </div>`;
   html +=  `<div class="row mb-2">
               <div class="col-sm-4">
                  <label class="form-label">Imp. D&iacute;a Festivo 4 Hrs.</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_dia_festivo_4hrs" name="vm_dia_festivo_4hrs"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Imp. d&iacute;a festivo 4 hrs. requerido</div>
                  </div>
            	</div>
               <div class="col-sm-4">
                  <label class="form-label">Imp. D&iacute;a Festivo 2 Hrs.</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_dia_festivo_2hrs" name="vm_dia_festivo_2hrs"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Imp. d&iacute;a festivo 2 hrs. requerido</div>
                  </div>
            	</div>
               <div class="col-sm-4">
                  <label class="form-label">Imp. Desc. por Incapacidad</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_monto_xincapacidad" name="vm_monto_xincapacidad"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Imp. descuento por incapacidad requerido</div>
                  </div>
            	</div>
             </div>`;
   html +=  `<div class="row mb-2">
               <div class="col-sm-4">
                  <label class="form-label">Imp. por Doblete</label>
                  <div class="input-group">
                     <span class="input-group-text btn-info"><i class="fa-solid fa-dollar-sign"></i></span>
                     <input type="text" class="form-control text-end" id="vm_monto_xdoblete" name="vm_monto_xdoblete"
                        onkeypress="return getKeyNumberDecimal(event);" maxlength="20" style="height:40px" required
                        onBlur="formateo(this)" onFocus="sinformateo(this)" value="0.00">
                     <div class="invalid-feedback">Importe por doblete requerido</div>
                  </div>
            	</div>
             </div>`;

   html +=  `</form>
            <div id="overlay3" class="overlay"></div>`;

   botones +=  '<button type="button" id="bt_guardar_sal_pue" class="btn btn-info me-1" btn="btn" onclick="validacionRegSueldo()">'+
               '<i class="fa-solid fa-floppy-disk me-2"></i>Guardar</button>';
   botones +=  '<button type="button" class="btn btn-secondary me-1" btn="btn" onclick="limpiarRegSueldo()">'+
               '<i class="fa-solid fa-eraser me-2"></i>Limpiar</button>';
   botones +=  '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" onclick="cerrarVMRegSueldo()">'+
               '<i class="fa-solid fa-xmark me-2"></i>Cerrar</button>';

   modalLG('frmPuestos', titulo, html, 'formlg_scrollable', botones, 'cerrarVMRegSueldo()');
   $(".selectpicker").select2({dropdownParent: $("#vModalLG")});
}
//!
function cerrarVMRegSueldo() {
   $("#overlay2").hide();
   closeModalLG();
   getConsultaSueldosPuesto();
}
//!
function vm_centroTrabajo() {
   let html = "";
   let botones = "";
   let titulo = 'Centros de Trabajo';
   $("#overlay3").show();

   html +=  '<form method="post" autocomplete="off" onsubmit="return false">'+
            '  <div class="row">' +
            '     <div class="col-sm-12">' +
            '		   <div class="form-floating mb-2">'+
            '           <input type="text" class="form-control" id="vm_buscar_centro_trabajo" name="vm_buscar_centro_trabajo" ' +
            '                  placeholder="Buscar por Nombre / Dirección" onkeypress="keyEventCentroTrab(event)">'+
            '           <label>'+
            '              <i class="fa-solid fa-magnifying-glass feather-sm text-dark fill-white me-2"></i>'+
            '              <span class="border-start border-light-secondary ps-3">Buscar por Nombre / Direcci&oacute;n</span>'+
            '           </label>'+
            '        </div>'+
            '		</div>'+
            '  </div>'+
            '</form>'+
            '<hr style="margin-top:0">';
   html +=  '<div class="table-responsive-sm">'+
            '  <table class="table table-sm table-hover" id="tblCentrosTrab" width="100%">'+
            '     <thead class="table-secondary">'+
            '        <tr class="p-font-msg-08">'+
            '           <th width="5%" class="text-start">ID</th>'+
            '           <th width="30%" class="text-start">Nombre</th>'+
            '           <th width="30%" class="text-start">Dirección</th>'+
            '           <th width="1%" class="text-center"></th>'+
            '        </tr>'+
            '     </thead>'+
            '     <tbody></tbody>'+
            '  </table>'+
            '</div>';

   botones +=  '<button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="cerrarvmCTrabajo()">'+
               '<i class="fa-solid fa-xmark me-2"></i>Cerrar</button>';
   modal('frmPuestos', titulo, html, 'formdefault_scrollable', botones, 'cerrarvmCTrabajo()');
   getConsultaCentrosTrabajos();
}
//!
function cerrarvmCTrabajo() {
   tblCentroTrab.barraDibujada = false;
   $("#overlay3").hide();
   closeModal();
}
//!
function getConsultaCentrosTrabajos() {
   let idPuesto = $("#vm_id_puesto_s").val();
   tblCentroTrab.setTablaHTML("tblCentrosTrab");
   tblCentroTrab.setUrl(contexto+"Puestos/getCentrosTrabPag");
   tblCentroTrab.setRegistrosPagina(8);
   tblCentroTrab.setColumnas("id_centro_trabajo,nombre_c_t,direccion,band");
   tblCentroTrab.setColTipos("text,text,text,icon");
   tblCentroTrab.setAlineacion("left,left,left,center");
   let iconos = {
      "col4": {
         "opciones": [
            { "campo_bd": "band", "valor_campo": "1", "icono": "fa-solid fa-circle-check fa-sm", "callback": "add_centroTrab", "tooltip": "Seleccionar Centro", "tipoicono": "i", "color": "color_green" }
         ]
      }
   }
   tblCentroTrab.setIconos(iconos);
   tblCentroTrab.fontSize = "0.7rem";
   tblCentroTrab.parametros = "id_puesto="+idPuesto+"&buscardor_centro_trabajo="+$("#vm_buscar_centro_trabajo").val();
   tblCentroTrab.loadJSON();
}
//!
function add_centroTrab(reg) {
   $("#vm_id_centro_trabajo").val(reg.id_centro_trabajo);
   $("#vm_centro_trabajo").val(reg.nombre_c_t);
   $("#vm_centro_trabajo").prop("readonly", true);
   cerrarvmCTrabajo();
}
//!
function keyEventCentroTrab(event) {
   var tecla = (event.all) ? window.event : event.which;
   if (tecla === 13) {
      getConsultaCentrosTrabajos();
   }
   else {
      return false;
   }
}
//!
function operacion_sueldo_ctimbre() {
   let tipoCalculo = $("#vm_dias_calculo_sueldo").val();
   let divisor = (tipoCalculo == "") ? 0:tipoCalculo;
   if(parseInt(divisor) > 0) {
      let sueldoMensual = (unFormatNumber($("#vm_sueldo_mensual_ctimbre").val()) == '') ? 0 : unFormatNumber($("#vm_sueldo_mensual_ctimbre").val());
      let sueldoQuincenal = (parseFloat(sueldoMensual) / 2).toFixed(2);
      let salarioDiario = (parseFloat(sueldoMensual) / parseInt(divisor)).toFixed(2);
      $("#vm_sueldo_quincenal_ctimbre").val(formatNumber(sueldoQuincenal));
      $("#vm_salario_diario_ctimbre").val(formatNumber(salarioDiario));
   }
}
//!
function operacion_sueldo_stimbre() {
   let tipoCalculo = $("#vm_dias_calculo_sueldo").val();
   let divisor = (tipoCalculo == "") ? 0:tipoCalculo;
   if(parseInt(divisor) > 0) {
      let sueldoMensual = (unFormatNumber($("#vm_sueldo_mensual_stimbre").val()) == '') ? 0 : unFormatNumber($("#vm_sueldo_mensual_stimbre").val());
      let sueldoQuincenal = (parseFloat(sueldoMensual) / 2).toFixed(2);
      let salarioDiario = (parseFloat(sueldoMensual) / parseInt(divisor)).toFixed(2);
      $("#vm_sueldo_quincenal_stimbre").val(formatNumber(sueldoQuincenal));
      $("#vm_salario_diario_stimbre").val(formatNumber(salarioDiario));
   }
}
//!
const operacion_dias_calculo_sueldo = () => {
   operacion_sueldo_ctimbre();
   operacion_sueldo_stimbre();
}
//!
function editarSueldo(reg) {
   vmAgregarSueldo(reg.id_centro_trabajo_plantilla,'E');
   $("#vm_id_centro_trabajo").val(reg.id_centro_trabajo);
   $("#vm_id_centro_trabajo_tmp").val(reg.id_centro_trabajo);
   $("#vm_centro_trabajo").val(reg.nombre_centro_trabajo);
   $("#vm_centro_trabajo").prop('readonly',true);
   $("#vm_total_personal").val(reg.total_puestos);
   if(parseFloat(reg.dias_calculo_sueldo) > 0) {
      $("#vm_dias_calculo_sueldo").val(reg.dias_calculo_sueldo).trigger('change');
   }
   else {
      $("#vm_dias_calculo_sueldo").val('').trigger('change');
   }
   $("#vm_sueldo_mensual_ctimbre").val(formatNumber(reg.sueldo_timbre_mensual));
   $("#vm_sueldo_quincenal_ctimbre").val(formatNumber(reg.sueldo_timbre_quincenal));
   $("#vm_salario_diario_ctimbre").val(formatNumber(reg.sueldo_diario_timbre));
   $("#vm_sueldo_mensual_stimbre").val(formatNumber(reg.sueldo_sintimbre_mensual));
   $("#vm_sueldo_quincenal_stimbre").val(formatNumber(reg.sueldo_sintimbre_quincenal));
   $("#vm_salario_diario_stimbre").val(formatNumber(reg.sueldo_diario_sintimbre));
   $("#vm_descuento_xfalta").val(formatNumber(reg.descuento_xfalta));
   $("#vm_descuento_xfalta_justif").val(formatNumber(reg.descuento_xfalta_justificada));
   $("#vm_descuento_xpermiso").val(formatNumber(reg.descuento_permiso_sin_sueldo));
   $("#vm_dia_festivo_16hrs").val(formatNumber(reg.dia_festivo_16horas));
   $("#vm_dia_festivo_12hrs").val(formatNumber(reg.dia_festivo_12horas));
   $("#vm_dia_festivo_8hrs").val(formatNumber(reg.dia_festivo_8horas));
   $("#vm_dia_festivo_4hrs").val(formatNumber(reg.dia_festivo_4horas));
   $("#vm_dia_festivo_2hrs").val(formatNumber(reg.dia_festivo_2horas));
   $("#vm_monto_xincapacidad").val(formatNumber(reg.descuento_incapacidad));
   $("#vm_monto_xdoblete").val(formatNumber(reg.monto_doblete));
}
//!
function limpiarRegSueldo() {
   $("#vm_contador_valid").val(0);
   $("#frmRegSueldo").removeClass('frm-modal-regSueldo was-validated').addClass('frm-modal-regSueldo');
   if($("#vm_tipo_ctp").val() === 'N') {
      $("#vm_id_centro_trabajo_tmp").val('');
   }
   $("#vm_id_centro_trabajo").val('');
   $("#vm_centro_trabajo").val('');
   $("#vm_centro_trabajo").prop('readonly',false);
   $("#vm_total_personal").val('0');
   $("#vm_dias_calculo_sueldo").val('').trigger('change');
   $("#vm_sueldo_mensual_ctimbre,#vm_sueldo_quincenal_ctimbre,#vm_salario_diario_ctimbre").val('0.00');
   $("#vm_sueldo_mensual_stimbre,#vm_sueldo_quincenal_stimbre,#vm_salario_diario_stimbre").val('0.00');
   $("#vm_descuento_xfalta,#vm_descuento_xfalta_justif,#vm_descuento_xpermiso").val('0.00');
   $("#vm_dia_festivo_16hrs,#vm_dia_festivo_12hrs,#vm_dia_festivo_8hrs,#vm_dia_festivo_4hrs,#vm_dia_festivo_2hrs").val('0.00');
   $("#vm_monto_xincapacidad,#vm_monto_xdoblete").val('0.00');
}
//!
function validacionRegSueldo() {
   $("#vm_contador_valid").val(1);
   let contador = 0;
   // TODO: Obtener todos los formularios a los que queremos aplicar estilos de validación
   let forms = document.querySelectorAll('.frm-modal-regSueldo');
   // TODO: Bucle sobre ellos y evitar la presentación
   Array.prototype.slice.call(forms)
   .forEach(function (form) {
      if (!form.checkValidity()) {
         contador++;
         if($("#vm_dias_calculo_sueldo").val() === "") {
            $("#divDiasCalculoSueldo").removeClass("has-valid").addClass("has-error");
         }
         else {
            $("#divDiasCalculoSueldo").removeClass("has-error").addClass("has-valid");
         }
      }
      form.classList.add('was-validated');
   });
   
   if(contador === 0) {
      $("#divDiasCalculoSueldo").removeClass("has-error").addClass("has-valid");
      confirmarcionRegSueldo();
   }
}
//!
function validacionRegistroSueldo() {
   let msg = "";

   if ($("#vm_id_centro_trabajo").val() === '') {
      msg += "<li>Seleccionar el centro de trabajo</li>";
   }
   if (parseInt($("#vm_total_personal").val()) <= 0) {
      msg += "<li>El total de persona debe ser mayor a 0</li>";
   }
   if (parseFloat($("#vm_sueldo_mensual_ctimbre").val()) <= 0) {
      msg += "<li>El sueldo mensual con timbre debe ser mayor a 0</li>";
   }
   if (parseFloat($("#vm_sueldo_quincenal_ctimbre").val()) <= 0) {
      msg += "<li>El sueldo quincenal con timbre debe ser mayor a 0</li>";
   }
   if (parseFloat($("#vm_salario_diario_ctimbre").val()) <= 0) {
      msg += "<li>El salario diario con timbre debe ser mayor a 0</li>";
   }
   if (parseFloat($("#vm_sueldo_mensual_stimbre").val()) <= 0) {
      msg += "<li>El sueldo mensual sin timbre debe ser mayor a 0</li>";
   }
   if (parseFloat($("#vm_sueldo_quincenal_stimbre").val()) <= 0) {
      msg += "<li>El sueldo quincenal sin timbre debe ser mayor a 0</li>";
   }
   if (parseFloat($("#vm_salario_diario_stimbre").val()) <= 0) {
      msg += "<li>El salario diario sin timbre debe ser mayor a 0</li>";
   }
	  
   return msg;
}
//!
function confirmarcionRegSueldo() {
	let msj = validacionRegistroSueldo();
   if(msj.length > 0) {
      Swal.fire({
			title: 'Validación',
			html: "<ul class='p-font-msg-1-2 text-dark'>"+msj+"</ul>",
			icon: 'warning',
			showDenyButton: true,
			denyButtonText: "Aceptar",
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
            guardarSueldoPuesto();
			}
		});
	}
}
//!
function guardarSueldoPuesto() {
   $.ajax({
      type: 'post',
      url: contexto+'Puestos/guardarSueldoPuesto',
      async: true,
      processData: false,
      contentType: false,
      dataType:"JSON",
      data: new FormData($("#frmRegSueldo")[0]),
      beforeSend(xhr) {
         $("#overlayprincipal").show();
         $("#bt_guardar_sal_pue").html('<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Guardar');
         $('button[btn="btn"]').prop('disabled', true);
         target = document.getElementById('frmPuestos');
         spinner = new Spinner().spin(target);
      },
      success: function (data) {
         if (data.respuesta === false) {
            if(parseInt(data.valid) > 0) {
               Swal.fire({
                  title: 'Validación',
                  html: '<p class="p-font-msg-1-2 text-dark">'+data.mensaje+'</p>',
                  icon: 'warning',
                  showDenyButton: true,
                  denyButtonText: 'Aceptar',
                  showConfirmButton: false
               });
            }
            else {
               Swal.fire({
                  title: 'HA OCURRIDO UN ERROR!',
                  html: '<p class="p-font-msg-1-2 text-danger">'+data.mensaje+'</p>',
                  icon: 'error',
                  showDenyButton: true,
                  denyButtonText: 'Aceptar',
                  showConfirmButton: false
               });
            }
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
                  if($("#vm_tipo_ctp").val() === 'N') {
                     limpiarRegSueldo();
                  }
                  else {
                     cerrarVMRegSueldo();
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
            denyButtonText: "Aceptar"
         });
      },
      complete(xhr, status) {
         $('button[btn="btn"]').prop('disabled',false);
         $("#bt_guardar_sal_pue").html('<i class="fa-solid fa-floppy-disk me-2"></i>Guardar');
         spinner.stop();
         $("#overlayprincipal").hide();
      }
   });
}
//!
function eliminarSueldo(reg) {
	let titulo = "\u{BF}Confirma ELIMINAR el sueldo mensual neto <span class='p-font-weight'>"+formatNumber(reg.sueldo_mensual)+"</span>?";
   Swal.fire({
     title: 'Confirmaci&oacute;n',
     html: '<p class="p-font-msg-1-2 text-dark">'+titulo+'</p>',
     icon: 'warning',
     showCancelButton: true,
     cancelButtonText: 'Cancelar',
     cancelButtonColor: '#d33',
     confirmButtonColor: '#3085d6',
     confirmButtonText: 'Si, confirmar',
   }).then((result) => {
     if (result.isConfirmed) {
         eliminacionSueldoPuesto(reg.id_centro_trabajo_plantilla);
     }
   });
}
//!
function eliminacionSueldoPuesto(id_centro_trabajo_plantilla) {
	$.ajax({
	   type: 'post',
	   url: contexto+'Puestos/eliminarSueldoPuesto',
	   async: true,
       dataType: 'json',
	   data: 'id_centro_trabajo_plantilla='+id_centro_trabajo_plantilla,
	   beforeSend(xhr) {
         $('button[btn="btn"]').prop('disabled', true);
         $("#overlayprincipal").show();
		   target = document.getElementById('frmPuestos');
		   spinner = new Spinner().spin(target);
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
            Toast.fire({
               icon: 'success',
               title: data.mensaje
            });
            getConsultaSueldosPuesto();
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
		   spinner.stop();
		   $("#overlayprincipal").hide();
	   }
	});
}