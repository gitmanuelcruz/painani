<?php
namespace App\Controllers;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
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
            $data['btn_layout'] = $this->utilerias->getValidaPrivilegio($usuario,"PRIV_BTN_CARGALAYOUT_NOTIFICACION","PRIVILEGIO");
            $notEstatus = "'POR_NOTIFICAR','NO_LOCALIZADO'";
            $data['estatus'] = $this->MServicios->getEstatusNotificacion($notEstatus)->getResult();
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
   public function getComboRegistro() {
      $results = array(
         'prioridades' => $this->Modelo->getPrioridades()->getResult()
      );

      return $this->response->setJSON($results);
   }
   //
	public function existeOficio() {
		$numOficio = $this->request->getPost("num_oficio");
      $numOrden  = $this->request->getPost("num_orden");
      $results = array(
         'totalOficio' => $this->Modelo->getExisteOficio($numOficio)->getRow()->total,
         'totalOrden'  => $this->Modelo->getExisteOrden($numOrden)->getRow()->total
      );
		
	  return $this->response->setJSON($results);
	} 
	//
   public function guardarNotificacion() {
      set_time_limit(0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $idNotificacion = $this->request->getPost("vm_id_notificacion");
         $numOficio = $this->request->getPost("vm_num_oficio");
         $numOrden  = $this->request->getPost("vm_num_orden");
         $fechaOficio = $this->request->getPost("vm_fecha_oficio");
         $idInsumo = $this->request->getPost("vm_id_insumo");
         $idBloque = $this->request->getPost("vm_id_bloque");
         $montoPresuntiva = $this->request->getPost("vm_monto_presuntiva");
         $idPrioridad = $this->request->getPost("vm_id_prioridad");
         $domicilio   = $this->request->getPost("vm_domicilio");
         $referenciaUbicacion = $this->request->getPost("vm_referencia_ubicacion");
         $usuario = $this->session->get("usuario");
         $ip      = $this->session->get("ip");
         $idEstatus = "POR_ASIGNAR";
         $bandEstatus = 0;
         $existOficio = $this->Modelo->getExisteOficio($numOficio)->getRow()->total;
         $existOrden = $this->Modelo->getExisteOrden($numOrden)->getRow()->total;
         if(!empty($idNotificacion)){
            $datos = $this->Modelo->getDatosNotificacion($idNotificacion)->getRow();
            if(mb_strtoupper(trim($datos->num_oficio),'UTF-8') == mb_strtoupper(trim($numOficio),'UTF-8')) {
               $existOficio = 0;
            }
            if(mb_strtoupper(trim($datos->num_orden),'UTF-8') == mb_strtoupper(trim($numOrden),'UTF-8')) {
               $existOrden = 0;
            }
            if($datos->id_estatus_notificacion != $idEstatus) {
               $existOficio = 1;
               $existOrden  = 1;
               $bandEstatus = 1;
            }
         }
         $this->db->transBegin();
         //
         if((int)$existOficio == 0) {
            if((int)$existOrden == 0) {
               if(empty($idNotificacion)){
                  $result = $this->Modelo->insertNotificacion(
                     $numOficio,$numOrden,$fechaOficio,$idInsumo,$idBloque,$montoPresuntiva,$idPrioridad,$domicilio,
                     $referenciaUbicacion,$idEstatus,$usuario,$ip);
               }
               else{
                  $result = $this->Modelo->updateNotificacion(
                     $idNotificacion,$numOficio,$numOrden,$fechaOficio,$idInsumo,$idBloque,$montoPresuntiva,$idPrioridad,
                     $domicilio,$referenciaUbicacion,$usuario,$ip);
               }
            }
            else {
               if((int)$bandEstatus == 0) {
                  $result = array(false,"El n&uacute;mero de orden (<b>".$numOrden."</b>) ya se encuentra registrado",1);
               }
               else {
                  $result = array(false,"El n&uacute;mero de orden (<b>".$numOrden."</b>) ya se encuentra asignado a un paquete, ya no se puede modificar",1);
               }
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
   // TODO: Proceso de carga de layout de notificaciones (oficios)
   public function getComboRegxLayout() {
      $results = array(
         'prioridades' => $this->Modelo->getPrioridadesxLayout()->getResult()
      );

      return $this->response->setJSON($results);
   }
   //
   public function descargarFormatoLayout(){
      $filename = "FORMATO_LAYOUT_OFICIOS.xlsx";
      $file = $this->utilerias->urlFiles().'formato_layout_num_oficios/'.$filename;
      $extension = mb_strtolower($this->utilerias->getFileExtension($file), 'UTF-8');
      header("Content-disposition: attachment; filename=".$filename."");
      header("Content-type: application/".$extension."");
      readfile($file);
   }
   //
   public function guardarLayout() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $prioridades = $this->request->getPost("vm_idprioridad");
         $file_excel  = $this->request->getFile("vm_archivo_layout");
         $idNivelUsuario = $this->session->get("id_nivel_usuario");
         $usuario     = $this->session->get("usuario");
         $ip          = $this->session->get("ip");
         $anio        = date("Y",now());
         $urlDefault  = $this->utilerias->urlFiles();
         $rutaLayout  = "notificaciones/layout/".$usuario;
         $path_excel  = "";
         $caracteres  = array('$',',',' ','-');
         $caracteresNew = array('_','_','_','_');
         $consecutivo   = 1;
         $contadorInicial = 0;
         $contador = 0;
         $contadorProceso = 0;
         $this->db->transBegin();
         //
         $this->Modelo->deleteNotificacionesTmp($usuario);
         /*if(!empty($prioridades)) {
            foreach($prioridades as $key) {
               $idPrioridad = $key;
               $montoMinimo = $this->request->getPost("vm_monto_min_".$key);
               $montoMaximo = $this->request->getPost("vm_monto_max_".$key);
               $result = $this->Modelo->insertPrioridadRangoMontoTmp($usuario,$idPrioridad,$montoMinimo,$montoMaximo);
               if(!$result[0]) {
                  $contadorInicial++;
                  $this->db->transRollback();
                  break;
               }
            }
         }
         else {
            $contadorInicial++;
         }*/
         //
         if(!empty($file_excel) && (int)$contadorInicial == 0) {
            $ext = $file_excel->guessExtension();
            $extFile = ".".$ext;
            $nombreArchivo = basename($file_excel->getName(),$extFile);
            $nombreFile = date("dmYHis",now())."_".strtolower(str_replace($caracteres,$caracteresNew,trim($nombreArchivo)));
            $resultFile = $this->utilerias->uploadFile($rutaLayout,$nombreFile,"vm_archivo_layout");
            if(!$resultFile[0]) {
               $contador++;
               $result = array(false, strtoupper($resultFile[1]));
            }
            else {
               $path_excel = $resultFile[1];
            }
         }
         else {
            $contador++;
            $result = array(false, 'El archivo del layout esta vacio');
         }

         if($contadorInicial == 0 && $contador == 0) {
            $documento = IOFactory::load($path_excel);
            $worksheet = $documento->getSheet(0);
            $highestRow = $worksheet->getHighestRow();
            $highestColumn = $worksheet->getHighestColumn();
            $highestColumnIndex = Coordinate::columnIndexFromString($highestColumn);
            for ($row = 2; $row <= $highestRow; ++$row) {
               if($worksheet->getCellByColumnAndRow(1, $row)->getValue() != "") {
                  $consecutivo++;
                  $numOrden    = substr(trim($worksheet->getCellByColumnAndRow(1, $row)->getValue()),0,49);
                  $numOficio   = substr(trim($worksheet->getCellByColumnAndRow(1, $row)->getValue()),0,49);
                  $fechaOficio = substr(trim($worksheet->getCellByColumnAndRow(2, $row)->getValue()),0,15);
                  $prioridad   = substr(trim($worksheet->getCellByColumnAndRow(3, $row)->getValue()),0,49);
                  $domicilio   = substr(trim(mb_strtoupper($worksheet->getCellByColumnAndRow(4, $row)->getValue(),'UTF-8')),0,4000);
                  $referenciaUbicacion = substr(trim(mb_strtoupper($worksheet->getCellByColumnAndRow(5, $row)->getValue(),'UTF-8')),0,4000);
                  //
                  $result = $this->Modelo->insertNotificacionesTmp(
                     $consecutivo,$usuario,$numOrden,$numOficio,$fechaOficio,$prioridad,$domicilio,$referenciaUbicacion);
                  if(!$result[0]) {
                     $contadorProceso++;
                     $this->db->transRollback();
                     $this->utilerias->removeFile($path_excel);
                     break;
                  }
               }
            }
         }
         else {
            $this->utilerias->removeFile($path_excel);
            $contadorProceso++;
         }
         //
         if($contadorInicial == 0 && $contador == 0 && $contadorProceso == 0) {
            $total_validado = $this->Modelo->getValidLayoutProcedimiento($usuario,$idNivelUsuario)->getRow()->ret_valid;
            if($total_validado) {
               $this->db->transCommit();
               $this->utilerias->removeFile($path_excel);
               $this->utilerias->removeDirectorioFile($urlDefault.$rutaLayout);
               $response = array('respuesta' => false, 'mensaje' => '', 'usuario' => $usuario, 'error' => 1);
            }
            else {
               $result = $this->Modelo->getProcedureMigrar($usuario,$ip);
               if($result[0]) {
                  $this->db->transCommit();
                  $this->utilerias->removeDirectorioFile($urlDefault.$rutaLayout);
                  $response = array('respuesta' => true, 'mensaje' => $result[1]);
               }
               else {
                  $this->db->transRollback();
                  $this->utilerias->removeFile($path_excel);
                  $this->utilerias->removeDirectorioFile($urlDefault.$rutaLayout);
                  $response = array('respuesta' => false, 'mensaje' => $result[1], 'error' => 0);
               }
            }
         }
         else {
            $this->db->transRollback();
            $this->utilerias->removeFile($path_excel);
            $this->utilerias->removeDirectorioFile($urlDefault.$rutaLayout);
            $response = array('respuesta' => false, 'mensaje' => $result[1], 'error' => 0);
         }
      }

      return $this->response->setJSON($response);
   }
   //
   public function observacionesLayoutPag() {
      $usuario = $this->request->getPost("user_registro");
      $pagina  = 0;
      $resultados = 0;

      if (!empty($this->request->getPost("pagina")))
         $pagina = $this->request->getPost("pagina");
      if (!empty($this->request->getPost("resultados")))
         $resultados = $this->request->getPost("resultados");

      $query = $this->Modelo->getObservNotificacionesOficiosTmp($usuario);
      $results = $this->utilerias->loadJSON($query, $pagina, $resultados);
      return $this->response->setJSON($results);
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
            $result = array(false,"El n&uacute;mero de orden (<b>".$numOficio."</b>) ya se encuentra asignado a un paquete, ya no se puede <b class='text-danger'>CANCELAR</b>",1);
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