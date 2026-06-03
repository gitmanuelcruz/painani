<?php
namespace App\Controllers;
use App\Models\MLogin;
use App\Models\MServicios;

class WLogin extends BaseController
{
   function __construct() {
      $this->Modelo = new MLogin();
      $this->MServicios = new MServicios();
   }
   //
   public function index() {
      $this->session->destroy();
      $data['titulo'] = 'Login | Plataforma PAINANI';
      return view('login', $data);
   }
   //
   public function autenticarUser() {
      ini_set('max_execution_time', 0);
      $usuario = $this->request->getPost("usuario");
      $pwd = $this->request->getPost("password");
      $band = false;
      $title = "";
      $msj = "";
      $resultado = $this->Modelo->getValidarExisteUsuario($usuario, $pwd)->getRow();
      if ($resultado->total > 0) {
         $resultado = $this->Modelo->getValidaUsuarioBloqueado($usuario)->getRow();
         if ($resultado->total == 0) {
            $resultado = $this->Modelo->getValidaVigenciaUsuario($usuario)->getRow();
            if ($resultado->total > 0) {
               $resultado = $this->Modelo->getValidaRolesUsuario($usuario)->getRow();
               if ($resultado->total > 0) {
                  $band = true;
               } else {
                  $title = "Vigencia de roles del usuario";
                  $msj = "La vigencia de sus roles se ha caducado o no tiene asignado ningun rol";
               }
            } else {
               $title = "Vigencia de usuario";
               $msj = "La vigencia del usuario se ha caducado";
            }
         } else {
            $title = "Validación de autentificaci&oacute;n";
            $msj = "El usuario esta bloqueado";
         }
      } else {
         $title = "Validación de usuario";
         $msj = "Los datos del usuario son incorrectos";
      }

      $resp = array('band' => $band, 'title' => $title, 'message' => $msj);
      return $this->response->setJSON($resp);

   }
   // TODO: Funcion donde se genera la session del usuario
   public function getSessionUsuario() {
      ini_set('max_execution_time', 0);
      $idusuario = $this->request->getPost("usuario_t");
      $usuario = strtolower(trim($idusuario));
      $num_intentos = $this->request->getPost("contador");
      $datos = $this->MServicios->getDatosUsuario($usuario)->getRow();
      $ipPc = $this->utilerias->getIP();
      $macAddress = $this->utilerias->getMACAddress();
      $id_session = session_id();
      $this->db->transBegin();
      //
      $id_bitacora = $this->Modelo->insertaBitacoraSesion($usuario,$num_intentos,$ipPc);
      if ($id_bitacora[0]) {
         $this->Modelo->actualizaNumIntentosUsuario($num_intentos,$usuario,$ipPc);
         $this->db->transCommit();
         $datos_session = array(
            'usuario'          => $usuario,
            'nombre_completo'  => $datos->nombre_completo,
            'email'            => $datos->correo_electronico,
            'sexo'             => $datos->codigo_genero,
            'id_nivel_usuario' => $datos->id_nivel_usuario,
            'thema'            => substr($datos->theme_css, 0, 1),
            'sidebar'          => $datos->menu_colapsed,
            'es_notificador'   => $datos->es_notificador,
            'foto'             => $datos->path_foto,
            'id_session'       => $id_session,
            'id_bitacora'      => $id_bitacora[1],
            'ip'               => $ipPc,
            'logueado'         => true
         );
         $this->session->set($datos_session);
         return redirect()->to('Home');
      }
      else {
         $this->db->transRollback();
         return redirect()->to(site_url());
      }
   }
}
?>