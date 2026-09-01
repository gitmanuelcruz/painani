<?php
namespace App\Controllers;
use App\Models\MPaquetesRegistro;
use App\Models\MServicios;
use ZipArchive;

class PaquetesRegistro extends BaseController
{
	function __construct() {
		$this->Modelo = new MPaquetesRegistro();
		$this->MServicios = new MServicios();
      helper('date');
	}
   //
	public function index() {
		if ($this->session->get("logueado") != true) {
         return view('errors/message_session');
		}
		else {
			$usuario = $this->session->get("usuario");
         $validarModulo = $this->utilerias->getValidaPrivilegio($usuario,"REG_PAQUETE","MODULO");
         if($validarModulo > 0) {
            $data['usuario'] = $usuario;
				$data['data_user'] = $this->utilerias->getDatosSession();
            $data['titulo'] = "Registro";
            $data['titulo2'] = "Registro de Paquetes";
            $data['btn_nuevo'] = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_NVO_PAQUETE","PRIVILEGIO");
            $data['btn_inf_excel_gral']  = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_INFOGRALEXCEL_NOTPAQUETE","PRIVILEGIO");
            $fechaMes = $this->utilerias->getDayInicioTermino("yyyy-mm-dd");
            $data['fecha_inicial'] = $fechaMes["fecha_inicial"];
            $data['fecha_actual']  = $fechaMes["fecha_actual"];
				return view('paquetes/registro/list', $data);
         }
         else {
            $message = array(
               'data_user' => $this->utilerias->getDatosSession(),
               'title' => 'VALIDACI&Oacute;N DE PRIVILEGIO DE M&Oacute;DULO',
               'detalle' => 'SIN PRIVILEGIOS PARA ACCEDER AL M&Oacute;DULO DE <b>REGISTRO DE PAQUETES</b>');
				return view('errors/message_error', $message);
         }
		}
	}
	//
	public function paquetesPag() {
      $idNumOficio  = $this->request->getPost("txt_id_num_oficio");
		$fechaProgramada = $this->request->getPost("txt_fecha_programada");
		$fechaApertura = $this->request->getPost("txt_fecha_apertura");
      $fechaCierre   = $this->request->getPost("txt_fecha_cierre");
      $notificador   = $this->request->getPost("txt_nombre_notificador");
      $idTipoFecha   = $this->request->getPost("id_tipo_fecha");
		$usuario 	   = $this->session->get("usuario");
		$iconAbrir     = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_INICIAR_PAQUETE","PRIVILEGIO");
      $iconCerrar    = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_CERRAR_PAQUETE","PRIVILEGIO");
      $iconEditar    = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_EDI_PAQUETE","PRIVILEGIO");
		$iconEliminar  = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_ELIM_PAQUETE","PRIVILEGIO");
      $iconInforme   = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_INFOPDF_PAQUETE","PRIVILEGIO");
		$pagina        = 0;
		$resultados    = 0;

		if (!empty($this->request->getPost("pagina")))
			$pagina = $this->request->getPost("pagina");
		if (!empty($this->request->getPost("resultados")))
			$resultados = $this->request->getPost("resultados");

		$sql = $this->Modelo->getPaquetesPag(
         $idNumOficio,$fechaProgramada,$fechaApertura,$fechaCierre,$notificador,$idTipoFecha,$iconAbrir,
         $iconCerrar,$iconEditar,$iconEliminar,$iconInforme);
		$results = $this->utilerias->loadJSON($sql,$pagina,$resultados);

		return $this->response->setJSON($results);
	}
   //
   public function notificacionesAsigPag() {
      $idPaquete  = $this->request->getPost("id_paquete");
		$pagina     = 0;
		$resultados = 0;

		if (!empty($this->request->getPost("pagina")))
			$pagina = $this->request->getPost("pagina");
		if (!empty($this->request->getPost("resultados")))
			$resultados = $this->request->getPost("resultados");

		$sql = $this->Modelo->getNotificacionesxPaquetePag($idPaquete,0);
		$results = $this->utilerias->loadJSON($sql,$pagina,$resultados);

		return $this->response->setJSON($results);
	}
   //
   public function notificacionesNoEntregadosPag() {
      $idPaquete  = $this->request->getPost("id_paquete");
		$pagina     = 0;
		$resultados = 0;

		if (!empty($this->request->getPost("pagina")))
			$pagina = $this->request->getPost("pagina");
		if (!empty($this->request->getPost("resultados")))
			$resultados = $this->request->getPost("resultados");

		$sql = $this->Modelo->getNotificacionesxPaquetePag($idPaquete,2);
		$results = $this->utilerias->loadJSON($sql,$pagina,$resultados);

		return $this->response->setJSON($results);
	}
   //
   public function notificacionesAplicadas() {
      $idPaquete = $this->request->getPost("id_paquete");
      $result = array(
         'listNotificaciones'=> $this->Modelo->getNotificacionesAplicadas($idPaquete,1)->getResult()
      );
      return $this->response->setJSON($result);    
   }
   //
   public function soportesNotificacionAsigPag() {
      $idPaquete = $this->request->getPost("id_paquete");
      $idPaqueteNotificacion = $this->request->getPost("id_paquete_notificacion");
      $idNotificacion = $this->request->getPost("id_notificacion");
		$pagina     = 0;
		$resultados = 0;

		if (!empty($this->request->getPost("pagina")))
			$pagina = $this->request->getPost("pagina");
		if (!empty($this->request->getPost("resultados")))
			$resultados = $this->request->getPost("resultados");

		$sql = $this->Modelo->getSoporteNotificacionAsigPag($idPaquete,$idPaqueteNotificacion,$idNotificacion);
		$results = $this->utilerias->loadJSON($sql,$pagina,$resultados);

		return $this->response->setJSON($results);
	}
   //
   public function soportesNotificacionAsig() {
      $idPaquete = $this->request->getPost("id_paquete");
      $idPaqueteNotificacion = $this->request->getPost("id_paquete_notificacion");
      $idNotificacion = $this->request->getPost("id_notificacion");
      $result = array(
         'listSoporte'=> $this->Modelo->getSoporteNotificacionAsig($idPaquete,$idPaqueteNotificacion,$idNotificacion)->getResult()
      );
      return $this->response->setJSON($result);    
   }
   //
   public function descargarSoporte() {
      $idPaquete = $this->request->getPost("id_paquete");
      $idPaqueteNotificacion = $this->request->getPost("id_paquete_notificacion");
      $idNotificacion = $this->request->getPost("id_notificacion");
      $usuario = $this->session->get("usuario");
      $ip      = $this->session->get("ip");
      $darchivosDet  = $this->Modelo->getSoporteNotificacionAsig($idPaquete,$idPaqueteNotificacion,$idNotificacion);
      $totalArchivo = $darchivosDet->getNumRows();
      $caracteres = array('/','*',' ');
      $caracteresNew = array('_','_','_');
      $fileGenerado = "";
      //
      if((int)$totalArchivo > 1) {
         $fileGenerado = "SOPORTE_OFICIOS_".$totalArchivo.".zip";
         $zip = new ZipArchive;
         $zip->open($fileGenerado, ZipArchive::CREATE);
         foreach ($darchivosDet->getResult() as $keyNumFile) {
            $carpeta = str_replace($caracteres,$caracteresNew,trim($keyNumFile->num_orden));
            $nombreEnZip = $carpeta."/".basename($keyNumFile->nombre_original.".".$keyNumFile->extension);
            $file = $keyNumFile->ruta_soporte;
            $zip->addFile($file,$nombreEnZip);
         }
         $zip->close();
      }
      else {
         foreach ($darchivosDet->getResult() as $keyNumFile) {
            $fileGenerado = $keyNumFile->ruta_soporte;
         }
      }
      //
      header('Content-Description: File Transfer');
      header('Content-Type: application/octet-stream');
      header('Content-Disposition: attachment; filename="'.basename($fileGenerado).'"');
      header('Content-Transfer-Encoding: binary');
      header('Expires: 0');
      header('Cache-Control: must-revalidate');
      header('Pragma: public');
      header('Content-Length: ' . filesize($fileGenerado));
      header('Access-Control-Expose-Headers: Content-Disposition');
      readfile($fileGenerado);
      if((int)$totalArchivo > 1) {
         $this->utilerias->removeFile($fileGenerado);
      }
      exit;
   }
	// TODO: Proceso de registro o edicion
   public function getComboRegistro() {
      $result = array(
         'userNotificadores'=> $this->Modelo->getNotificadores()->getResult()
      );
      return $this->response->setJSON($result);    
   }
   //
   public function getListOficios() {
      $idPaquete   = $this->request->getPost("id_paquete");
      $fechaProgramada   = $this->request->getPost("fecha_programada");
      $result = array(
         'listOficios'=> $this->Modelo->getListOficiosNotificacion($idPaquete,$fechaProgramada)->getResult()
      );
      return $this->response->setJSON($result);    
   }
	//
   public function guardarPaquete() {
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $idPaquete = $this->request->getPost("vm_id_paquete");
         $fechaProgramacion = $this->request->getPost("vm_fecha_programada");
         $idUserNotificador = $this->request->getPost("vm_id_usuario_notificador");
         $idsNotificaciones = $this->request->getPost("vm_listado");
         $usuario = $this->session->get("usuario");
         $ip      = $this->session->get("ip");
         $idEstatus = "ASIGNADO";
         $msjExist = "";
         $msjValid = "";
         $dataPaq = $this->Modelo->getDatosPaquetexNotificador($idUserNotificador,$fechaProgramacion);
         $dataOficios = $this->Modelo->getDatosNotificacion($idsNotificaciones,$idPaquete);
         $dataNotificados = $this->Modelo->getDatosOficiosNotificados($idPaquete);
         $this->db->transBegin();
         //
         if($dataOficios->getNumRows() > 0) {
            $msjValid .= '<p class="p-font-msg">Los n&uacute;meros de oficios que se encuentran asignado a un paquete</p>';
            $msjValid .= '<table class="table table-bordered table-striped table-hover">
                           <thead class="table-dark">
                              <tr class="p-font-msg-07">
                                 <th width="15%" class="text-start">Num. Oficio</th>
                                 <th width="15%" class="text-center">Fecha Oficio</th>
                                 <th width="15%" class="text-center">No. Paquete</th>
                              </tr>
                           </thead>
                           <tbody>';
            foreach($dataOficios->getResult() as $key) {
               $msjValid .='<tr class="p-font-msg-07">
                              <td class="text-start">'.$key->num_oficio.'</td>
                              <td class="text-center">'.$key->foficio.'</td>
                              <td class="text-center">'.$key->id_paquete.'</td>
                           </tr>';
            }
            $msjValid .= ' </tbody>
                        </table>';
            $result = array(false,$msjValid,1);
         }
         //
         if(empty($msjValid) && $dataNotificados->getNumRows() > 0) {
            $msjValid .= '<p class="p-font-msg">Los n&uacute;meros de oficios que NO se pueden regresar a disponible porque ya esta <b>NOTIFICADO</b></p>';
            $msjValid .= '<table class="table table-bordered table-striped table-hover">
                           <thead class="table-dark">
                              <tr class="p-font-msg-07">
                                 <th width="15%" class="text-start">Num. Oficio</th>
                                 <th width="15%" class="text-center">Fecha Oficio</th>
                                 <th width="15%" class="text-center">Fecha Notificado</th>
                              </tr>
                           </thead>
                           <tbody>';
            foreach($dataNotificados->getResult() as $key) {
               $msjValid .='<tr class="p-font-msg-07">
                              <td class="text-start">'.$key->num_oficio.'</td>
                              <td class="text-center">'.$key->foficio.'</td>
                              <td class="text-center">'.$key->fnotificado.'</td>
                           </tr>';
            }
            $msjValid .= ' </tbody>
                        </table>';
            $result = array(false,$msjValid,1);
         }
         //*
         if(empty($msjValid)) {
            $msjPaquete = "";
            if($dataPaq->getNumRows() > 0) {
               foreach($dataPaq->getResult() as $key) {
                  $msjPaquete .="<p class='p-font-msg-1-1 fw-bold lead'>ID Paquete: ".$key->id_paquete." - ".date('d-m-Y', strtotime($key->fecha_programada))."</p>";
               }
               $msjValid = "No se le puede asignar registro al notificador seleccionado, porque tiene paquete que no ha cerrado: <div class='text-center'>".$msjPaquete."</div>";
               $result = array(false,$msjValid,1);
            }
         }
         //
         if(empty($msjValid)) {
            if(empty($idPaquete)){
               $result = $this->Modelo->insertPaquete(
                  $idUserNotificador,$fechaProgramacion,$usuario,$ip);
            }
            else{
               $result = $this->Modelo->updatePaquete(
                  $idPaquete,$idUserNotificador,$fechaProgramacion,$usuario,$ip);
            }
            $msjExist = $result[1];
            $id_paquete = $result[2];
            //*
            if($result[0]) {
               $result = $this->Modelo->deletePaqueteNotificacion(
                  $id_paquete,$idsNotificaciones,$usuario,$ip);
               if($result[0]) {
                  $result = $this->Modelo->insertPaqueteNotificacion(
                     $id_paquete,$idsNotificaciones,$idEstatus,$usuario,$ip);
               }
            }
         }
         //
         if ($result[0]) {
            $this->db->transCommit();
            $response = array('respuesta' => true, 'mensaje' => $msjExist);
         }
         else {
            $this->db->transRollback();
            $response = array('respuesta' => false, 'mensaje' => $result[1], 'valid' => $result[2]);
         }
      }

