const detalle = (reg) => {
   $('.tooltip_icon_pag').tooltip('hide');
   let html = '';
   let botones = '';
   const titulo = 'Detalle de la Notificaci&oacute;n';
   //
   html +=  `<div class="row">
               <div class="col-sm-12">
                  <div class="card-body">
                     <ol class="list-group">
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                           <div class="ms-2 me-auto col-sm-4"><div class="fw-bold">- Num. Orden</div>&nbsp;&nbsp;&nbsp;${reg.num_orden}</div>
                           <div class="ms-2 me-auto col-sm-4"><div class="fw-bold">- Num. Oficio</div>&nbsp;&nbsp;&nbsp;${reg.num_oficio}</div>
                           <div class="ms-2 me-auto col-sm-4"><div class="fw-bold">- Fecha Oficio</div>&nbsp;&nbsp;&nbsp;${reg.foficio}</div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                           <div class="ms-2 me-auto col-sm-3"><div class="fw-bold">- ID Insumo</div>&nbsp;&nbsp;&nbsp;${reg.id_insumo}</div>
                           <div class="ms-2 me-auto col-sm-3"><div class="fw-bold">- ID Bloque</div>&nbsp;&nbsp;&nbsp;${reg.id_bloque}</div>
                           <div class="ms-2 me-auto col-sm-3"><div class="fw-bold">- Imp. Presuntiva</div>&nbsp;&nbsp;&nbsp;${formatNumber(reg.monto_presuntiva)}</div>
                           <div class="ms-2 me-auto col-sm-3"><div class="fw-bold">- Prioridad</div>&nbsp;&nbsp;&nbsp;${reg.nombre_prioridad.toUpperCase()}</div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                           <div class="ms-2 me-auto col-sm-12"><div class="fw-bold">- Domicilio</div>&nbsp;&nbsp;&nbsp;${reg.domicilio.toUpperCase()}</div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                           <div class="ms-2 me-auto col-sm-12"><div class="fw-bold">- Referencia de Ubicaci&oacute;n</div>&nbsp;&nbsp;&nbsp;${reg.referencia_ubicacion.toUpperCase()}</div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                           <div class="ms-2 me-auto col-sm-4"><div class="fw-bold">- Estatus</div>&nbsp;&nbsp;&nbsp;${reg.nombre_estatus_notificacion.toUpperCase()}</div>`;
   if(reg.id_paquete != '') {
      html +=  `           <div class="ms-2 me-auto col-sm-4"><div class="fw-bold">- No. Paquete</div>&nbsp;&nbsp;&nbsp;${reg.id_paquete}</div>`;
   }
   if(reg.fnotificado != '') {
      html +=  `           <div class="ms-2 me-auto col-sm-4"><div class="fw-bold">- Fecha Notificaci&oacute;n</div>&nbsp;&nbsp;&nbsp;${reg.fnotificado}</div>`;
   }
   html +=  `           </li>
                        <li class="list-group-item d-flex justify-content-between align-items-start">`;
   if(reg.notificador != '') {
      html +=  `           <div class="ms-2 me-auto col-sm-12"><div class="fw-bold">- Notificador</div>&nbsp;&nbsp;&nbsp;${reg.notificador.toUpperCase()}</div>`;
   }                     
   html +=  `           </li>
                     </ol>
                  </div>
               </div>
            </div>
            <div class="overlay" id="overlay2"></div>`;

   if(parseInt(reg.icon_historial_paq) > 0) {
      botones +=  `<button type="button" class="btn btn-info" btn="btn" id="bt_historial_paq">
                     <i class="fa-solid fa-list-check me-2"></i>Historial
                  </button>`;
   }
   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" id="bt_cerrar_detalle">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;
   modalLG('frmNotificaciones', titulo, html, 'formlg_scrollable', botones, 'cerrarVMDetalle()');
   //
   $("#bt_historial_paq").on("click", function () {
      vmHistorialPaquetes(reg);
   });
   //
   $("#bt_cerrar_detalle").on("click", function () {
      cerrarVMDetalle();
   });
}
//!
const cerrarVMDetalle = () => {
   closeModalLG();
}
//!
const vmHistorialPaquetes = (reg) => {
   let html = '';
   let botones = '';
   const titulo = 'Historial de la Notificaci&oacute;n en Paquete';
   $("#overlay2").show();
   //
   html +=  `<div class="row mb-1">
               <div class="col-sm-3">
                  <figure>
                     <blockquote class="blockquote">
                        <p class="p-font-weight-500 p-font-msg-09">${reg.num_orden}</p>
                     </blockquote>
                     <figcaption class="blockquote-footer fw-bold">Num. Orden</figcaption>
                  </figure>
               </div>
               <div class="col-sm-3">
                  <figure>
                     <blockquote class="blockquote">
                        <p class="p-font-weight-500 p-font-msg-09">${reg.foficio}</p>
                     </blockquote>
                     <figcaption class="blockquote-footer fw-bold">Fecha Oficio</figcaption>
                  </figure>
               </div>
               <div class="col-sm-6">
                  <figure>
                     <blockquote class="blockquote">
                        <p class="p-font-weight-500 p-font-msg-09">${reg.domicilio.toUpperCase()}</p>
                     </blockquote>
                     <figcaption class="blockquote-footer fw-bold">Domicilio</figcaption>
                  </figure>
               </div>
            </div>
            <hr style="margin-top:0">`;
   html +=  `<div class="table-responsive-sm">
               <table class="table table-sm table-hover" id="tblHistorialNotPaq" width="100%">
                  <thead class="table-secondary">
                     <tr class="p-font-msg-08">
                        <th width="6%"  class="text-start">ID Paquete</th>
                        <th width="12%" class="text-center">Fecha Programda</th>
                        <th width="20%" class="text-start">Notificador</th>
                        <th width="10%" class="text-center">Estatus</th>
                     </tr>
                  </thead>
                  <tbody></tbody>
               </table>
            </div>`;

   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal"  btn="btn" onclick="cerrarVMHistorialPaquete()">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
                </button>`;

   modalLG2('frmNotificaciones',titulo,html,'formlg_scrollable_center',botones,'cerrarVMHistorialPaquete()');
   getConsultaHistorialPaqPag(reg.id_notificacion);
}
//!
const cerrarVMHistorialPaquete = () => {
   tblHistorial.barraDibujada = false;
   $("#overlay2").hide();
   closeModalLG2();
}
//!
const getConsultaHistorialPaqPag = (id_notificacion) => {
   tblHistorial.setTablaHTML("tblHistorialNotPaq");
   tblHistorial.setUrl(contexto+nameController+"/historialNotificacionPackagesPag");
   tblHistorial.setRegistrosPagina(8);
   tblHistorial.setColumnas("id_paquete,fprogramada,notificador,estatus_npaq");
   tblHistorial.setColTipos("text,text,textHTML,textHTML");
   tblHistorial.setAlineacion("left,center,left,center");
   tblHistorial.fontSize = '0.8rem';
   tblHistorial.parametros = "id_notificacion="+id_notificacion;
   tblHistorial.loadJSON();
}