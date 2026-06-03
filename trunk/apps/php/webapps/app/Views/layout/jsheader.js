
$(document).ready(function() {
	manuales();
});
//!
function manuales() {
	let contador = 0;
	$.ajax({
		type: 'post',
		url: 'Inicio/manuales',
		async: true,
		dataType:"JSON",
		success: function (data) {
			$.each(data.manuales, function(index,item) {
				if(parseInt(item[0]) > 0) {
					let mensaje = '<a href="javascript:void(0)" class="message-item d-flex align-items-center border-bottom px-3 py-2" '+
                                    '   onclick="MdlManuales('+"'"+item[1]+"'"+','+"'"+item[2]+"'"+')">'+
                                    '  <span class="btn btn-light-info text-info btn-circle">'+
                                    '     <i class="fa-solid fa-file-pdf fa-lg fill-white"></i>'+
                                    '  </span>'+
                                    '  <div class="w-75 d-inline-block v-middle ps-3">'+
                                    '     <h5 class="message-title mb-0 mt-1 fs-3 text-muted p-font-weight-500">'+item[1]+'</h5>'+
                                    '  </div>'+
                                    '</a>';

					$("#dmanualesContent").append(mensaje);
					contador++;
				}
			});

			if(parseInt(contador) === 0)
				$("#manualNotif").hide();
			else
				$("#manualNotif").show();
		}
	});
}
//!
function MdlManuales(titulo, nameArchivo) {
	$.jAlert({
		'title': titulo,
		'theme':'green',
		'size':'lg',
		'iframeHeight':'500px',
		'iframe': contexto+'/manuales/'+nameArchivo
	});
}