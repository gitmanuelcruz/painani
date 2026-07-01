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
      $excel->formatoContable('F'.$filaInicio.':F'.$ultimaFila);
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
      //* SEGUNDA HOJA
      $excel->crearHoja($numHoja);
      $excel->estilosFila('INFORME DE NOTIFICADORES DEL '.date("d/m/Y", strtotime($fechaInicio)).' AL '.date("d/m/Y", strtotime($fechaTermino)), 'A1', 'Arial', true, '11', '999797');
      $excel->combinarCeldas('A1:I1');
      $excel->alinearCeldaCentro('A1:I1');
      $excel->altoFila(1, 20);
      //
      $excel->valorCelda('A2', 'NOTIFICADOR');
      $excel->combinarCeldas('A2:A3');
      $excel->estiloCelda('A2:A3','1f497d',9);
      $excel->alinearCeldaCentro('A2:A3');
      $excel->bordes('A2:A3','000000');
      //----
      $excel->valorCelda('B2', 'TOTALES');
      $excel->combinarCeldas('B2:E2');
      $excel->estiloCelda('B2:E2','000000',9);
      $excel->bordes('B2:E2','ffffff');
      //----
      $excel->valorCelda('F2', 'PORCENTAJES (%)');
      $excel->combinarCeldas('F2:H2');
      $excel->estiloCelda('F2:H2','000000',9);
      $excel->bordes('F2:H2','ffffff');
      $excel->alinearCeldaCentro('B2:H2');
      //----
      $excel->valorCelda('I2', 'ESTATUS');
      $excel->combinarCeldas('I2:I3');
      $excel->estiloCelda('I2:I3','1f497d',9);
      $excel->alinearCeldaCentro('I2:I3');
      $excel->bordes('I2:I3','000000');
      //
      $excel->valorCelda('B3', 'NO. ORDEN');
      $excel->valorCelda('C3', 'POR NOTIFICAR');
      $excel->valorCelda('D3', 'NO LOCALIZADO');
      $excel->valorCelda('E3', 'NOTIFICADO');
      $excel->valorCelda('F3', 'POR NOTIFICAR');
      $excel->valorCelda('G3', 'NO LOCALIZADO');
      $excel->valorCelda('H3', 'NOTIFICADO');
      $excel->alinearCeldaCentro('B3:H3');
      $excel->estiloCelda('B3:E3','c4bd97',9,'000000');
      $excel->estiloCelda('F3:H3','ccc0da',9,'000000');
      $excel->bordes('B3:B3','000000');
      $excel->bordes('C3:C3','000000');
      $excel->bordes('D3:D3','000000');
      $excel->bordes('E3:E3','000000');
      $excel->bordes('F3:F3','000000');
      $excel->bordes('G3:G3','000000');
      $excel->bordes('H3:H3','000000');
      $excel->inmovilizar(2,4);
      //
      $fila = 4;
      $filaInicio = $fila;
      $idNotificiadorTmp = "";
      $resultado = $this->Modelo->getDatosInfNotificacionesxEficienciaExcel($fechaInicio,$fechaTermino)->getResult();
      foreach($resultado as $row) {
         $excel->valorCelda('A'.$fila, mb_strtoupper($row->nombre_notificador,'UTF-8'));
         $excel->valorCelda('B'.$fila, $row->total_num_ordenes);
         $excel->valorCelda('C'.$fila, $row->total_por_notificar);
         $excel->valorCelda('D'.$fila, $row->total_localizado);
         $excel->valorCelda('E'.$fila, $row->total_notificado);
         $excel->valorCelda('F'.$fila, '=C'.$fila.'/B'.$fila.'');
         $excel->valorCelda('G'.$fila, '=D'.$fila.'/B'.$fila.'');
         $excel->valorCelda('H'.$fila, '=E'.$fila.'/B'.$fila.'');
         $excel->valorCelda('I'.$fila, mb_strtoupper($row->desc_eficiencia,'UTF-8'));
         $fila++;
      }
      $ultimaFila = $fila - 1;
      $excel->textoTamano('A'.$filaInicio.':I'.$ultimaFila,9);
      $excel->alinearCeldaCentro('B'.$filaInicio.':H'.$ultimaFila);
      $excel->formatoNumeroSD('B'.$filaInicio.':E'.$ultimaFila);
      $excel->formatoPorcentaje('F'.$filaInicio.':H'.$ultimaFila);
      $excel->alinearCeldaCentro('I'.$filaInicio.':I'.$ultimaFila);
      //
      $excel->anchoColumna('A', 40);
      $excel->anchoColumna('B', 15);
      $excel->anchoColumna('C', 15);
      $excel->anchoColumna('D', 15);
      $excel->anchoColumna('E', 15);
      $excel->anchoColumna('F', 15);
      $excel->anchoColumna('G', 15);
      $excel->anchoColumna('H', 15);
      $excel->anchoColumna('I', 15);
      $excel->zoomHoja(120);
      $excel->tituloHoja('Notificadores_xEficiencias');
      //
      $excel->seleccionarHoja(0);
      $nombreArchivo = 'InformeNotificaciones';
      $excel->descargar($nombreArchivo);
   }
}