      return $this->response->setJSON($response);
   }
   // TODO: Proceso de iniciar paquete
   public function procesoIniciarPaquete(){
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $idPaquete = $this->request->getPost("id_paquete");
         $usuario = $this->session->get("usuario");
         $ip      = $this->session->get("ip");
         $datos = $this->Modelo->getDatosPaquete($idPaquete)->getRow();
         $msjValid = "";
         $this->db->transBegin();
         //
         if($datos->fecha_hora_apertura_operacion == "") {
            $result = $this->Modelo->iniciarPaquete($idPaquete,$usuario,$ip);
         }
         else {
            $result = array(false,"El paquete con el ID (<b>".$idPaquete."</b>) ya se encuentra iniciada para su operaci&oacute;n",1);
         }
         //
         if($result[0]) {
            $this->db->transCommit();
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $this->db->transRollback();
            $response = array('respuesta' => false, 'mensaje' => $result[1], 'valid' => $result[2]);
         }
      }

      return $this->response->setJSON($response);
   }
   // TODO: Proceso de cerrar paquete
   public function procesoCerrarPaquete(){
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $idPaquete = $this->request->getPost("id_paquete");
         $usuario = $this->session->get("usuario");
         $ip      = $this->session->get("ip");
         $datos = $this->Modelo->getDatosPaquete($idPaquete)->getRow();
         $datosxNotificar = $this->Modelo->getDatosOficiosxNotificar($idPaquete);
         $msjValid = "";
         $this->db->transBegin();
         //
         if($datos->fecha_hora_cierre_operacion == "") {
            /*if($datosxNotificar->getNumRows() > 0) {
               foreach($datosxNotificar->getResult() as $key) {
                  $msjValid .="<p class='p-font-msg-1-1 fw-bold lead'>".$key->num_orden."</p>"; 
               }
               $result = array(
                  false,
                  "El paquete con el ID (<b>".$idPaquete."</b>) no se puede cerrar porque tiene n&uacute;meros de ordenes por notificar: <div class='text-center'>".$msjValid."</div>",
                  1);
            }
            else {*/
               $result = $this->Modelo->cerrarPaquete($idPaquete,$usuario,$ip);
            //}
         }
         else {
            $result = array(false,"El paquete con el ID (<b>".$idPaquete."</b>) ya se encuentra cerrada para su operaci&oacute;n",1);
         }
         //
         if($result[0]) {
            $this->db->transCommit();
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $this->db->transRollback();
            $response = array('respuesta' => false, 'mensaje' => $result[1], 'valid' => $result[2]);
         }
      }

      return $this->response->setJSON($response);
   }
   // TODO: Proceso de eliminacion
   public function procesoEliminacion(){
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $idPaquete = $this->request->getPost("id_paquete");
         $usuario = $this->session->get("usuario");
         $ip      = $this->session->get("ip");
         $datos = $this->Modelo->getDatosPaquete($idPaquete)->getRow();
         $dataNotificados = $this->Modelo->getDatosOficiosNotificados($idPaquete);
         $msjValid = "";
         $this->db->transBegin();
         //
         if($datos->fecha_hora_apertura_operacion == "") {
            if($dataNotificados->getNumRows() > 0) {
               $msjValid .= '<p class="p-font-msg">El paquete no se puede <b class="text-danger">ELIMINAR</b> porque tienen n&uacute;meros de oficios que estan <b>NOTIFICADO</b></p>';
               $msjValid .= '<table class="table table-bordered table-striped table-hover">
                              <thead class="table-dark">
                                 <tr class="p-font-msg-07">
                                    <th width="15%" class="text-start">Num. Oficio</th>
                                    <th width="15%" class="text-center">Fecha Oficio</th>
                                    <th width="15%" class="text-center">Fecha Notificado</th>
                                 </tr>
                              </thead>
                              <tbody>';
               foreach($dataNotificados->getResult() as $key) {
                  $msjValid .='<tr class="p-font-msg-07">
                                 <td class="text-start">'.$key->num_oficio.'</td>
                                 <td class="text-center">'.$key->foficio.'</td>
                                 <td class="text-center">'.$key->fnotificado.'</td>
                              </tr>';
               }
               $msjValid .= ' </tbody>
                           </table>';
               $result = array(false,$msjValid,1);
            }
            else {
               $result = $this->Modelo->deletePaquetes($idPaquete,$usuario,$ip);
            }
         }
         else {
            $result = array(false,"El paquete con el ID (<b>".$idPaquete."</b>) no se puede eliminar porque ya se aperturo la operaci&oacute;n",1);
         }
         //
         if ($result[0]) {
            $this->db->transCommit();
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $this->db->transRollback();
            $response = array('respuesta' => false, 'mensaje' => $result[1], 'valid' => $result[2]);
         }
      }

      return $this->response->setJSON($response);
   }
}