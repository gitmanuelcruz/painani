<?php
namespace App\Controllers;
use App\Models\MServicios;
use App\Models\MCambios;

class Cambios extends BaseController
{
	function __construct() {
		$this->MServicios = new MServicios();
		$this->MCambios = new MCambios();
      helper('date');
	}
   //
	public function index() {
		if ($this->session->get("logueado") != true) {
         return view('errors/message_session');
		}
		else {
			$usuario = $this->session->get("usuario");
         $validarModulo = $this->utilerias->getValidaPrivilegio($usuario, 'REG_CAMBIOS_EMPLEADOS', 'MODULO');
         if($validarModulo > 0) {
            $data['usuario'] = $usuario;
				$data['data_user'] = $this->utilerias->getDatosSession();
            $data['titulo'] = "Mvts. Empleados";
            $data['titulo2'] = "Movimientos de Empleados";
            $data['btn_nuevo'] = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_NEW_CAMBIO","PRIVILEGIO");
            $data['tiposCambio'] = $this->MServicios->getTiposCambios()->getResult();
            $data['estatusCambio'] = $this->MServicios->getEstatusCambios()->getResult();
				return view('cambios/list', $data);
         }
         else {
            $message = array(
               'data_user' => $this->utilerias->getDatosSession(),
               'title' => 'VALIDACI&Oacute;N DE PRIVILEGIO DE M&Oacute;DULO',
               'detalle' => 'SIN PRIVILEGIOS PARA ACCEDER AL M&Oacute;DULO DE <b>CAMBIOS</b>');
				return view('errors/message_error', $message);
         }
		}
	}
	//
	public function cambiosEmpleadosPag() {
      $nombre_rfc_curp   = $this->request->getPost("txt_nombre_rfc_curp");
		$id_tipo_cambio    = $this->request->getPost("id_tipo_cambio");
		$fecha_cambio      = $this->request->getPost("txt_fecha_cambio");
		$id_estatus_cambio = $this->request->getPost("id_estatus_cambio");
		$usuario 		= $this->session->get("usuario");
		$icon_editar 	= $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_EDITA_CAMBIO_EMP","PRIVILEGIO");
		$icon_enviar 	= $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_ENVIA_CAMBIO_EMP","PRIVILEGIO");
		$icon_regresar = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_REGRESA_CAMBIO_EMP","PRIVILEGIO");
		$icon_aplicar 	= $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_APLICA_CAMBIO_EMP","PRIVILEGIO");
		$icon_cancelar = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_CANCELA_CAMBIO_EMP","PRIVILEGIO");
		$pagina        = 0;
		$resultados    = 0;

		if (!empty($this->request->getPost("pagina")))
			$pagina = $this->request->getPost("pagina");
		if (!empty($this->request->getPost("resultados")))
			$resultados = $this->request->getPost("resultados");

		$sql = $this->MCambios->getCambiosEmpleadosPag(
         $nombre_rfc_curp,$id_tipo_cambio,$fecha_cambio,$id_estatus_cambio,$icon_editar,$icon_enviar,$icon_regresar,
         $icon_aplicar, $icon_cancelar);
		$results = $this->utilerias->loadJSON($sql, $pagina, $resultados);

		return $this->response->setJSON($results);
	}
   
