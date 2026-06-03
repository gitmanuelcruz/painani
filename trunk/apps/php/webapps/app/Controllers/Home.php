<?php
namespace App\Controllers;
use App\Models\MHome;

class Home extends BaseController
{
   function __construct() {
      $this->Modelo = new MHome();
   }
   //
   public function index() {
      if ($this->session->get("logueado") != true) {
         return redirect()->to(base_url());
      }
      else {
         $usuario = $this->session->get("usuario");
         $data["usuario"] = $usuario;
         $data['data_user']  = $this->utilerias->getDatosSession();
         return view('principal', $data);
      }
   }
   //
   public function getMenu() {
      $usuario  = $this->session->get("usuario");
      $resultado = $this->Modelo->getMenu($usuario)->getResult();
      $menu_view = "";
      $nivel_anterior = 0;
      $nivel_actual = 0;
      $recordCount = 0;
      $countCerrar = 0;
      $band = false;

      foreach ($resultado as $row) {
         $href = ($row->url_menu == "#") ? "href='javascript:void(0);'" : "href='".base_url($row->url_menu)."' ";
         $nivel_actual = $row->nivel;
         if ($nivel_actual == $nivel_anterior) {
            $menu_view .= "</li>";
            if ($row->hijos > 0) {
               $menu_view .= "<li>";
               $menu_view .= "   <a aria-expanded='false' class='' colapsar='colapsar' data-bs-toggle='collapse' href='#".$row->codigo_menu."'>"
                           . "      <i class='".$row->menu_icono." fa-sm me-1'></i>"
                           . "      <span>".$row->nombre_menu."</span>"
                           . "   </a>"
                           . "   <ul class='qwery collapse' id='".$row->codigo_menu."'>";
               $band = true;
            }
            else {
               $menu_view .= "<li>
                                 <a ".$href.">".$row->nombre_menu."</a>";
            }
         } else if ($nivel_actual < $nivel_anterior) {
            $countCerrar = $nivel_anterior - $nivel_actual + 1;
            for ($inode = 1; $inode <= $countCerrar; $inode++) {
               $menu_view .= "</li>";
               $countCerrar--;
            }
            if ($band == true) {
               $menu_view .= "</ul></li>";
               $band = false;
            }
            if ($row->hijos > 0) {
               $menu_view .= "<li>";
               $menu_view .= "   <a aria-expanded='false' class='' colapsar='colapsar' data-bs-toggle='collapse' href='#".$row->codigo_menu."'>"
                           . "      <i class='".$row->menu_icono." fa-sm me-1'></i>"
                           . "      <span>".$row->nombre_menu."</span>"
                           . "   </a>"
                           . "   <ul class='qwery collapse' id='".$row->codigo_menu."'>";
               $band = true;
            }
            else {
               $menu_view .= "<li>
                                 <a ".$href.">".$row->nombre_menu."</a>";
            }
            $recordCount++;
         }
         else if ($nivel_actual > $nivel_anterior) {
            if ($row->hijos > 0) {
               $menu_view .= "<li>";
               $menu_view .= "   <a aria-expanded='false' class='' colapsar='colapsar' data-bs-toggle='collapse' href='#".$row->codigo_menu."'>"
                           . "      <i class='".$row->menu_icono." fa-sm me-1'></i>"
                           . "      <span>".$row->nombre_menu."</span>"
                           . "   </a>"
                           . "   <ul class='qwery collapse' id='".$row->codigo_menu."'>";
               $band = true;
            }
            else {
               $menu_view .= "<li>
                                 <a ".$href.">".$row->nombre_menu."</a>";
            }
            $recordCount++;
         }
         $nivel_anterior = $nivel_actual;
      }

      if ($recordCount > 0) {
         for ($inode = 1; $inode <= $countCerrar + 1; $inode++) {
            if ($band == true) {
               if ($nivel_actual == 3) {
                  $menu_view .= "</li></li></ul></li>";
               }
               else {
                  $menu_view .= "</li></ul></li>";
               }
               $countCerrar--;
            }
         }
      }
      
      return $menu_view;
   }
   //
   public function actualizarPassword() {
      ini_set('max_execution_time', 0);
      if ($this->session->get("logueado") != true) {
         $response = array('respuesta' => false, 'mensaje' => 'Se terminó la sesión, vuelva a iniciar nuevamente');
      }
      else {
         $id_usuario = $this->request->getPost("id_usuario");
         $passwordNew = $this->request->getPost("password");
         $usuarioSession = $this->session->get("usuario");
         $ip = $this->session->get("ip");

         $result = $this->Modelo->actualizaPassword($id_usuario,$passwordNew,$usuarioSession,$ip);
         if($result[0]) {
            $response = array('respuesta' => true, 'mensaje' => 'El proceso se ha realizado correctamente');
         }
         else {
            $response = array('respuesta' => false, 'mensaje' => 'ERROR AL ACTUALIZAR LA CONSTRASE&Ntilde;A');
         }
      }
      return $this->response->setJSON($response);
   }
   //
   public function manuales() {
      $usuario = $this->session->get("usuario");
      $id_nivel_usuario = $this->session->get("id_nivel_usuario");

      if($id_nivel_usuario > 1){
         $privConfiguraciones = $this->utilerias->getValidaPrivilegio($usuario,'PRIV_MANUAL_CONFIGURACION',"PRIVILEGIO");
         $privOperativo       = $this->utilerias->getValidaPrivilegio($usuario,'PRIV_MANUAL_OPERATIVO',"PRIVILEGIO");
         $privSolicitudes     = $this->utilerias->getValidaPrivilegio($usuario,'PRIV_MANUAL_SOLICITUDES',"PRIVILEGIO");
         $privRemesas         = $this->utilerias->getValidaPrivilegio($usuario,'PRIV_MANUAL_REMESA',"PRIVILEGIO");
         $privNominas         = $this->utilerias->getValidaPrivilegio($usuario,'PRIV_MANUAL_NOMINAS',"PRIVILEGIO");
         //*
         $result = array(
            'manuales' => array(
               array($privOperativo,'Manual de usuario de operativos','manual_operativo.pdf')
            )
         );
      }
      else {
         $result = array(
            'manuales' => array(
               array(1,'Manual de usuario de operativos','manual_operativo.pdf')
            )
         );
      }

      return $this->response->setJSON($result);
   }
   //
   public function logout() {
      $idSesion   = $this->session->get("id_bitacora");
      $idUsuario  = $this->session->get("usuario");
      $ip         = $this->session->get("ip");
      $this->Modelo->actualizaBitacoraSesion($idSesion,$idUsuario,$ip);
      $this->session->destroy();
      return redirect()->to(site_url('Home'));
   }
}
