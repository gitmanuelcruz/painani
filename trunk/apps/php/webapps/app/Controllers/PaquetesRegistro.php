<?php
namespace App\Controllers;
use App\Models\MPaquetesRegistro;
use App\Models\MServicios;
use App\Libraries\ExcelGenerate;
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
            $data['btn_inf_excel'] = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_INFOEXCEL_NOTPAQUETE","PRIVILEGIO");
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
         $idNumOficio,$fechaProgramada,$fechaApertura,$fechaCierre,$notificador,$iconAbrir,$iconCerrar,$iconEditar,
         $iconEliminar,$iconInforme);
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

		$sql = $this->Modelo->getNotificacionesAsigPag($idPaquete,0);
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
         $msjValid = "";
         $this->db->transBegin();
         //
         if($datos->fecha_hora_cierre_operacion == "") {
            $result = $this->Modelo->cerrarPaquete($idPaquete,$usuario,$ip);
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
   //
   public function obtieneInformeNotificaciones(){
      $fechaInicio  = $this->request->getPost("vm_fecha_inicio");
      $fechaTermino = $this->request->getPost("vm_fecha_termino");
      $usuario = $this->session->get("usuario");
      $numHoja = 0;
      //
      $excel = new ExcelGenerate();      
      $excel->estilosFila('INFORME DE NOTIFICACIONES DEL '.date("d/m/Y", strtotime($fechaInicio)).' AL '.date("d/m/Y", strtotime($fechaTermino)), 'A1', 'Arial', true, '11', '999797');
      $excel->combinarCeldas('A1:K1');
      $excel->alinearCeldaCentro('A1:K1');
      $excel->altoFila(1, 20);
      //
      $excel->valorCelda('A2', 'NOTIFICADOR');
      $excel->valorCelda('B2', 'NO. PAQUETE');
      $excel->valorCelda('C2', 'NUM. ORDEN');
      $excel->valorCelda('D2', 'FECHA OFICIO');
      $excel->valorCelda('E2', 'PRIORIDAD');
      $excel->valorCelda('F2', 'IMP. PRESUNTIVA');
      $excel->valorCelda('G2', 'DOMICILIO');
      $excel->valorCelda('H2', 'REFERENCIA');
      $excel->valorCelda('I2', 'ESTATUS');
      $excel->valorCelda('J2', 'FECHA NOTIFICACIÓN');
      $excel->valorCelda('K2', 'EVIDENCIAS');
      $excel->alinearCeldaCentro('A2:K2');
      $excel->estiloCelda('A2:K2','000000',9);
      $excel->altoFila(2, 18);
      $excel->inmovilizar(3,3);
      //
      $fila = 3;
      $filaInicio = $fila;
      $idNotificiadorTmp = "";
      $contadorIndex = 0;
      $resultado = $this->Modelo->getDatosInfNotificacionesExcel($fechaInicio,$fechaTermino)->getResult();
      foreach($resultado as $row) {
         if($idNotificiadorTmp != $row->id_notificador) {
            $excel->valorCelda('A'.$fila, mb_strtoupper($row->nombre_notificador,'UTF-8'));
            $excel->combinarCeldas('A'.$fila.':K'.$fila);
            $excel->estiloCelda('A'.$fila.':K'.$fila,'dce6f1',9,'000000',true,true);
            $excel->bordes('A'.$fila.':K'.$fila,'000000');
            $fila++;
            $contadorIndex = 1;
            $excel->valorCeldaTexto('A'.$fila, $contadorIndex);
            $excel->alinearCeldaCentro('A'.$fila.':A'.$fila);
            $excel->valorCeldaTexto('B'.$fila, $row->id_paquete);
            $excel->valorCeldaTexto('C'.$fila, $row->num_orden);
            $excel->valorCelda('D'.$fila, $row->foficio);
            $excel->valorCelda('E'.$fila, mb_strtoupper($row->nombre_prioridad,'UTF-8'));
            $excel->valorCelda('F'.$fila, $row->monto_presuntiva);
            $excel->valorCelda('G'.$fila, $row->domicilio);
            $excel->valorCelda('H'.$fila, $row->referencia_ubicacion);
            $excel->valorCelda('I'.$fila, mb_strtoupper($row->estatus_notificacion,'UTF-8'));
            $excel->valorCelda('J'.$fila, $row->fnotificacion);
            $excel->valorCelda('K'.$fila, mb_strtoupper($row->band_evidencias,'UTF-8'));
            $idNotificiadorTmp = $row->id_notificador;
         }
         else {
            $contadorIndex++;
            $excel->valorCelda('A'.$fila, $contadorIndex);
            $excel->alinearCeldaCentro('A'.$fila.':A'.$fila);
            $excel->valorCeldaTexto('B'.$fila, $row->id_paquete);
            $excel->valorCeldaTexto('C'.$fila, $row->num_orden);
            $excel->valorCelda('D'.$fila, $row->foficio);
            $excel->valorCelda('E'.$fila, mb_strtoupper($row->nombre_prioridad,'UTF-8'));
            $excel->valorCelda('F'.$fila, $row->monto_presuntiva);
            $excel->valorCelda('G'.$fila, $row->domicilio);
            $excel->valorCelda('H'.$fila, $row->referencia_ubicacion);
            $excel->valorCelda('I'.$fila, mb_strtoupper($row->estatus_notificacion,'UTF-8'));
            $excel->valorCelda('J'.$fila, $row->fnotificacion);
            $excel->valorCelda('K'.$fila, mb_strtoupper($row->band_evidencias,'UTF-8'));
         }
         $fila++;
      }
      $ultimaFila = $fila - 1;
      $excel->textoTamano('A'.$filaInicio.':K'.$ultimaFila,9);
      $excel->alinearCeldaCentro('B'.$filaInicio.':B'.$ultimaFila);
      $excel->alinearCeldaCentro('D'.$filaInicio.':E'.$ultimaFila);
      $excel->alinearCeldaDerecha('F'.$filaInicio.':F'.$ultimaFila);
      $excel->formatoContable('F'.$filaInicio.':F'.$ultimaFila,true);
      $excel->alinearCeldaCentro('I'.$filaInicio.':K'.$ultimaFila);
      //
      $excel->anchoColumna('A', 15);
      $excel->anchoColumna('B', 15);
      $excel->anchoColumna('C', 18);
      $excel->anchoColumna('D', 15);
      $excel->anchoColumna('E', 13);
      $excel->anchoColumna('F', 18);
      $excel->anchoColumna('G', 25);
      $excel->anchoColumna('H', 45);
      $excel->anchoColumna('I', 15);
      $excel->anchoColumna('J', 20);
      $excel->anchoColumna('K', 15);
      $excel->tituloHoja('Notificaciones_Notificadores');
      $numHoja++;
      //*************************/
      //****** SEGUNDA HOJA *****/
      //*************************/
      $excel->crearHoja($numHoja);
      $excel->estilosFila('INFORME DE NOTIFICADORES POR EFICIENCIA DEL '.date("d/m/Y", strtotime($fechaInicio)).' AL '.date("d/m/Y", strtotime($fechaTermino)), 'A1', 'Arial', true, '11', '999797');
      $excel->combinarCeldas('A1:U1');
      $excel->alinearCeldaCentro('A1:U1');
      $excel->altoFila(1, 20);
      //
      $excel->valorCelda('A2', 'NOTIFICADOR');
      $excel->combinarCeldas('A2:A3');
      $excel->estiloCelda('A2:A3','1f497d',9);
      $excel->alinearCeldaCentro('A2:A3');
      $excel->bordes('A2:A3','000000');
      //--
      $excel->valorCelda('B2', 'TOTAL ASIGNADOS');
      $excel->combinarCeldas('B2:B3');
      $excel->estiloCelda('B2:B3','1f497d',9);
      $excel->alinearCeldaCentro('B2:B3');
      $excel->bordes('B2:B3','000000');
      $excel->ajustarTexto('B2:B3');
      //---- LOCAL
      $excel->valorCelda('C2', 'TOTALES LOCAL');
      $excel->combinarCeldas('C2:F2');
      $excel->estiloCelda('C2:F2','000000',9);
      $excel->bordes('C2:F2','ffffff');
      //----
      $excel->valorCelda('G2', '(%) PORCENTAJES LOCAL');
      $excel->combinarCeldas('G2:I2');
      $excel->estiloCelda('G2:I2','000000',9);
      $excel->bordes('G2:I2','ffffff');
      $excel->alinearCeldaCentro('C2:I2');
      //----
      $excel->valorCelda('J2', 'COMISION EST. LOCAL');
      $excel->combinarCeldas('J2:J3');
      $excel->estiloCelda('J2:J3','1f497d',9);
      $excel->alinearCeldaCentro('J2:J3');
      $excel->bordes('J2:J3','000000');
      $excel->ajustarTexto('J2:J3');
      //---- FORANEO
      $excel->valorCelda('K2', 'TOTALES FORANEO');
      $excel->combinarCeldas('K2:N2');
      $excel->estiloCelda('K2:N2','000000',9);
      $excel->bordes('K2:N2','ffffff');
      //----
      $excel->valorCelda('O2', '(%) PORCENTAJES FORANEO');
      $excel->combinarCeldas('O2:Q2');
      $excel->estiloCelda('O2:Q2','000000',9);
      $excel->bordes('O2:Q2','ffffff');
      $excel->alinearCeldaCentro('K2:Q2');
      //----
      $excel->valorCelda('R2', 'COMISION EST. FORANEO');
      $excel->combinarCeldas('R2:R3');
      $excel->estiloCelda('R2:R3','1f497d',9);
      $excel->alinearCeldaCentro('R2:R3');
      $excel->bordes('R2:R3','000000');
      $excel->ajustarTexto('R2:R3');
      // LOCAL II
      $excel->valorCelda('C3', 'ASIGNADOS');
      $excel->valorCelda('D3', 'POR NOTIFICAR');
      $excel->valorCelda('E3', 'NO LOCALIZADO');
      $excel->valorCelda('F3', 'NOTIFICADO');
      $excel->valorCelda('G3', 'POR NOTIFICAR');
      $excel->valorCelda('H3', 'NO LOCALIZADO');
      $excel->valorCelda('I3', 'NOTIFICADO');
      $excel->alinearCeldaCentro('C3:I3');
      $excel->estiloCelda('C3:F3','c4bd97',9,'000000');
      $excel->estiloCelda('G3:I3','ccc0da',9,'000000');
      $excel->bordes('C3:C3','000000');
      $excel->bordes('D3:D3','000000');
      $excel->bordes('E3:E3','000000');
      $excel->bordes('F3:F3','000000');
      $excel->bordes('G3:G3','000000');
      $excel->bordes('H3:H3','000000');
      $excel->bordes('I3:I3','000000');
      // FORANEO II
      $excel->valorCelda('K3', 'ASIGNADOS');
      $excel->valorCelda('L3', 'POR NOTIFICAR');
      $excel->valorCelda('M3', 'NO LOCALIZADO');
      $excel->valorCelda('N3', 'NOTIFICADO');
      $excel->valorCelda('O3', 'POR NOTIFICAR');
      $excel->valorCelda('P3', 'NO LOCALIZADO');
      $excel->valorCelda('Q3', 'NOTIFICADO');
      $excel->alinearCeldaCentro('K3:Q3');
      $excel->estiloCelda('K3:N3','c4bd97',9,'000000');
      $excel->estiloCelda('O3:Q3','ccc0da',9,'000000');
      $excel->bordes('K3:K3','000000');
      $excel->bordes('L3:L3','000000');
      $excel->bordes('M3:M3','000000');
      $excel->bordes('N3:N3','000000');
      $excel->bordes('O3:O3','000000');
      $excel->bordes('P3:P3','000000');
      $excel->bordes('Q3:Q3','000000');
      //---- FINAL
      $excel->valorCelda('S2', '% TOTAL NOTIFICADOS');
      $excel->combinarCeldas('S2:S3');
      $excel->estiloCelda('S2:S3','76933c',9);
      $excel->alinearCeldaCentro('S2:S3');
      $excel->bordes('S2:S3','000000');
      $excel->ajustarTexto('S2:S3');
      //----
      $excel->valorCelda('T2', 'NIVEL EFICIENCIA');
      $excel->combinarCeldas('T2:T3');
      $excel->estiloCelda('T2:T3','76933c',9);
      $excel->alinearCeldaCentro('T2:T3');
      $excel->bordes('T2:T3','000000');
      $excel->ajustarTexto('T2:T3');
      //----
      $excel->valorCelda('U2', 'COMISION TOTAL ESTIMADA');
      $excel->combinarCeldas('U2:U3');
      $excel->estiloCelda('U2:U3','76933c',9);
      $excel->alinearCeldaCentro('U2:U3');
      $excel->bordes('U2:U3','000000');
      $excel->ajustarTexto('U2:U3');
      //----
      $excel->inmovilizar(3,4);
      //
      $fila = 4;
      $filaInicio = $fila;
      $idNotificiadorTmp = "";
      $resultado = $this->Modelo->getDatosInfNotificacionesxEficienciaExcel($fechaInicio,$fechaTermino)->getResult();
      foreach($resultado as $row) {
         $excel->valorCelda('A'.$fila, mb_strtoupper($row->nombre_notificador,'UTF-8'));
         $excel->valorCelda('B'.$fila, $row->total_asignados);
         // LOCAL
         $excel->valorCelda('C'.$fila, $row->total_asignados_local);
         $excel->valorCelda('D'.$fila, $row->total_por_notificar_local);
         $excel->valorCelda('E'.$fila, $row->total_no_localizado_local);
         $excel->valorCelda('F'.$fila, $row->total_notificado_local);
         $excel->valorCelda('G'.$fila, '=D'.$fila.'/C'.$fila.'');
         $excel->valorCelda('H'.$fila, '=E'.$fila.'/C'.$fila.'');
         $excel->valorCelda('I'.$fila, '=F'.$fila.'/C'.$fila.'');
         if(mb_strtoupper($row->desc_eficiencia,'UTF-8') == 'ALTA') {
            $excel->valorCelda('J'.$fila, '=F'.$fila.' * 30');
         }
         else if(mb_strtoupper($row->desc_eficiencia,'UTF-8') == 'MEDIA') {
            $excel->valorCelda('J'.$fila, '=F'.$fila.' * 25');
         }
         else if(mb_strtoupper($row->desc_eficiencia,'UTF-8') == 'BAJA') {
            $excel->valorCelda('J'.$fila, '=F'.$fila.' * 10');
         }
         else {
            $excel->valorCelda('J'.$fila, 0.00);
         }
         // FORANEO
         $excel->valorCelda('K'.$fila, $row->total_asignados_foraneo);
         $excel->valorCelda('L'.$fila, $row->total_por_notificar_foraneo);
         $excel->valorCelda('M'.$fila, $row->total_no_localizado_foraneo);
         $excel->valorCelda('N'.$fila, $row->total_notificado_foraneo);
         $excel->valorCelda('O'.$fila, '=L'.$fila.'/K'.$fila.'');
         $excel->valorCelda('P'.$fila, '=M'.$fila.'/K'.$fila.'');
         $excel->valorCelda('Q'.$fila, '=N'.$fila.'/K'.$fila.'');
         if(mb_strtoupper($row->desc_eficiencia,'UTF-8') == 'ALTA') {
            $excel->valorCelda('R'.$fila, '=N'.$fila.' * 32');
            $excel->estiloTexto('T'.$fila.':T'.$fila,9,'66bb6a');
         }
         else if(mb_strtoupper($row->desc_eficiencia,'UTF-8') == 'MEDIA') {
            $excel->valorCelda('R'.$fila, '=N'.$fila.' * 27');
            $excel->estiloTexto('T'.$fila.':T'.$fila,9,'ffa632');
         }
         else if(mb_strtoupper($row->desc_eficiencia,'UTF-8') == 'BAJA') {
            $excel->valorCelda('R'.$fila, '=N'.$fila.' * 12');
            $excel->estiloTexto('T'.$fila.':T'.$fila,9,'ea4335');
         }
         else {
            $excel->valorCelda('R'.$fila, 0.00);
         }
         //
         $excel->valorCelda('S'.$fila, '=(F'.$fila.' + N'.$fila.')/B'.$fila.'');
         $excel->valorCelda('T'.$fila, mb_strtoupper($row->desc_eficiencia,'UTF-8'));
         $excel->valorCelda('U'.$fila, '=J'.$fila.' + R'.$fila.'');
         $fila++;
      }
      $ultimaFila = $fila - 1;
      $excel->textoTamano('A'.$filaInicio.':U'.$ultimaFila,9);
      $excel->alinearCeldaCentro('B'.$filaInicio.':I'.$ultimaFila);
      $excel->alinearCeldaDerecha('J'.$filaInicio.':J'.$ultimaFila);
      $excel->formatoNumeroSD('B'.$filaInicio.':F'.$ultimaFila);
      $excel->formatoPorcentaje('G'.$filaInicio.':I'.$ultimaFila);
      $excel->formatoContable('J'.$filaInicio.':J'.$ultimaFila,true);
      //
      $excel->alinearCeldaCentro('K'.$filaInicio.':Q'.$ultimaFila);
      $excel->alinearCeldaDerecha('R'.$filaInicio.':R'.$ultimaFila);
      $excel->formatoNumeroSD('K'.$filaInicio.':N'.$ultimaFila);
      $excel->formatoPorcentaje('O'.$filaInicio.':Q'.$ultimaFila);
      $excel->formatoContable('R'.$filaInicio.':R'.$ultimaFila,true);
      //
      $excel->alinearCeldaCentro('S'.$filaInicio.':T'.$ultimaFila);
      $excel->alinearCeldaDerecha('U'.$filaInicio.':U'.$ultimaFila);
      $excel->formatoPorcentaje('S'.$filaInicio.':S'.$ultimaFila);
      $excel->formatoContable('U'.$filaInicio.':U'.$ultimaFila,true);
      $excel->estiloTexto('S'.$filaInicio.':S'.$ultimaFila,9);
      $excel->estiloTexto('U'.$filaInicio.':U'.$ultimaFila,9);
      //
      $excel->anchoColumna('A', 33);
      $excel->anchoColumna('B', 15);
      $excel->anchoColumna('C', 15);
      $excel->anchoColumna('D', 16);
      $excel->anchoColumna('E', 16);
      $excel->anchoColumna('F', 15);
      $excel->anchoColumna('G', 16);
      $excel->anchoColumna('H', 16);
      $excel->anchoColumna('I', 15);
      $excel->anchoColumna('J', 15);
      $excel->anchoColumna('K', 15);
      $excel->anchoColumna('L', 16);
      $excel->anchoColumna('M', 16);
      $excel->anchoColumna('N', 15);
      $excel->anchoColumna('O', 16);
      $excel->anchoColumna('P', 16);
      $excel->anchoColumna('Q', 15);
      $excel->anchoColumna('R', 15);
      $excel->anchoColumna('S', 15);
      $excel->anchoColumna('T', 15);
      $excel->anchoColumna('U', 16);
      $excel->zoomHoja(110);
      $excel->tituloHoja('Notificadores_xEficiencias');
      //
      $excel->seleccionarHoja(0);
      $nombreArchivo = 'InformeNotificaciones';
      $excel->descargar($nombreArchivo);
   }
}