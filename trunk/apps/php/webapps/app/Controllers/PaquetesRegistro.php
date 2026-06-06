<?php
namespace App\Controllers;
use App\Models\MPaquetesRegistro;
use App\Models\MServicios;

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
            $data['btn_nuevo'] = 1;//$this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_NVO_NOTIFICACION","PRIVILEGIO");
            //$data['estatus'] = $this->MServicios->getEstatusNotificacion()->getResult();
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
		$usuario 	   = $this->session->get("usuario");
		$iconEditar    = 1;//$this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_EDI_NOTIFICACION","PRIVILEGIO");
		$iconEliminar  = 1;//$this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_CANL_NOTIFICACION","PRIVILEGIO");
		$pagina        = 0;
		$resultados    = 0;

		if (!empty($this->request->getPost("pagina")))
			$pagina = $this->request->getPost("pagina");
		if (!empty($this->request->getPost("resultados")))
			$resultados = $this->request->getPost("resultados");

		$sql = $this->Modelo->getPaquetesPag(
         $idNumOficio,$fechaProgramada,$fechaApertura,$fechaCierre,$notificador,$iconEditar,$iconEliminar);
		$results = $this->utilerias->loadJSON($sql,$pagina,$resultados);

		return $this->response->setJSON($results);
	}
	// TODO: Proceso de registro o edicion
   public function getComboRegistro() {
      $idPaquete   = $this->request->getPost("id_paquete");
      $result = array(
         'userNotificadores'=> $this->Modelo->getNotificadores()->getResult(),
         'listOficios'=> $this->Modelo->getListOficiosNotificacion($idPaquete)->getResult()
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
         $dataOficios = $this->Modelo->getDatosNotificacion($idsNotificaciones,$idPaquete);
         $this->db->transBegin();
         //
         if($dataOficios->getNumRows() > 0) {
            $msjValid .= '<p class="p-font-msg">Num. Oficios que se encuentran asignado a un paquete</p>';
            $msjValid .= '<table class="table table-striped table-hover">
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
         else {
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
                  $id_paquete,$idsNotificaciones);
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
   // TODO: Proceso de eliminacion
   public function procesoEliminacion(){
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $idPaquete = $this->request->getPost("id_paquete");         
         $datos = $this->Modelo->getDatosPaquete($idPaquete)->getRow();
         $this->db->transBegin();
         //
         if($datos->fecha_hora_apertura_operacion == "") {
            $result = $this->Modelo->deletePaquetes($idPaquete);
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