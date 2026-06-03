<?php
namespace App\Controllers;
use App\Models\MRoles;
use App\Models\MMenu;

class Roles extends BaseController
{
   function __construct() {
      $this->MRoles = new MRoles();
      $this->MMenus = new MMenu();
   }
   //
   public function index() {
      if ($this->session->get("logueado") != true)
         return view('errors/message_session');
      else {
         $usuario = $this->session->get("usuario");
         $validarModulo = $this->utilerias->getValidaPrivilegio($usuario, 'SEG_ROLES', 'MODULO');
         if($validarModulo > 0) {
            $data['usuario'] = $usuario;
				$data['data_user'] = $this->utilerias->getDatosSession();
            $data['titulo'] = "Roles";
            $data['btn_nuevo'] = $this->utilerias->getValidaPrivilegio($usuario, 'PRIV_BTN_NVO_ROL', 'PRIVILEGIO');
				return view('seguridad/roles/consulta_roles', $data);
         }
         else {
            $message = array(
               'data_user' => $this->utilerias->getDatosSession(),
               'title' => 'VALIDACI&Oacute;N DE PRIVILEGIO DE M&Oacute;DULO',
               'detalle' => 'SIN PRIVILEGIOS PARA ACCEDER AL M&Oacute;DULO DE <b>ROLES</b>');
				return view('errors/message_error', $message);
         }
      }
   }
   //
   public function getRoles() {
      $nombre_descripcion = $this->request->getPost("name_descripcion");
      $usuario = $this->session->get("usuario");
      $icon_configuracion = $this->utilerias->getValidaPrivilegio($usuario, 'PRIV_BTN_CONFIG_ROL', 'PRIVILEGIO');
      $icon_save_config   = $this->utilerias->getValidaPrivilegio($usuario, 'PRIV_BTN_SAVE_CONFIG_ROL', 'PRIVILEGIO');
      $icon_editar        = $this->utilerias->getValidaPrivilegio($usuario, 'PRIV_BTN_EDIT_ROL', 'PRIVILEGIO');
      $pagina     = 0;
      $resultados = 0;

      if (!empty($this->request->getPost("pagina")))
         $pagina = $this->request->getPost("pagina");
      if (!empty($this->request->getPost("resultados")))
         $resultados = $this->request->getPost("resultados");


      $query = $this->MRoles->getDatosRolesPag(
         $nombre_descripcion,$icon_configuracion,$icon_save_config,$icon_editar);
      $results = $this->utilerias->loadJSON($query,$pagina,$resultados);

      return $this->response->setJSON($results);
   }
   // TODO: Proceso de registrar y editar los datos del rol
   public function guardarRol() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_rol = $this->request->getPost("vm_id_rol");
         $nombre_rol = $this->request->getPost("vm_nombre_rol");
         $descripcion = $this->request->getPost("vm_descripcion_rol");
         $id_estatus = $this->request->getPost("vm_id_estatus");
         $usuario = $this->session->get("usuario");
         $ip = $this->session->get("ip");

         if (empty($id_rol)) {
            $result = $this->MRoles->insertaRol($nombre_rol,$descripcion,$id_estatus,$usuario,$ip);
         }
         else {
            $result = $this->MRoles->actualizaRol($id_rol,$nombre_rol,$descripcion,$id_estatus,$usuario,$ip);
         }

         if ($result[0]) {
            $response = array('respuesta' => true, 'mensaje' => $result[1]);
         }
         else {
            $response = array('respuesta' => false, 'mensaje' => $result[1]);
         }
      }

      return $this->response->setJSON($response);
   }
   // TODO: Configuracion de Roles Privilegios
   public function getTreeMenuRolPrivilegio() {
      $id_rol = $this->request->getPost("id_rol");
      $result = array(
         'datale' => $this->MRoles->getDatosLecturaEscrituraRol($id_rol)->getRow(),
         'tree' => $this->MMenus->getMenuRolAsginar($id_rol)->getResult()
      );
      
      return $this->response->setJSON($result);    
   }
   //
   public function guardaConfigRolesPrivilegios() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_rol = $this->request->getPost("vm_id_rol");
         $id_menu = $this->request->getPost("id");
         $id_radio = $this->request->getPost("tipolec");
         $usuario = $this->session->get("usuario");
         $ip = $this->session->get("ip");
         $solo_lectura = 0;
         $lectura_escritura = 0;
         $contador = 0;
         $total = 0;
         $this->db->transBegin();

         if($id_radio[0] == 1) {
            $solo_lectura = 1;
         }
         else {
            $lectura_escritura = 1;
         }

         $datos = $this->MRoles->getValidacionRolPrivilegios($id_rol);
         if($datos->getNumRows() > 0) {
            $data = $datos->getRow();
            $total = $data->total;
         }

         if($total != count($id_menu)) {
            $result = $this->MRoles->deleteRolPrivilegios($id_rol);
            if($result[0]) {
               foreach ($id_menu as $idmenu) {
                  $result = $this->MRoles->insertaRolPrivilegios($id_rol,$idmenu,$solo_lectura,$lectura_escritura,$usuario,$ip);
                  if(!$result[0]) {
                     $this->db->transRollback();
                     $contador++;
                     break;
                  }
                  else {
                     $result = array(true, 'El proceso se ha realizado correctamente');
                  }
               }
            }
            else {
               $contador++;
               $result = array(false, 'ERROR AL REGISTRAR EL ROL');
            }
         }
         else {
            if($id_radio[0] != $data->solo_lectura && ($id_radio[0]-1) != $data->lectura_escritura) {
               $result = $this->MRoles->actualizaLecturaEscrituraRolPriv($id_rol,$solo_lectura,$lectura_escritura,$usuario,$ip);
               if(!$result[0]) {
                  $this->db->transRollback();
                  $contador++;
               }
            }
            else {
               $result = array(true, 'El proceso se ha realizado correctamente');
            }
         }

         if($contador == 0) {
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