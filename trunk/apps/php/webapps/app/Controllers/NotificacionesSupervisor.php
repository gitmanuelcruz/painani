<?php
namespace App\Controllers;
use ZipArchive;
use App\Models\MNotificacionesSupervisor;

class NotificacionesSupervisor extends BaseController
{
	function __construct() {
		$this->Modelo = new MNotificacionesSupervisor();
      helper('date');
	}
   //
	public function index() {
		if ($this->session->get("logueado") != true) {
         return view('errors/message_session');
		}
		else {
			$usuario = $this->session->get("usuario");
         $validarModulo = $this->utilerias->getValidaPrivilegio($usuario,"SUPERVISOR_NOTIFICACION","MODULO");
         if($validarModulo > 0) {
            $data['usuario'] = $usuario;
				$data['data_user'] = $this->utilerias->getDatosSession();
            $data['titulo'] = "Supervisor";
            $data['titulo2'] = "Supervisi&oacute;n de Notificaciones";
            $data['estatus'] = $this->Modelo->getEstatusNotificacion()->getResult();
            $data['verificados'] = $this->Modelo->getVerificaciones()->getResult();
				return view('notificaciones/supervisor/list', $data);
         }
         else {
            $message = array(
               'data_user' => $this->utilerias->getDatosSession(),
               'title' => 'VALIDACI&Oacute;N DE PRIVILEGIO DE M&Oacute;DULO',
               'detalle' => 'SIN PRIVILEGIOS PARA ACCEDER AL M&Oacute;DULO DE <b>SUPERVISOR DE NOTIFICACIONES</b>');
				return view('errors/message_error', $message);
         }
		}
	}
	//
	public function notificacionesPag() {
      $numOrden     = $this->request->getPost("num_orden");
		$fechaInicio  = $this->request->getPost("fecha_inicio");
      $fechaTermino = $this->request->getPost("fecha_termino");
		$idEstatus    = $this->request->getPost("id_estatus");
      $idVerficado  = $this->request->getPost("id_verficado");
		$usuario 	  = $this->session->get("usuario");
		$iconVerificar = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_ADD_VERIFSOP_NOTIF","PRIVILEGIO");
		$pagina       = 0;
		$resultados   = 0;

		if (!empty($this->request->getPost("pagina")))
			$pagina = $this->request->getPost("pagina");
		if (!empty($this->request->getPost("resultados")))
			$resultados = $this->request->getPost("resultados");

		$sql = $this->Modelo->getNotificacionesPag(
         $numOrden,$fechaInicio,$fechaTermino,$idEstatus,$idVerficado,$iconVerificar);
		$results = $this->utilerias->loadJSON($sql, $pagina, $resultados);

		return $this->response->setJSON($results);
	}
   //
   public function historialNotificacionPackagesPag() {
      $idNotificacion = $this->request->getPost("id_notificacion");
		$usuario 	= $this->session->get("usuario");
      $iconVerificar = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_ADD_VERIFSOP_NOTIF","PRIVILEGIO");
		$pagina     = 0;
		$resultados = 0;

		if (!empty($this->request->getPost("pagina")))
			$pagina = $this->request->getPost("pagina");
		if (!empty($this->request->getPost("resultados")))
			$resultados = $this->request->getPost("resultados");

		$sql = $this->Modelo->getHistorialNotificacionPackagesPag($idNotificacion,$iconVerificar);
		$results = $this->utilerias->loadJSON($sql, $pagina, $resultados);

		return $this->response->setJSON($results);
	}
   //
   public function soportesNumOrdenes() {
      $idPaqueteNotificacion = $this->request->getPost("id_paquete_notificacion");
      $idNotificacion = $this->request->getPost("id_notificacion");
      $result = array(
         'listSoporte'=> $this->Modelo->getSoporteNumOrdenes($idPaqueteNotificacion,$idNotificacion)->getResult()
      );
      return $this->response->setJSON($result);    
   }
   //
   public function descargarSoporte() {
      $idPaqueteNotificacion = $this->request->getPost("id_paquete_notificacion");
      $idNotificacion = $this->request->getPost("id_notificacion");
      $usuario = $this->session->get("usuario");
      $ip      = $this->session->get("ip");
      $darchivosDet  = $this->Modelo->getSoporteNumOrdenes($idPaqueteNotificacion,$idNotificacion);
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
            $url = base_url().$keyNumFile->ruta_soporte;
            $file = file_get_contents($url);
            $zip->addFromString($nombreEnZip,$file);
         }
         $zip->close();
         //
         header('Content-Description: File Transfer');
         header('Content-Type: application/octet-stream');
         header('Content-Disposition: attachment; filename="'.basename($fileGenerado).'"');
         header('Content-Transfer-Encoding: binary');
         header('Expires: 0');
         header('Cache-Control: must-revalidate');
         header('Pragma: public');
         header('Content-Length: '.filesize($fileGenerado));
         header('Access-Control-Expose-Headers: Content-Disposition');
         readfile($fileGenerado);
         if((int)$totalArchivo > 1) {
            $this->utilerias->removeFile($fileGenerado);
         }
      }
      else {
         foreach ($darchivosDet->getResult() as $keyNumFile) {
            $nameFile = basename($keyNumFile->nombre_original.".".$keyNumFile->extension);
            $url = base_url().$keyNumFile->ruta_soporte;
            $fileGenerado = file_get_contents($url);
         }
         //
         header('Content-Description: File Transfer');
         header('Content-Type: application/octet-stream');
         header('Content-Disposition: attachment; filename="'.basename($nameFile).'"');
         header('Content-Transfer-Encoding: binary');
         header('Expires: 0');
         header('Cache-Control: must-revalidate');
         header('Pragma: public');
         header('Content-Length: ' . strlen($fileGenerado));
         header('Access-Control-Expose-Headers: Content-Disposition');
         ob_clean();
         flush();
         echo $fileGenerado;
      }
      //
      exit;
   }
   //
   public function getComboVerificacion() {
      $aplica = $this->request->getPost("aplica");
      $result = array(
         'verificaciones'=> $this->Modelo->getVerificaciones($aplica)->getResult()
      );
      return $this->response->setJSON($result);    
   }
   //
   public function procesoVerificarSoporte(){
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $idPaqueteNotificacion = $this->request->getPost("id_paquete_notificacion");
         $idNotificacion = $this->request->getPost("id_notificacion");
         $idVerificacion = $this->request->getPost("id_verificacion");
         $usuario = $this->session->get("usuario");
         $ip      = $this->session->get("ip");
         $this->db->transBegin();
         //
         $result = $this->Modelo->updateVerificacionSoporte(
            $idPaqueteNotificacion,$idNotificacion,$idVerificacion,$usuario,$ip);
         if($result[0]) {
            $this->db->transCommit();
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $this->db->transRollback();
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }

      return $this->response->setJSON($response);
   }
}