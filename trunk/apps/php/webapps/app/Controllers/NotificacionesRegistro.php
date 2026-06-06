<?php
namespace App\Controllers;
use App\Models\MNotificacionesRegistro;
use App\Models\MServicios;

class NotificacionesRegistro extends BaseController
{
	function __construct() {
		$this->Modelo = new MNotificacionesRegistro();
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
         $validarModulo = $this->utilerias->getValidaPrivilegio($usuario,"REG_NOTIFICACION","MODULO");
         if($validarModulo > 0) {
            $data['usuario'] = $usuario;
				$data['data_user'] = $this->utilerias->getDatosSession();
            $data['titulo'] = "Registro";
            $data['titulo2'] = "Registro de Notificaciones";
            $data['btn_nuevo'] = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_NVO_NOTIFICACION","PRIVILEGIO");
            $data['estatus'] = $this->MServicios->getEstatusNotificacion()->getResult();
				return view('notificaciones/registro/list', $data);
         }
         else {
            $message = array(
               'data_user' => $this->utilerias->getDatosSession(),
               'title' => 'VALIDACI&Oacute;N DE PRIVILEGIO DE M&Oacute;DULO',
               'detalle' => 'SIN PRIVILEGIOS PARA ACCEDER AL M&Oacute;DULO DE <b>REGISTRO DE NOTIFICACIONES</b>');
				return view('errors/message_error', $message);
         }
		}
	}
	//
	public function notificacionesPag() {
      $idNumOficio  = $this->request->getPost("txt_id_num_oficio");
		$fechaOficio  = $this->request->getPost("txt_fecha_oficio");
		$idEstatus    = $this->request->getPost("id_estatus");
		$usuario 	  = $this->session->get("usuario");
		$iconEditar   = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_EDI_NOTIFICACION","PRIVILEGIO");
		$iconCancelar = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_CANL_NOTIFICACION","PRIVILEGIO");
		$pagina       = 0;
		$resultados   = 0;

		if (!empty($this->request->getPost("pagina")))
			$pagina = $this->request->getPost("pagina");
		if (!empty($this->request->getPost("resultados")))
			$resultados = $this->request->getPost("resultados");

		$sql = $this->Modelo->getNotificacionesPag(
         $idNumOficio,$fechaOficio,$idEstatus,$iconEditar,$iconCancelar);
		$results = $this->utilerias->loadJSON($sql, $pagina, $resultados);

		return $this->response->setJSON($results);
	}
	// TODO: Proceso de registro o edicion
	public function existeOficio() {
		$numOficio   = $this->request->getPost("num_oficio");
		$total  = $this->Modelo->getExisteOficio($numOficio)->getRow()->total;
		$result = array("total" => $total);
		
	  return $this->response->setJSON($result);
	} 
	//
   public function guardarNotificacion() {
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $idNotificacion = $this->request->getPost("vm_id_notificacion");
         $numOficio   = $this->request->getPost("vm_num_oficio");
         $fechaOficio = $this->request->getPost("vm_fecha_oficio");
         $domicilio   = $this->request->getPost("vm_domicilio");
         $referenciaUbicacion = $this->request->getPost("vm_referencia_ubicacion");
         $usuario = $this->session->get("usuario");
         $ip      = $this->session->get("ip");
         $idEstatus = "POR_ASIGNAR";
         $bandEstatus = 0;
         $exist = $this->Modelo->getExisteOficio($numOficio)->getRow()->total;
         if(!empty($idNotificacion)){
            $datos = $this->Modelo->getDatosNotificacion($idNotificacion)->getRow();
            if(mb_strtoupper(trim($datos->num_oficio),'UTF-8') == mb_strtoupper(trim($numOficio),'UTF-8')) {
               $exist = 0;
            }
            if($datos->id_estatus_notificacion != $idEstatus) {
               $exist = 1;
               $bandEstatus = 1;
            }
         }
         $this->db->transBegin();
         //
         if((int)$exist == 0) {
            if(empty($idNotificacion)){
               $result = $this->Modelo->insertNotificacion(
                  $numOficio,$fechaOficio,$domicilio,$referenciaUbicacion,$idEstatus,$usuario,$ip);
            }
            else{
               $result = $this->Modelo->updateNotificacion(
                  $idNotificacion,$numOficio,$fechaOficio,$domicilio,$referenciaUbicacion,$usuario,$ip);
            }
         }
         else {
            if((int)$bandEstatus == 0) {
               $result = array(false,"El n&uacute;mero de oficio (<b>".$numOficio."</b>) ya se encuentra registrado",1);
            }
            else {
               $result = array(false,"El n&uacute;mero de oficio (<b>".$numOficio."</b>) ya se encuentra asignado a un paquete, ya no se puede modificar",1);
            }
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
   // TODO: Proceso de cancelacion
   public function procesoCancelado(){
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $idNotificacion = $this->request->getPost("id_notificacion");         
         $usuario   = $this->session->get("usuario");
         $ip        = $this->session->get("ip");
         $estatus = 'CANCELADO';
         $datos = $this->Modelo->getDatosNotificacion($idNotificacion)->getRow();
         $numOficio = $datos->num_oficio;
         $this->db->transBegin();
         //
         if($datos->id_estatus_notificacion == "POR_ASIGNAR") {
            $result = $this->Modelo->updateCancelacion($idNotificacion,$estatus,$usuario,$ip);
         }
         else {
            $result = array(false,"El n&uacute;mero de oficio (<b>".$numOficio."</b>) ya se encuentra asignado a un paquete, ya no se puede <b class='text-danger'>CANCELAR</b>",1);
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