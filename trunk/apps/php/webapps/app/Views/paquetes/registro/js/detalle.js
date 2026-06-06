const detalle = (reg) => {
   let html = '';
   let botones = '';
   const titulo = 'Detalle de la Notificaci&oacute;n';
   //
   html +=  `<div class="row">
               <div class="col-sm-12">
                  <div class="card-body">
                     <ol class="list-group">
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                           <div class="ms-2 me-auto col-sm-4"><div class="fw-bold">- Num. Oficio</div>&nbsp;&nbsp;&nbsp;${reg.num_oficio}</div>
                           <div class="ms-2 me-auto col-sm-4"><div class="fw-bold">- Fecha Oficio</div>&nbsp;&nbsp;&nbsp;${reg.foficio}</div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                           <div class="ms-2 me-auto col-sm-12"><div class="fw-bold">- Domicilio</div>&nbsp;&nbsp;&nbsp;${reg.domicilio}</div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                           <div class="ms-2 me-auto col-sm-12"><div class="fw-bold">- Referencia de Ubicaci&oacute;n</div>&nbsp;&nbsp;&nbsp;${reg.referencia_ubicacion}</div>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-start">
                           <div class="ms-2 me-auto col-sm-4"><div class="fw-bold">- Estatus</div>&nbsp;&nbsp;&nbsp;${reg.nombre_estatus_notificacion}</div>`;
   if(reg.fnotificado != '') {
      html +=  `           <div class="ms-2 me-auto col-sm-4"><div class="fw-bold">- Fecha Notificado</div>&nbsp;&nbsp;&nbsp;${reg.fnotificado}</div>`;
   }
   if(reg.id_paquete_notificacion != '') {
      html +=  `           <div class="ms-2 me-auto col-sm-4"><div class="fw-bold">- No. Paquete</div>&nbsp;&nbsp;&nbsp;${reg.id_paquete_notificacion}</div>`;
   }
   html +=  `           </li>
                     </ol>
                  </div>
               </div>
            </div>`

   botones +=  `<button type="button" class="btn btn-danger" data-bs-dismiss="modal" btn="btn" id="bt_cerrar_detalle">
                  <i class="fa-solid fa-xmark me-2"></i>Cerrar
               </button>`;
   modalLG('frmPaquetes', titulo, html, 'formlg_scrollable', botones, 'cerrarVMDetalle()');
   //
   $("#bt_cerrar_detalle").on("click", function () {
      cerrarVMDetalle();
   });
}
//!
const cerrarVMDetalle = () => {
   closeModalLG();
}