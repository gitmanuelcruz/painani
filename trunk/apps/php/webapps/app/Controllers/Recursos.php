<?php
namespace App\Controllers;
use App\Models\MRecursos;

class Recursos extends BaseController
{
   function __construct() {
      $this->MRecursos = new MRecursos();
   }

   public function index() {
      if ($this->session->get("logueado") != true)
         return view('errors/message_session');
      else {
         $usuario = $this->session->get("usuario");
         $validarModulo = $this->utilerias->getValidaPrivilegio($usuario, 'SEG_RECURSOS', 'MODULO');
         if($validarModulo > 0) {
            $data['usuario'] = $usuario;
				$data['data_user'] = $this->utilerias->getDatosSession();
            $data['titulo'] = "Recursos";
            $data['btn_nuevo'] = $this->utilerias->getValidaPrivilegio($usuario, 'PRIV_BTN_NVO_RECURSOS', 'PRIVILEGIO');
				return view('seguridad/recursos/consulta_recursos', $data);
         }
         else {
            $message = array(
               'data_user' => $this->utilerias->getDatosSession(),
               'title' => 'VALIDACI&Oacute;N DE PRIVILEGIO DE M&Oacute;DULO',
               'detalle' => 'SIN PRIVILEGIOS PARA ACCEDER AL M&Oacute;DULO DE <b>RECURSOS</b>');
				return view('errors/message_error', $message);
         }
      }
   }
   //!
   public function getRecursos() {
      $codigo = $this->request->getPost("codigo");
      $nombre = $this->request->getPost("nombre");
      $usuario = $this->session->get("usuario");
      $icon_editar = $this->utilerias->getValidaPrivilegio($usuario, 'PRIV_BTN_EDIT_RECURSOS', 'PRIVILEGIO');
      $pagina = 0;
      $resultados = 0;

      if (!empty($this->request->getPost("pagina")))
         $pagina = $this->request->getPost("pagina");
      if (!empty($this->request->getPost("resultados")))
         $resultados = $this->request->getPost("resultados");

      $query = $this->MRecursos->getDatosRecursosPag($codigo, $nombre, $icon_editar);
      $results = $this->utilerias->loadJSON($query, $pagina, $resultados);

      return $this->response->setJSON($results);
   }
   // TODO: Función que guardar y actualiza los datos del recurso
   public function getCombosRecurso() {
      $tipo = $this->request->getPost("tipo");
      $id_tabla = $this->request->getPost("id_tabla");
      $shema = "painani";

      if($tipo == 1) {
         $results = array(
            'tblFuentes' => $this->MRecursos->get_renella_combo('TABLAS',null,$shema)->getResult()
         );
      }
      else if($tipo == 2) {
         $results = array(
            'campo_id' => $this->MRecursos->get_renella_combo('CAMPOS_TABLA',$id_tabla,$shema)->getResult(),
            'campo_visualiza' => $this->MRecursos->get_renella_combo('CAMPOS_TABLA',$id_tabla,$shema)->getResult()
         );
      }
      else {
         $results = array(
            'tblFuentes' => $this->MRecursos->get_renella_combo('TABLAS',null,$shema)->getResult(),
            'campo_id' => $this->MRecursos->get_renella_combo('CAMPOS_TABLA',$id_tabla,$shema)->getResult(),
            'campo_visualiza' => $this->MRecursos->get_renella_combo('CAMPOS_TABLA',$id_tabla,$shema)->getResult()
         );
      }

      return $this->response->setJSON($results);
   }

   public function guardarRecurso() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_recurso = $this->request->getPost("vm_id_recurso");
         $codigo_recurso = $this->request->getPost("vm_codigo_rec");
         $nombre_recurso = $this->request->getPost("vm_nombre_rec");
         $tabla_fuente = $this->request->getPost("vm_id_tabla");
         $campo_id = $this->request->getPost("vm_id_campo_id");
         $campo_visualiza = $this->request->getPost("vm_id_campo_visualiza");
         $id_estatus = $this->request->getPost("vm_id_estatus");
         $query_string = $this->request->getPost("vm_query");
         $usuario = $this->session->get("usuario");
         $ip = $this->session->get("ip");
         $contador = 0;
         $this->db->transBegin();

         if (empty($id_recurso)) {
            $result = $this->MRecursos->insertaRecurso(
               $codigo_recurso,$nombre_recurso,$tabla_fuente,$campo_id,$campo_visualiza,$id_estatus,
               $query_string,$usuario,$ip);
            if($result[0]) {
               $result = $this->MRecursos->queryRecursos($query_string);
               if(!$result[0]) {
                  $contador++;
                  exit;
               }
            }
            else {
               $contador++;
               exit;
            }
         }
         else {
            $result = $this->MRecursos->actualizaRecurso(
               $id_recurso,$nombre_recurso,$tabla_fuente,$campo_id,$campo_visualiza,$id_estatus,$query_string,
               $usuario,$ip);
            if($result[0]) {
               $result = $this->MRecursos->queryRecursos($query_string);
               if(!$result[0]) {
                  $contador++;
                  exit;
               }
            }
            else {
               $contador++;
               exit;
            }
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
}
?>