	// TODO: Proceso de registrar dia inhabil
   public function getComboTipoCambio() {
      $result = array(
         's_tcambio'=> $this->MServicios->getTiposCambios()->getResult()
      );
      return $this->response->setJSON($result);    
   }  
   // TODO: Proceso de registrar dia inhabil
   public function getComboCampos() {
      $result = array(
         's_bancos'=> $this->MServicios->getBancos('ACTIVOS','','')->getResult()
      );
      return $this->response->setJSON($result);    
   }  
   //TODO: Consultar Empleados
   public function consultarEmpleados() {
      $parametro = $this->request->getPost("vm_buscar_empleado");
      $parametro2 = $this->request->getPost("vm_id_grupo_busq");
      $pagina = (!empty($this->request->getPost("pagina"))) ? $this->request->getPost("pagina") : 0;
      $resultados = (!empty($this->request->getPost("resultados"))) ? $this->request->getPost("resultados") : 0;

      $sql = $this->MCambios->consultarEmpleados($parametro,$parametro2);
      $results = $this->utilerias->loadJSON($sql, $pagina, $resultados);
      return $this->response->setJSON($results);
   }
	//
   public function getCombosGrupos() {
      $data = array(
         'grupos' => $this->MServicios->getGruposEmpleados('X')->getResult(),
      );

      return $this->response->setJSON($data);
   }
   // TODO: Proceso de registrar dia inhabil
   public function getCampos() {
      $id_tipo_cambio = $this->request->getPost("pid_tipo_cambio");

      $result = array(
         'dataCampos'=> $this->MServicios->getCamposCambioEmpleado($id_tipo_cambio)->getResult()
      );
      return $this->response->setJSON($result);    
   }  
   //
	public function existeRegistroCambio() {
		$tipoCambio   = $this->request->getPost("pTipoCambio");
		$idEmpleado   = $this->request->getPost("pIdEmpleado");

		$total  = $this->MCambios->getExisteCambio($tipoCambio, $idEmpleado)->getRow()->total;		
		$result = array("total" => $total);
		
	  return $this->response->setJSON($result);
	}  
   // TODO: Proceso de registrar dia inhabil
   public function getCamposValor() {
      $id_cambio = $this->request->getPost("pid_cambio");

      $result = array(
         'dataCamposValores'=> $this->MCambios->getCamposValor($id_cambio)->getResult()
      );
      return $this->response->setJSON($result);    
   }  
	//
   public function guardarCambioEmpleado() {
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $tipo           = $this->request->getPost("vm_tipo");
         $id_cambio      = $this->request->getPost("vm_id_cambio");
         $id_empleado    = $this->request->getPost("vm_id_empleado");
         $id_empleado_plaza = $this->request->getPost("vm_id_empleado_plaza");
         $id_tipo_cambio = $this->request->getPost("vm_id_tipo_cambio");
         $fecha_cambio   = $this->request->getPost("vm_fecha_cambio");
         $motivo         = $this->request->getPost("vm_motivo");
         $usuario        = $this->session->get("usuario");
         $ip             = $this->session->get("ip");
         $this->db->transBegin();

         if($tipo == 'N'){
            $result = $this->MCambios->insertCambios(
               $id_empleado,$id_empleado_plaza,$id_tipo_cambio,$fecha_cambio,$motivo,$usuario,$ip);
         }
         else{
            $result = $this->MCambios->updateCambio(
               $id_cambio,$id_empleado,$id_empleado_plaza,$id_tipo_cambio,$fecha_cambio,$motivo,$usuario,$ip);
            if ($result[0]) {
               $result = $this->MCambios->deleteCambiosCampos($id_cambio);
            }
         }

         if ($result[0]) {
            $idCambio= $result[2];
            $datosCampos = $this->MServicios->getCamposCambioEmpleado($id_tipo_cambio)->getResult();
            foreach ($datosCampos as $key) {
               $id_campo = $key->id_campo;
               $tipo_dato   = $key->nombre_tipo_dato;
               $datoValue   = $this->request->getPost($key->nombre_campo);
               if($key->nombre_campo == 'num_tarjeta' && $datoValue == '') {
                  $datoValue   = '0000000000000000';
               }
               $result = $this->MCambios->insertCambiosCampos($idCambio,$id_campo,$tipo_dato,$datoValue,$usuario,$ip);
            }
         }

         if ($result[0]) {
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
   //
   public function actualizarCambioEnviado(){
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_cambio = $this->request->getPost("pid_cambio");         
         $usuario   = $this->session->get("usuario");
         $ip        = $this->session->get("ip");
         $estatus = 'ENVIADO';
         $this->db->transBegin();

         $result = $this->MCambios->updateEstatusCambio($id_cambio,$estatus,$usuario,$ip);
         if ($result[0]) {
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
   //
   public function aplicarCambioEmpleado(){
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_cambio = $this->request->getPost("pid_cambio");         
         $usuario   = $this->session->get("usuario");
         $ip        = $this->session->get("ip");
         $estatus = 'APLICADO';
         $contador = 0;
         $valorCambio;
         $this->db->transBegin();

         $result = $this->MCambios->updateEstatusCambio($id_cambio,$estatus,$usuario,$ip);
         if($result[0]) {
            $cambiosCampos = $this->MCambios->getCambiosCampos($id_cambio)->getResult();
            foreach ($cambiosCampos as $key) {
               $idEmpleado = $key->id_empleado;
               $nombreColumnaValor    = $this->getColumnaValorCambio($key->nombre_tipo_dato);
               $valorCambio = $key->$nombreColumnaValor;
               $condicion = json_decode($key->condicion);
               foreach ($condicion as $key) {
                  $sql = $key->{'sql'};
                  $result = $this->MCambios->updateCambioAplicar($sql,$idEmpleado,$valorCambio,$usuario,$ip);
                  if(!$result[0]) {
                     $contador++;
                     break;
                  }
               }               
            }
         }
         else {
            $contador++;
         }

         if ($contador == 0) {
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
   //
   function getColumnaValorCambio($tipo_dato){
      switch ($tipo_dato) {
         case 'Primary':
            return 'valor_campo_id';
            break;

         case 'Texto':
            return 'valor_campo_texto';
            break;

         case 'Entero':
            return 'valor_campo_entero';
            break;

         case 'Decimal':
            return 'valor_campo_decimal';
            break;

         case 'Fecha':
            return 'valor_campo_fecha';
            break;
         
         default:
         return false;
            break;
      }
   }
   //
   public function actualizarRegresoCambio(){
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_cambio = $this->request->getPost("pid_cambio");  
         $observacion = $this->request->getPost("pobservacion");        
         $usuario   = $this->session->get("usuario");
         $ip        = $this->session->get("ip");
         $estatus = 'OBSERVADO';
         $this->db->transBegin();

         $result = $this->MCambios->updateRegresaCambio($id_cambio,$estatus,$observacion,$usuario,$ip);
         if ($result[0]) {
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
   //
   public function actualizarCambioCancelado(){
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_cambio = $this->request->getPost("pid_cambio");         
         $usuario   = $this->session->get("usuario");
         $ip        = $this->session->get("ip");
         $estatus = 'CANCELADO';
         $this->db->transBegin();

         $result = $this->MCambios->updateEstatusCambio($id_cambio,$estatus,$usuario,$ip);
         if ($result[0]) {
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