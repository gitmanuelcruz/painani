<?php
namespace App\Controllers;
use App\Libraries\ExcelGenerate;

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
            $data['btn_inf_excel'] = 1;//$this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_INF_EXCEL_NOTIFICACION","PRIVILEGIO");
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
      $iconInforme  = 1;//$this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_CANL_NOTIFICACION","PRIVILEGIO");
		$pagina        = 0;
		$resultados    = 0;

		if (!empty($this->request->getPost("pagina")))
			$pagina = $this->request->getPost("pagina");
		if (!empty($this->request->getPost("resultados")))
			$resultados = $this->request->getPost("resultados");

		$sql = $this->Modelo->getPaquetesPag(
         $idNumOficio,$fechaProgramada,$fechaApertura,$fechaCierre,$notificador,$iconEditar,$iconEliminar,$iconInforme);
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

		$sql = $this->Modelo->getNotificacionesAsigPag($idPaquete);
		$results = $this->utilerias->loadJSON($sql,$pagina,$resultados);

		return $this->response->setJSON($results);
	}
   //
   public function soportesNotificacionAsigPag() {
      $idPaqueteNotificacion = $this->request->getPost("id_paquete_notificacion");
      $idNotificacion = $this->request->getPost("id_notificacion");
		$pagina     = 0;
		$resultados = 0;

		if (!empty($this->request->getPost("pagina")))
			$pagina = $this->request->getPost("pagina");
		if (!empty($this->request->getPost("resultados")))
			$resultados = $this->request->getPost("resultados");

		$sql = $this->Modelo->getSoporteNotificacionAsigPag($idPaqueteNotificacion,$idNotificacion);
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
               $result = $this->Modelo->deletePaquetes($idPaquete);
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
   public function obtieneInformeNotificaciones(){

        $num_oficio = $this->request->getPost("txt_id_num_oficio");
        $fecha_programada = $this->request->getPost("txt_fecha_programada");
        $fecha_apertura = $this->request->getPost("txt_fecha_apertura");
        $fecha_cierre = $this->request->getPost("txt_fecha_cierre");
        $nombre_notificador = $this->request->getPost("txt_nombre_notificador");

        $usuario     = $this->session->get("usuario");
        $idNivelUsuario = $this->session->get("id_nivel_usuario");

        $excel = new ExcelGenerate();      
        $excel->estilosFila('INFORME NOTIFICACIONES ', 'A2', 'Arial', true, '12', '999797');
        $excel->combinarCeldas('A2:I2');
        $excel->alinearCeldaCentro('A2:I2');
        $excel->altoFila(2, 18);
        $excel->estilosFila('', 'A3', 'Arial', true, '12', '999797');
        $excel->combinarCeldas('A3:I3');
        $excel->alinearCeldaCentro('A3:I3');
        $excel->altoFila(3, 5);

        $excel->estiloCelda('A5:I5','000000',10);
        $excel->altoFila(1, 20);

        $excel->valorCelda('A5', '#');
        $excel->valorCelda('B5', 'NO. OFICIO');
        $excel->valorCelda('C5', 'FECHA OFICIO');
        $excel->valorCelda('D5', 'DOMICILIO');
        $excel->valorCelda('E5', 'REFERENCIA');
        $excel->valorCelda('F5', 'ESTATUS NOTIFICACIÓN');
        $excel->valorCelda('G5', 'NOTIFICADOR');
        $excel->valorCelda('H5', 'NOTIFICADO');
        $excel->valorCelda('I5', 'FECHA NOTIFICACIÓN');

        $excel->ajustarTexto('A5:I5');
        $excel->alinearCeldaCentro('A5:I5');
        //
        //$excel->alinearCeldaDerecha('G5:G5');
        //$excel->filtros('A5:G5');

        $fila = 6;
        $filaInicio = $fila;
         $resultado = $this->Modelo->getDatosInfoNotificaciones(
            $num_oficio,$fecha_programada,$fecha_apertura,$fecha_cierre,$nombre_notificador)->getResult();

         foreach($resultado as $row)
         {
            $excel->valorCelda('A'.$fila, $row->fila);
            $excel->valorCelda('B'.$fila, $row->num_oficio);
            $excel->valorCelda('C'.$fila, $row->fecha_oficio);
            $excel->valorCelda('D'.$fila, $row->domicilio);
            $excel->valorCelda('E'.$fila, $row->referencia_ubicacion);
            $excel->valorCelda('F'.$fila, $row->id_estatus_notificacion);
            $excel->valorCelda('G'.$fila, $row->nombre_notificador);
            $excel->valorCelda('H'.$fila, $row->notificado);
            $excel->valorCelda('I'.$fila, $row->fecha_hora_notificado);

            $fila++;
         }
         $ultimaFila = $fila - 1;
         $excel->alinearCeldaCentro('A6:A'.$ultimaFila);
         $excel->alinearCeldaIzquierda('B6:B'.$ultimaFila);
         $excel->alinearCeldaCentro('C6:C'.$ultimaFila);
         $excel->alinearCeldaIzquierda('D6:E'.$ultimaFila);
         $excel->alinearCeldaCentro('F6:F'.$ultimaFila);
         $excel->alinearCeldaIzquierda('G6:G'.$ultimaFila);
         $excel->alinearCeldaCentro('H6:I'.$ultimaFila);         
         //$excel->alinearCeldaIzquierda('I6:I'.$ultimaFila);
         $excel->ajustarTexto('A6:I'.$ultimaFila);
         //$excel->setCondicionColorText($columnaEstatus = 'I', $filaInicio = 6,'VENCIDO', 'K');
         //$excel->formatoNumero('I'.$filaInicio.':J'.$ultimaFila);

         
        $excel->anchoColumna('A', 5);
        $excel->anchoColumna('B', 25);
        $excel->anchoColumna('C', 15);
        $excel->anchoColumna('D', 45);
        $excel->anchoColumna('E', 45);
        $excel->anchoColumna('F', 22);
        $excel->anchoColumna('G', 30);
        $excel->anchoColumna('H', 12);
        $excel->anchoColumna('I', 25);
        $excel->tituloHoja('InfoNotif');

        $excel->seleccionarHoja(0);
        $nombreArchivo = 'InformeNotificaciones';
        $excel->descargar($nombreArchivo);
    }
}